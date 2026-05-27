"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Review {
  id: string;
  clientName: string;
  city: string;
  rating: number;
  text: string;
  service: string;
  isActive: boolean;
  order: number;
  imageUrl: string | null;
  quoteId: string | null;
  createdAt: string;
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`w-3.5 h-3.5 ${i < rating ? "text-gold" : "text-carbon/20"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

function Avatar({ review }: { review: Review }) {
  if (review.imageUrl) {
    return (
      <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-carbon/10">
        <Image src={review.imageUrl} alt={review.clientName} fill className="object-cover" />
      </div>
    );
  }
  const initials = review.clientName
    .split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="w-10 h-10 rounded-full bg-carbon/8 flex items-center justify-center flex-shrink-0">
      <span className="text-carbon/50 text-xs font-semibold">{initials}</span>
    </div>
  );
}

export default function ReviewsAdminPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ clientName: "", city: "", rating: 5, text: "", service: "", isActive: true });
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reviews");
      const data = await res.json();
      if (Array.isArray(data)) setReviews(data);
    } catch {
      // leave reviews as-is on network/parse error
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/admin/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setShowForm(false);
    setForm({ clientName: "", city: "", rating: 5, text: "", service: "", isActive: true });
    load();
  }

  async function toggleActive(r: Review) {
    setTogglingId(r.id);
    await fetch(`/api/admin/reviews/${r.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !r.isActive }),
    });
    setTogglingId(null);
    load();
  }

  async function deleteReview(id: string) {
    if (!confirm("Delete this review?")) return;
    setDeletingId(id);
    await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
    setDeletingId(null);
    load();
  }

  const inputClass = "w-full px-3 py-2 border border-carbon/20 rounded-lg text-sm text-carbon focus:outline-none focus:border-gold transition-colors";

  const safeReviews = Array.isArray(reviews) ? reviews : [];
  const pending = safeReviews.filter((r) => !r.isActive && r.quoteId);
  const rest = safeReviews.filter((r) => r.isActive || !r.quoteId);

  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <p className="text-carbon/50 text-sm">{safeReviews.length} reviews</p>
          {pending.length > 0 && (
            <span className="text-xs px-2 py-0.5 bg-gold/15 text-gold font-semibold rounded-full">
              {pending.length} pending approval
            </span>
          )}
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-gold hover:bg-gold-light text-carbon text-sm font-semibold rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Review
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-carbon/8 p-6 mb-6">
          <h3 className="font-semibold text-carbon mb-4">New Review</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-carbon/50 mb-1">Client Name *</label>
                <input className={inputClass} value={form.clientName} onChange={e => setForm(f => ({ ...f, clientName: e.target.value }))} required maxLength={100} placeholder="Jane D." />
              </div>
              <div>
                <label className="block text-xs font-medium text-carbon/50 mb-1">City *</label>
                <input className={inputClass} value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} required maxLength={100} placeholder="West Palm Beach" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-carbon/50 mb-1">Service *</label>
                <input className={inputClass} value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))} required maxLength={100} placeholder="Kitchen Wraps" />
              </div>
              <div>
                <label className="block text-xs font-medium text-carbon/50 mb-1">Rating</label>
                <select className={inputClass} value={form.rating} onChange={e => setForm(f => ({ ...f, rating: parseInt(e.target.value) }))}>
                  {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Star{r !== 1 ? "s" : ""}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-carbon/50 mb-1">Review Text *</label>
              <textarea className={inputClass} value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))} required rows={3} maxLength={2000} />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="w-4 h-4 accent-gold" />
              <span className="text-sm text-carbon">Show on public website</span>
            </label>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="px-4 py-2 bg-gold text-carbon text-sm font-semibold rounded-lg disabled:opacity-50">
                {saving ? "Saving…" : "Save Review"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-carbon/60 hover:text-carbon">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-carbon/8 p-5 animate-pulse h-28" />
          ))}
        </div>
      ) : safeReviews.length === 0 ? (
        <div className="text-center py-16 text-carbon/40">No reviews yet.</div>
      ) : (
        <div className="space-y-3">
          {/* Pending client reviews first */}
          {pending.map((r) => (
            <ReviewCard
              key={r.id}
              r={r}
              togglingId={togglingId}
              deletingId={deletingId}
              onToggle={toggleActive}
              onDelete={deleteReview}
              highlight
            />
          ))}
          {rest.map((r) => (
            <ReviewCard
              key={r.id}
              r={r}
              togglingId={togglingId}
              deletingId={deletingId}
              onToggle={toggleActive}
              onDelete={deleteReview}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ReviewCard({
  r,
  togglingId,
  deletingId,
  onToggle,
  onDelete,
  highlight,
}: {
  r: Review;
  togglingId: string | null;
  deletingId: string | null;
  onToggle: (r: Review) => void;
  onDelete: (id: string) => void;
  highlight?: boolean;
}) {
  return (
    <div className={[
      "bg-white rounded-2xl border p-5",
      highlight ? "border-gold/30 ring-1 ring-gold/20" : "border-carbon/8",
      !r.isActive ? "opacity-70" : "",
    ].join(" ")}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <Avatar review={r} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <Stars rating={r.rating} />
              {r.quoteId && (
                <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-500 rounded font-medium">
                  from client link
                </span>
              )}
              {!r.isActive && (
                <span className="text-[10px] px-1.5 py-0.5 bg-carbon/10 text-carbon/40 rounded">Hidden</span>
              )}
            </div>
            <p className="text-carbon/80 text-sm leading-relaxed mb-2">&ldquo;{r.text}&rdquo;</p>
            <p className="text-xs text-carbon/50 font-medium">
              {r.clientName}
              <span className="font-normal text-carbon/30"> · {r.city}</span>
              <span className="font-normal text-carbon/30"> · {r.service}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => onToggle(r)}
            disabled={togglingId === r.id}
            className="text-xs text-carbon/50 hover:text-carbon transition-colors disabled:opacity-50"
          >
            {r.isActive ? "Hide" : "Publish"}
          </button>
          <button
            onClick={() => onDelete(r.id)}
            disabled={deletingId === r.id}
            className="text-xs text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
          >
            {deletingId === r.id ? "…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
