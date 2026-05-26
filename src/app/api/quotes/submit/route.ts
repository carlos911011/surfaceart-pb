import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadPhoto } from "@/lib/upload";
import { QuoteSubmitSchema } from "@/lib/validations";
import { getClientIp } from "@/lib/utils";
import { sendConfirmationEmail, sendNotificationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  // Parse and validate fields
  const raw = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    city: formData.get("city"),
    propertyType: formData.get("propertyType"),
    services: formData.getAll("services"),
    budget: formData.get("budget") || undefined,
    description: formData.get("description") || undefined,
    hearAboutUs: formData.get("hearAboutUs") || undefined,
  };

  const parsed = QuoteSubmitSchema.safeParse(raw);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as string;
      fields[key] = issue.message;
    }
    return NextResponse.json(
      { error: "Please fix the errors below", fields },
      { status: 422 }
    );
  }

  const data = parsed.data;

  // Generate a quote ID upfront so we can use it for the upload directory
  const { createId } = await import("@paralleldrive/cuid2");
  const quoteId = createId();

  // Upload photos (continue on partial failure)
  const photoFiles = formData.getAll("photos") as File[];
  const uploadResults: Array<{
    filename: string;
    originalName: string;
    size: number;
    mimeType: string;
    url: string;
  }> = [];
  const uploadErrors: string[] = [];

  for (const file of photoFiles) {
    if (!(file instanceof File) || file.size === 0) continue;
    try {
      const result = await uploadPhoto(file, quoteId);
      uploadResults.push(result);
    } catch (err) {
      uploadErrors.push(
        err instanceof Error ? err.message : `Failed to upload ${file.name}`
      );
    }
  }

  // Save to DB
  let quote;
  try {
    quote = await prisma.quoteRequest.create({
      data: {
        id: quoteId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        city: data.city,
        propertyType: data.propertyType,
        services: JSON.stringify(data.services),
        budget: data.budget,
        description: data.description,
        hearAboutUs: data.hearAboutUs,
        ipAddress: getClientIp(req),
        userAgent: req.headers.get("user-agent") ?? undefined,
        photos: {
          create: uploadResults.map((r) => ({
            filename: r.filename,
            originalName: r.originalName,
            size: r.size,
            mimeType: r.mimeType,
            url: r.url,
          })),
        },
        statusHistory: {
          create: { toStatus: "NEW" },
        },
      },
      include: { photos: true },
    });
  } catch (err) {
    console.error("DB error saving quote:", err);
    return NextResponse.json(
      { error: "Failed to save your request. Please try again." },
      { status: 500 }
    );
  }

  // Send emails (non-blocking — don't fail the request if email fails)
  try {
    await Promise.all([
      sendConfirmationEmail(quote),
      sendNotificationEmail(quote),
    ]);
  } catch (err) {
    console.error("Email error (quote saved successfully):", err);
  }

  return NextResponse.json({
    success: true,
    quoteId: quote.id,
    uploadErrors: uploadErrors.length > 0 ? uploadErrors : undefined,
  });
}
