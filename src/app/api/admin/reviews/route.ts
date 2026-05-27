import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadTestimonialImage } from "@/lib/upload";
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

  const contentType = req.headers.get("content-type") ?? "";

  let fields: Record<string, string> = {};
  let imageFile: File | null = null;

  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();
    for (const [key, value] of formData.entries()) {
      if (typeof value === "string") fields[key] = value;
    }
    const img = formData.get("image");
    if (img instanceof File && img.size > 0) imageFile = img;
  } else {
    const body = await req.json().catch(() => null);
    if (body && typeof body === "object") fields = body;
  }

  const parsed = CreateSchema.safeParse({
    ...fields,
    rating: fields.rating !== undefined ? Number(fields.rating) : undefined,
    isActive: fields.isActive !== undefined ? fields.isActive === "true" : undefined,
    order: fields.order !== undefined ? Number(fields.order) : undefined,
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  let imageUrl: string | undefined;
  if (imageFile) {
    try {
      imageUrl = await uploadTestimonialImage(imageFile);
    } catch (err) {
      return NextResponse.json({ error: String(err) }, { status: 400 });
    }
  }

  const review = await prisma.testimonial.create({
    data: { ...parsed.data, ...(imageUrl !== undefined && { imageUrl }) },
  });
  return NextResponse.json(review, { status: 201 });
}
