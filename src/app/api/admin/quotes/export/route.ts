import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function csvEscape(value: string | null | undefined): string {
  if (value == null) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function parseServices(raw: string): string {
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.join("; ") : raw;
  } catch {
    return raw;
  }
}

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const quotes = await prisma.quoteRequest.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      createdAt: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      city: true,
      propertyType: true,
      services: true,
      budget: true,
      description: true,
      hearAboutUs: true,
      status: true,
      quotedAmount: true,
      _count: { select: { photos: true } },
    },
  });

  const headers = [
    "ID", "Date", "First Name", "Last Name", "Email", "Phone",
    "City", "Property Type", "Services", "Budget", "Description",
    "How Found", "Status", "Quoted Amount", "Photos",
  ];

  const rows = quotes.map((q) => [
    q.id,
    q.createdAt.toISOString(),
    q.firstName,
    q.lastName,
    q.email,
    q.phone ?? "",
    q.city,
    q.propertyType,
    parseServices(q.services),
    q.budget ?? "",
    q.description ?? "",
    q.hearAboutUs ?? "",
    q.status,
    q.quotedAmount != null ? String(q.quotedAmount) : "",
    String(q._count.photos),
  ].map(csvEscape).join(","));

  const csv = [headers.join(","), ...rows].join("\n");
  const filename = `surfaceart-quotes-${new Date().toISOString().split("T")[0]}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
