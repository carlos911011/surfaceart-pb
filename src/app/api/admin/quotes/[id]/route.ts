import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteQuotePhotos } from "@/lib/upload";
import { sendReviewRequestEmail } from "@/lib/email";
import { z } from "zod";
import crypto from "crypto";

const UpdateSchema = z.object({
  status: z.enum(["NEW", "VIEWED", "QUOTED", "WON", "LOST", "ARCHIVED"]).optional(),
  internalNotes: z.string().max(5000).nullable().optional(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const quote = await prisma.quoteRequest.findUnique({
    where: { id },
    include: {
      photos: { orderBy: { createdAt: "asc" } },
      statusHistory: { orderBy: { changedAt: "desc" } },
    },
  });

  if (!quote) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Mark as VIEWED if still NEW
  if (quote.status === "NEW") {
    await prisma.quoteRequest.update({ where: { id }, data: { status: "VIEWED" } });
    await prisma.statusLog.create({
      data: { quoteId: id, fromStatus: "NEW", toStatus: "VIEWED" },
    });
    return NextResponse.json({ ...quote, status: "VIEWED" });
  }

  return NextResponse.json(quote);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const body = await req.json().catch(() => null);
  const parsed = UpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const existing = await prisma.quoteRequest.findUnique({
    where: { id },
    select: { status: true, firstName: true, email: true, reviewToken: true },
  });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { status, internalNotes } = parsed.data;

  // Generate review token when transitioning to WON (only once)
  let reviewToken = existing.reviewToken;
  const transitioningToWon = status === "WON" && existing.status !== "WON";
  if (transitioningToWon && !reviewToken) {
    reviewToken = crypto.randomBytes(32).toString("hex");
  }

  const updated = await prisma.quoteRequest.update({
    where: { id },
    data: {
      ...(status !== undefined && { status }),
      ...(internalNotes !== undefined && { internalNotes }),
      ...(reviewToken !== existing.reviewToken && { reviewToken }),
    },
  });

  if (status && status !== existing.status) {
    await prisma.statusLog.create({
      data: { quoteId: id, fromStatus: existing.status, toStatus: status },
    });
  }

  if (transitioningToWon && reviewToken) {
    const appUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    const reviewUrl = `${appUrl}/review/${reviewToken}`;
    sendReviewRequestEmail({
      firstName: existing.firstName,
      email: existing.email,
      reviewUrl,
    }).catch((err) => console.error("[review-email]", err));
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const existing = await prisma.quoteRequest.findUnique({ where: { id }, select: { id: true } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Delete photos from disk, then DB record (cascade handles related rows)
  await deleteQuotePhotos(id);
  await prisma.quoteRequest.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
