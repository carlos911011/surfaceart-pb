import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendCustomEmail } from "@/lib/email";
import { z } from "zod";

const EmailSchema = z.object({
  subject: z.string().min(1).max(300),
  body: z.string().min(1).max(10000),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const quote = await prisma.quoteRequest.findUnique({
    where: { id },
    select: { email: true, firstName: true, lastName: true },
  });
  if (!quote) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json().catch(() => null);
  const parsed = EmailSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { subject, body: emailBody } = parsed.data;

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#F5F0E8;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;margin-bottom:24px;">
      <h1 style="font-family:Georgia,serif;font-size:24px;color:#1C1C1A;margin:0;">SurfaceArt</h1>
      <p style="color:#B8965A;font-size:10px;letter-spacing:3px;text-transform:uppercase;margin:4px 0 0;">Palm Beach</p>
    </div>
    <div style="background:#FAFAF7;border-radius:16px;padding:32px;border:1px solid rgba(28,28,26,0.08);">
      <p style="color:#1C1C1A;font-size:15px;line-height:1.7;white-space:pre-wrap;">${emailBody}</p>
    </div>
    <p style="text-align:center;color:#1C1C1A;opacity:0.4;font-size:12px;margin-top:20px;">SurfaceArt Palm Beach · Licensed & Insured</p>
  </div>
</body>
</html>`;

  await sendCustomEmail({ to: quote.email, subject, html });

  return NextResponse.json({ success: true, sentTo: quote.email });
}
