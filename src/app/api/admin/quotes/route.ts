import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "20")));
  const status = searchParams.get("status") ?? undefined;
  const search = searchParams.get("search")?.trim() ?? undefined;
  const sortBy = searchParams.get("sortBy") ?? "createdAt";
  const sortDir = searchParams.get("sortDir") === "asc" ? "asc" : "desc";

  const validSortFields = ["createdAt", "firstName", "lastName", "city", "status"];
  const orderField = validSortFields.includes(sortBy) ? sortBy : "createdAt";

  type WhereClause = {
    status?: string;
    OR?: Array<{ firstName?: { contains: string }; lastName?: { contains: string }; email?: { contains: string }; city?: { contains: string }; phone?: { contains: string } }>;
  };

  const where: WhereClause = {};

  if (status && status !== "ALL") {
    where.status = status;
  }

  if (search) {
    where.OR = [
      { firstName: { contains: search } },
      { lastName: { contains: search } },
      { email: { contains: search } },
      { city: { contains: search } },
      { phone: { contains: search } },
    ];
  }

  const [quotes, total] = await Promise.all([
    prisma.quoteRequest.findMany({
      where,
      orderBy: { [orderField]: sortDir },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        city: true,
        propertyType: true,
        services: true,
        budget: true,
        status: true,
        createdAt: true,
        _count: { select: { photos: true } },
      },
    }),
    prisma.quoteRequest.count({ where }),
  ]);

  return NextResponse.json({
    quotes,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
}
