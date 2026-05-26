import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const [total, newThisWeek, byStatus] = await Promise.all([
    prisma.quoteRequest.count(),
    prisma.quoteRequest.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.quoteRequest.groupBy({ by: ["status"], _count: true }),
  ]);

  const statusMap = Object.fromEntries(byStatus.map((s) => [s.status, s._count]));

  return NextResponse.json({ total, newThisWeek, statusMap });
}
