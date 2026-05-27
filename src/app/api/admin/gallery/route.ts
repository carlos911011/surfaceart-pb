import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const CreateSchema = z.object({
  title: z.string().min(1).max(200),
  service: z.string().min(1).max(100),
  city: z.string().max(100).optional(),
  description: z.string().max(1000).optional(),
  beforeImage: z.string().min(1),
  afterImage: z.string().min(1),
  isPublic: z.boolean().optional(),
  order: z.number().int().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const items = await prisma.galleryItem.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
  }

  const item = await prisma.galleryItem.create({ data: parsed.data });
  revalidatePath("/api/gallery");
  revalidatePath("/");
  return NextResponse.json(item, { status: 201 });
}
