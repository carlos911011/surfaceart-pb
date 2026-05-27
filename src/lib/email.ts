import nodemailer from "nodemailer";
import { parseJsonSafe } from "./utils";

function createTransport() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT ?? "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    // Dev fallback: log to console instead of sending
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

interface QuoteForEmail {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  city: string;
  propertyType: string;
  services: string;
  budget?: string | null;
  description?: string | null;
  hearAboutUs?: string | null;
  photos?: Array<{ url: string }>;
}

function servicesList(services: string): string {
  const arr = parseJsonSafe<string[]>(services, []);
  return arr.join(", ");
}

export async function sendConfirmationEmail(quote: QuoteForEmail): Promise<void> {
  const transport = createTransport();
  const services = servicesList(quote.services);
  const photoCount = quote.photos?.length ?? 0;
  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME ?? "SurfaceArt Palm Beach";
  const companyPhone = process.env.NEXT_PUBLIC_COMPANY_PHONE ?? "(561) 000-0000";
  const companyEmail = process.env.NEXT_PUBLIC_COMPANY_EMAIL ?? "hello@surfaceartpb.com";

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F5F0E8;font-family:'Outfit',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px;">
      <h1 style="font-family:Georgia,serif;font-size:28px;color:#1C1C1A;margin:0;">SurfaceArt</h1>
      <p style="color:#B8965A;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:4px 0 0;">Palm Beach · Est. 2025</p>
    </div>
    <!-- Card -->
    <div style="background:#FAFAF7;border-radius:16px;padding:32px;border:1px solid rgba(28,28,26,0.08);">
      <h2 style="font-family:Georgia,serif;font-size:22px;color:#1C1C1A;margin:0 0 8px;">Hi ${quote.firstName}!</h2>
      <p style="color:#1C1C1A;opacity:0.7;margin:0 0 24px;">We've received your quote request and will get back to you within <strong>24 hours</strong>.</p>

      <!-- Summary -->
      <div style="background:#F5F0E8;border-radius:12px;padding:20px;margin-bottom:24px;">
        <h3 style="font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:#B8965A;margin:0 0 12px;">Your Request Summary</h3>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="color:#1C1C1A;opacity:0.6;font-size:13px;padding:4px 0;width:40%;">Services</td><td style="color:#1C1C1A;font-size:13px;font-weight:500;">${services}</td></tr>
          <tr><td style="color:#1C1C1A;opacity:0.6;font-size:13px;padding:4px 0;">Location</td><td style="color:#1C1C1A;font-size:13px;font-weight:500;">${quote.city}</td></tr>
          <tr><td style="color:#1C1C1A;opacity:0.6;font-size:13px;padding:4px 0;">Property</td><td style="color:#1C1C1A;font-size:13px;font-weight:500;">${quote.propertyType}</td></tr>
          ${quote.budget ? `<tr><td style="color:#1C1C1A;opacity:0.6;font-size:13px;padding:4px 0;">Budget</td><td style="color:#1C1C1A;font-size:13px;font-weight:500;">${quote.budget}</td></tr>` : ""}
          ${photoCount > 0 ? `<tr><td style="color:#1C1C1A;opacity:0.6;font-size:13px;padding:4px 0;">Photos</td><td style="color:#1C1C1A;font-size:13px;font-weight:500;">${photoCount} photo${photoCount > 1 ? "s" : ""} uploaded</td></tr>` : ""}
        </table>
      </div>

      <!-- What happens next -->
      <h3 style="font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:#B8965A;margin:0 0 12px;">What Happens Next</h3>
      <ol style="padding-left:20px;margin:0 0 24px;">
        <li style="color:#1C1C1A;opacity:0.7;font-size:14px;padding:4px 0;">We review your photos and project details</li>
        <li style="color:#1C1C1A;opacity:0.7;font-size:14px;padding:4px 0;">We prepare your personalized estimate</li>
        <li style="color:#1C1C1A;opacity:0.7;font-size:14px;padding:4px 0;">We contact you within 24 hours with your quote</li>
      </ol>

      <p style="color:#1C1C1A;opacity:0.6;font-size:13px;margin:0;">Need to reach us sooner? <a href="tel:${companyPhone.replace(/[^+\d]/g, "")}" style="color:#B8965A;">${companyPhone}</a> or <a href="mailto:${companyEmail}" style="color:#B8965A;">${companyEmail}</a></p>
    </div>

    <!-- Footer -->
    <div style="text-align:center;margin-top:24px;">
      <p style="color:#1C1C1A;opacity:0.4;font-size:12px;">© ${new Date().getFullYear()} ${companyName} · Licensed & Insured · 3M DI-NOC Preferred Installer</p>
    </div>
  </div>
</body>
</html>`;

  if (!transport) {
    console.log(`[DEV] Confirmation email to ${quote.email}:\n Subject: Your free quote request has been received\n Services: ${services}`);
    return;
  }

  await transport.sendMail({
    from: `"${companyName}" <${process.env.SMTP_USER}>`,
    to: quote.email,
    subject: `Your free quote request has been received — ${companyName}`,
    html,
  });
}

export async function sendNotificationEmail(quote: QuoteForEmail): Promise<void> {
  const transport = createTransport();
  const services = servicesList(quote.services);
  const photoCount = quote.photos?.length ?? 0;
  const notificationEmail = process.env.NOTIFICATION_EMAIL;
  const appUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  if (!notificationEmail) return;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#F5F0E8;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="background:#FAFAF7;border-radius:16px;padding:32px;border:1px solid rgba(28,28,26,0.08);">
      <h2 style="font-family:Georgia,serif;font-size:22px;color:#1C1C1A;margin:0 0 4px;">🔔 New Quote Request</h2>
      <p style="color:#B8965A;font-size:13px;margin:0 0 24px;">${quote.firstName} ${quote.lastName} · ${quote.city} · ${services}</p>

      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr style="background:#F5F0E8;"><td colspan="2" style="padding:8px 12px;font-weight:600;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#B8965A;">Client Information</td></tr>
        <tr><td style="padding:8px 12px;color:#666;width:35%;">Name</td><td style="padding:8px 12px;font-weight:500;">${quote.firstName} ${quote.lastName}</td></tr>
        <tr style="background:#fafafa;"><td style="padding:8px 12px;color:#666;">Email</td><td style="padding:8px 12px;"><a href="mailto:${quote.email}" style="color:#B8965A;">${quote.email}</a></td></tr>
        ${quote.phone ? `<tr><td style="padding:8px 12px;color:#666;">Phone</td><td style="padding:8px 12px;"><a href="tel:${quote.phone}" style="color:#B8965A;">${quote.phone}</a></td></tr>` : ""}
        <tr style="background:#fafafa;"><td style="padding:8px 12px;color:#666;">City</td><td style="padding:8px 12px;">${quote.city}</td></tr>
        <tr><td style="padding:8px 12px;color:#666;">Property</td><td style="padding:8px 12px;">${quote.propertyType}</td></tr>
        <tr style="background:#F5F0E8;"><td colspan="2" style="padding:8px 12px;font-weight:600;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#B8965A;">Request Details</td></tr>
        <tr><td style="padding:8px 12px;color:#666;">Services</td><td style="padding:8px 12px;font-weight:500;">${services}</td></tr>
        ${quote.budget ? `<tr style="background:#fafafa;"><td style="padding:8px 12px;color:#666;">Budget</td><td style="padding:8px 12px;">${quote.budget}</td></tr>` : ""}
        <tr><td style="padding:8px 12px;color:#666;">Photos</td><td style="padding:8px 12px;">${photoCount} photo${photoCount !== 1 ? "s" : ""} uploaded</td></tr>
        ${quote.hearAboutUs ? `<tr style="background:#fafafa;"><td style="padding:8px 12px;color:#666;">Source</td><td style="padding:8px 12px;">${quote.hearAboutUs}</td></tr>` : ""}
        ${quote.description ? `<tr style="background:#F5F0E8;"><td colspan="2" style="padding:8px 12px;font-weight:600;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#B8965A;">Client Description</td></tr><tr><td colspan="2" style="padding:12px;line-height:1.6;">${quote.description}</td></tr>` : ""}
      </table>

      <div style="text-align:center;margin-top:24px;">
        <a href="${appUrl}/admin/quotes/${quote.id}" style="display:inline-block;background:#B8965A;color:#1C1C1A;font-weight:600;padding:14px 28px;border-radius:12px;text-decoration:none;font-size:15px;">View Full Request →</a>
      </div>

      <p style="color:#999;font-size:12px;text-align:center;margin-top:16px;">Submitted at ${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })} ET</p>
    </div>
  </div>
</body>
</html>`;

  if (!transport) {
    console.log(`[DEV] Notification email:\n Subject: 🔔 New Quote Request — ${quote.firstName} ${quote.lastName} · ${quote.city}\n Services: ${services}\n View: ${appUrl}/admin/quotes/${quote.id}`);
    return;
  }

  await transport.sendMail({
    from: `"SurfaceArt Notifications" <${process.env.SMTP_USER}>`,
    to: notificationEmail,
    subject: `🔔 New Quote Request — ${quote.firstName} ${quote.lastName} · ${quote.city} · ${services}`,
    html,
  });
}

export async function sendReviewRequestEmail({
  firstName,
  email,
  reviewUrl,
}: {
  firstName: string;
  email: string;
  reviewUrl: string;
}): Promise<void> {
  const transport = createTransport();
  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME ?? "SurfaceArt Palm Beach";
  const companyPhone = process.env.NEXT_PUBLIC_COMPANY_PHONE ?? "(561) 000-0000";

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F5F0E8;font-family:'Outfit',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;margin-bottom:32px;">
      <h1 style="font-family:Georgia,serif;font-size:28px;color:#1C1C1A;margin:0;">SurfaceArt</h1>
      <p style="color:#B8965A;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:4px 0 0;">Palm Beach · Est. 2025</p>
    </div>
    <div style="background:#FAFAF7;border-radius:16px;padding:32px;border:1px solid rgba(28,28,26,0.08);">
      <h2 style="font-family:Georgia,serif;font-size:22px;color:#1C1C1A;margin:0 0 8px;">Hi ${firstName}!</h2>
      <p style="color:#1C1C1A;opacity:0.7;margin:0 0 24px;line-height:1.6;">
        We hope you're loving your new surface transformation! We'd be honored if you took a moment to share your experience — your feedback helps other homeowners make confident decisions.
      </p>

      <div style="background:#F5F0E8;border-radius:12px;padding:20px;margin-bottom:28px;text-align:center;">
        <p style="color:#1C1C1A;opacity:0.7;font-size:13px;margin:0 0 4px;">It only takes 2 minutes</p>
        <p style="font-family:Georgia,serif;font-size:17px;color:#1C1C1A;font-weight:400;margin:0;">Rate your experience · Share your story · Add a photo</p>
      </div>

      <div style="text-align:center;margin-bottom:28px;">
        <a href="${reviewUrl}" style="display:inline-block;background:#B8965A;color:#1C1C1A;font-weight:700;padding:16px 36px;border-radius:12px;text-decoration:none;font-size:16px;letter-spacing:0.3px;">
          Leave Your Review →
        </a>
      </div>

      <p style="color:#1C1C1A;opacity:0.5;font-size:12px;margin:0;text-align:center;">
        This link is personal and only works once. Questions? Call us at <a href="tel:${companyPhone.replace(/[^+\d]/g, "")}" style="color:#B8965A;">${companyPhone}</a>
      </p>
    </div>
    <div style="text-align:center;margin-top:24px;">
      <p style="color:#1C1C1A;opacity:0.4;font-size:12px;">© ${new Date().getFullYear()} ${companyName} · Licensed & Insured</p>
    </div>
  </div>
</body>
</html>`;

  if (!transport) {
    console.log(`[DEV] Review request email to ${email}:\n Link: ${reviewUrl}`);
    return;
  }

  await transport.sendMail({
    from: `"${companyName}" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `How did we do, ${firstName}? We'd love your feedback 🌟`,
    html,
  });
}

export async function sendCustomEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  const transport = createTransport();
  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME ?? "SurfaceArt Palm Beach";

  if (!transport) {
    console.log(`[DEV] Custom email to ${to}: ${subject}`);
    return;
  }

  await transport.sendMail({
    from: `"${companyName}" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
}
