import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const CreateSchema = z.object({
  clientName: z.string().min(1).max(100),
  city: z.string().min(1).max(100),
  rating: z.number().int().min(1).max(5).default(5),
  text: z.string().min(1).max(2000),
  service: z.string().min(1).max(100),
  isActive: z.boolean().optional(),
  order: z.number().int().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const reviews = await prisma.testimonial.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const review = await prisma.testimonial.create({ data: parsed.data });
  return NextResponse.json(review, { status: 201 });
}
