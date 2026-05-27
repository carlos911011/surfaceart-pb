import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadTestimonialImage } from "@/lib/upload";
import { parseJsonSafe } from "@/lib/utils";

type Params = { params: Promise<{ token: string }> };

async function resolveQuote(token: string) {
  const quote = await prisma.quoteRequest.findUnique({
    where: { reviewToken: token },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      city: true,
      services: true,
    },
  });
  if (!quote) return null;

  // Check if a testimonial was already submitted for this quote
  const existing = await prisma.testimonial.findUnique({ where: { quoteId: quote.id }, select: { id: true } });
  if (existing) return null; // token already used

  return quote;
}

export async function GET(_req: NextRequest, { params }: Params) {
  const { token } = await params;
  const quote = await resolveQuote(token);
  if (!quote) return NextResponse.json({ error: "Invalid or already used link" }, { status: 404 });

  const services = parseJsonSafe<string[]>(quote.services, []);

  return NextResponse.json({
    clientName: `${quote.firstName} ${quote.lastName}`,
    city: quote.city,
    service: services[0] ?? "",
    services,
  });
}

export async function POST(req: NextRequest, { params }: Params) {
  const { token } = await params;
  const quote = await resolveQuote(token);
  if (!quote) return NextResponse.json({ error: "Invalid or already used link" }, { status: 404 });

  let clientName: string;
  let city: string;
  let service: string;
  let rating: number;
  let text: string;
  let imageFile: File | null = null;

  const contentType = req.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();
    clientName = String(formData.get("clientName") ?? "").trim();
    city = String(formData.get("city") ?? "").trim();
    service = String(formData.get("service") ?? "").trim();
    rating = parseInt(String(formData.get("rating") ?? "5"), 10);
    text = String(formData.get("text") ?? "").trim();
    const img = formData.get("image");
    if (img instanceof File && img.size > 0) imageFile = img;
  } else {
    const body = await req.json().catch(() => null);
    clientName = String(body?.clientName ?? "").trim();
    city = String(body?.city ?? "").trim();
    service = String(body?.service ?? "").trim();
    rating = parseInt(String(body?.rating ?? "5"), 10);
    text = String(body?.text ?? "").trim();
  }

  if (!clientName || !city || !service || !text) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (isNaN(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be 1–5" }, { status: 400 });
  }
  if (text.length > 2000) {
    return NextResponse.json({ error: "Review text too long" }, { status: 400 });
  }

  let imageUrl: string | undefined;
  if (imageFile) {
    try {
      imageUrl = await uploadTestimonialImage(imageFile);
    } catch (err) {
      return NextResponse.json({ error: String(err) }, { status: 400 });
    }
  }

  const testimonial = await prisma.testimonial.create({
    data: {
      clientName,
      city,
      service,
      rating,
      text,
      imageUrl,
      quoteId: quote.id,
      isActive: false,
    },
  });

  return NextResponse.json({ id: testimonial.id }, { status: 201 });
}
