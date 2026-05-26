"use client";

import { useState, useEffect, useCallback } from "react";
import QuoteDetailPanel from "./QuoteDetailPanel";

interface QuoteRow {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  city: string;
  propertyType: string;
  services: string;
  budget: string | null;
  status: string;
  createdAt: string;
  _count: { photos: number };
}

interface QuoteListResponse {
  quotes: QuoteRow[];
  total: number;
  page: number;
  totalPages: number;
}

const STATUS_OPTIONS = [
  { value: "ALL", label: "All Status" },
  { value: "NEW", label: "New" },
  { value: "VIEWED", label: "Viewed" },
  { value: "QUOTED", label: "Quoted" },
  { value: "WON", label: "Won" },
  { value: "LOST", label: "Lost" },
  { value: "ARCHIVED", label: "Archived" },
];

function statusBadge(status: string) {
  const map: Record<string, string> = {
    NEW: "bg-blue-100 text-blue-700",
    VIEWED: "bg-yellow-100 text-yellow-700",
    QUOTED: "bg-purple-100 text-purple-700",
    WON: "bg-green-100 text-green-700",
    LOST: "bg-red-100 text-red-700",
    ARCHIVED: "bg-carbon/10 text-carbon/50",
  };
  return map[status] ?? "bg-carbon/10 text-carbon/50";
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short", day: "numeric", year: "numeric",
  }).format(new Date(iso));
}

function parseServices(raw: string): string {
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.join(", ") : raw;
  } catch {
    return raw;
  }
}

export default function QuotesTable() {
  const [data, setData] = useState<QuoteListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const fetchQuotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
        status: statusFilter,
        sortBy,
        sortDir,
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
      });
      const res = await fetch(`/api/admin/quotes?${params}`);
      if (!res.ok) throw new Error("Failed to load");
      setData(await res.json());
    } catch {
      setError("Failed to load quotes. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, sortBy, sortDir, debouncedSearch]);

  useEffect(() => { fetchQuotes(); }, [fetchQuotes]);

  function toggleSort(field: string) {
    if (sortBy === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDir("desc");
    }
    setPage(1);
  }

  function SortIcon({ field }: { field: string }) {
    if (sortBy !== field) return <span className="text-carbon/20 ml-1">↕</span>;
    return <span className="text-gold ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>;
  }

  return (
    <div className="p-6 sm:p-8">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-carbon/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            placeholder="Search name, email, city…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-carbon/20 rounded-xl text-sm text-carbon bg-white focus:outline-none focus:border-gold transition-colors"
          />
        </div>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 border border-carbon/20 rounded-xl text-sm text-carbon bg-white focus:outline-none focus:border-gold transition-colors appearance-none pr-8"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {/* Count + Export */}
        <div className="flex items-center gap-3 text-sm text-carbon/40 sm:ml-auto">
          {data && !loading && `${data.total} result${data.total !== 1 ? "s" : ""}`}
          <a
            href="/api/admin/quotes/export"
            download
            className="flex items-center gap-1.5 px-3 py-1.5 border border-carbon/20 rounded-lg text-carbon/60 hover:text-carbon hover:border-carbon/40 transition-colors text-xs"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            CSV
          </a>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-carbon/8 overflow-hidden">
        {error ? (
          <div className="p-8 text-center text-red-500 text-sm">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-carbon/8 bg-carbon/2">
                  <th className="text-left px-4 py-3 font-medium text-carbon/50 cursor-pointer whitespace-nowrap" onClick={() => toggleSort("firstName")}>
                    Client <SortIcon field="firstName" />
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-carbon/50 hidden md:table-cell">Services</th>
                  <th className="text-left px-4 py-3 font-medium text-carbon/50 cursor-pointer hidden lg:table-cell whitespace-nowrap" onClick={() => toggleSort("city")}>
                    City <SortIcon field="city" />
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-carbon/50 cursor-pointer whitespace-nowrap" onClick={() => toggleSort("status")}>
                    Status <SortIcon field="status" />
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-carbon/50 hidden sm:table-cell">Photos</th>
                  <th className="text-left px-4 py-3 font-medium text-carbon/50 cursor-pointer hidden sm:table-cell whitespace-nowrap" onClick={() => toggleSort("createdAt")}>
                    Date <SortIcon field="createdAt" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-carbon/5 animate-pulse">
                      <td className="px-4 py-3"><div className="h-4 bg-carbon/8 rounded w-32" /></td>
                      <td className="px-4 py-3 hidden md:table-cell"><div className="h-4 bg-carbon/8 rounded w-40" /></td>
                      <td className="px-4 py-3 hidden lg:table-cell"><div className="h-4 bg-carbon/8 rounded w-24" /></td>
                      <td className="px-4 py-3"><div className="h-5 bg-carbon/8 rounded-full w-16" /></td>
                      <td className="px-4 py-3 hidden sm:table-cell"><div className="h-4 bg-carbon/8 rounded w-8" /></td>
                      <td className="px-4 py-3 hidden sm:table-cell"><div className="h-4 bg-carbon/8 rounded w-20" /></td>
                    </tr>
                  ))
                ) : data?.quotes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-carbon/40">
                      <svg className="w-10 h-10 mx-auto mb-3 text-carbon/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      No quote requests found
                    </td>
                  </tr>
                ) : (
                  data?.quotes.map((q) => (
                    <tr
                      key={q.id}
                      onClick={() => setSelectedId(q.id)}
                      className={[
                        "border-b border-carbon/5 cursor-pointer transition-colors",
                        selectedId === q.id ? "bg-gold/5" : "hover:bg-carbon/2",
                      ].join(" ")}
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-carbon">{q.firstName} {q.lastName}</p>
                        <p className="text-xs text-carbon/40 truncate max-w-[160px]">{q.email}</p>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <p className="text-carbon/70 truncate max-w-[200px]">{parseServices(q.services)}</p>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-carbon/70">{q.city}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusBadge(q.status)}`}>
                          {q.status.charAt(0) + q.status.slice(1).toLowerCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell text-carbon/50">
                        {q._count.photos > 0 ? (
                          <span className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {q._count.photos}
                          </span>
                        ) : (
                          <span className="text-carbon/20">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell text-carbon/50 whitespace-nowrap">
                        {formatDate(q.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-carbon/8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="text-sm text-carbon/60 hover:text-carbon disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
            <span className="text-sm text-carbon/40">
              Page {page} of {data.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
              disabled={page === data.totalPages}
              className="text-sm text-carbon/60 hover:text-carbon disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
            >
              Next
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Detail panel */}
      {selectedId && (
        <QuoteDetailPanel
          quoteId={selectedId}
          onClose={() => setSelectedId(null)}
          onStatusChange={fetchQuotes}
        />
      )}
    </div>
  );
}
