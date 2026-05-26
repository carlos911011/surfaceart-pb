import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";

async function getStats() {
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const monthAgo = new Date(now);
  monthAgo.setDate(monthAgo.getDate() - 30);

  const [total, newThisWeek, newThisMonth, byStatus] = await Promise.all([
    prisma.quoteRequest.count(),
    prisma.quoteRequest.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.quoteRequest.count({ where: { createdAt: { gte: monthAgo } } }),
    prisma.quoteRequest.groupBy({ by: ["status"], _count: true }),
  ]);

  const statusMap = Object.fromEntries(byStatus.map((s) => [s.status, s._count]));

  return { total, newThisWeek, newThisMonth, statusMap };
}

async function getRecentQuotes() {
  return prisma.quoteRequest.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      city: true,
      status: true,
      createdAt: true,
    },
  });
}

function statusBadgeClass(status: string): string {
  switch (status) {
    case "NEW": return "bg-blue-100 text-blue-700";
    case "VIEWED": return "bg-yellow-100 text-yellow-700";
    case "QUOTED": return "bg-purple-100 text-purple-700";
    case "WON": return "bg-green-100 text-green-700";
    case "LOST": return "bg-red-100 text-red-700";
    case "ARCHIVED": return "bg-carbon/10 text-carbon/50";
    default: return "bg-carbon/10 text-carbon/50";
  }
}

function statusLabel(status: string): string {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

function formatDate(d: Date): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(d);
}

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const [stats, recentQuotes] = await Promise.all([getStats(), getRecentQuotes()]);

  const statCards = [
    {
      label: "Total Requests",
      value: stats.total,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "New This Week",
      value: stats.newThisWeek,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "This Month",
      value: stats.newThisMonth,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Won / Closed",
      value: stats.statusMap["WON"] ?? 0,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      color: "text-gold",
      bg: "bg-gold/10",
    },
  ];

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto">
      {/* Welcome */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-carbon">
          Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"}
        </h2>
        <p className="text-carbon/50 mt-1 text-sm">Here&apos;s what&apos;s happening with your quote requests.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl border border-carbon/8 p-5">
            <div className={`w-11 h-11 rounded-xl ${card.bg} flex items-center justify-center mb-4 ${card.color}`}>
              {card.icon}
            </div>
            <p className="text-3xl font-bold text-carbon">{card.value}</p>
            <p className="text-sm text-carbon/50 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Status breakdown */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-carbon/8 p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-carbon">Recent Requests</h3>
            <Link
              href="/admin/quotes"
              className="text-sm text-gold hover:underline"
            >
              View all
            </Link>
          </div>

          {recentQuotes.length === 0 ? (
            <div className="text-center py-8 text-carbon/40">
              <svg className="w-10 h-10 mx-auto mb-2 text-carbon/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm">No requests yet</p>
            </div>
          ) : (
            <ul className="divide-y divide-carbon/8">
              {recentQuotes.map((q) => (
                <li key={q.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-carbon text-sm truncate">
                      {q.firstName} {q.lastName}
                    </p>
                    <p className="text-xs text-carbon/40 truncate">{q.email} · {q.city}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadgeClass(q.status)}`}>
                      {statusLabel(q.status)}
                    </span>
                    <span className="text-xs text-carbon/40 hidden sm:block">{formatDate(q.createdAt)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Status breakdown panel */}
        <div className="bg-white rounded-2xl border border-carbon/8 p-6">
          <h3 className="font-semibold text-carbon mb-5">By Status</h3>
          <ul className="space-y-3">
            {[
              { key: "NEW", label: "New", color: "bg-blue-500" },
              { key: "VIEWED", label: "Viewed", color: "bg-yellow-500" },
              { key: "QUOTED", label: "Quoted", color: "bg-purple-500" },
              { key: "WON", label: "Won", color: "bg-green-500" },
              { key: "LOST", label: "Lost", color: "bg-red-400" },
              { key: "ARCHIVED", label: "Archived", color: "bg-carbon/30" },
            ].map(({ key, label, color }) => {
              const count = stats.statusMap[key] ?? 0;
              const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
              return (
                <li key={key}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-carbon/70">{label}</span>
                    <span className="font-medium text-carbon">{count}</span>
                  </div>
                  <div className="h-1.5 bg-carbon/8 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${color} rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { href: "/admin/quotes", label: "Manage Quotes", desc: "View and update all requests" },
          { href: "/admin/gallery", label: "Edit Gallery", desc: "Add or remove portfolio photos" },
          { href: "/admin/reviews", label: "Manage Reviews", desc: "Approve and publish testimonials" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="bg-white rounded-2xl border border-carbon/8 p-5 hover:border-gold/30 hover:shadow-sm transition-all duration-200 group"
          >
            <p className="font-medium text-carbon group-hover:text-gold transition-colors">{item.label}</p>
            <p className="text-xs text-carbon/40 mt-1">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
