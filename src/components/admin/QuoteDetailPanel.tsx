"use client";

import { useState, useEffect, useRef } from "react";

interface QuotePhoto {
  id: string;
  url: string;
  originalName: string;
  size: number;
}

interface StatusLogEntry {
  id: string;
  fromStatus: string | null;
  toStatus: string;
  changedAt: string;
  note: string | null;
}

interface QuoteDetail {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  city: string;
  propertyType: string;
  services: string;
  budget: string | null;
  description: string | null;
  hearAboutUs: string | null;
  status: string;
  internalNotes: string | null;
  quotedAmount: number | null;
  createdAt: string;
  photos: QuotePhoto[];
  statusHistory: StatusLogEntry[];
}

const STATUS_OPTIONS = [
  { value: "NEW", label: "New", color: "text-blue-600 bg-blue-50 border-blue-200" },
  { value: "VIEWED", label: "Viewed", color: "text-yellow-600 bg-yellow-50 border-yellow-200" },
  { value: "QUOTED", label: "Quoted", color: "text-purple-600 bg-purple-50 border-purple-200" },
  { value: "WON", label: "Won", color: "text-green-600 bg-green-50 border-green-200" },
  { value: "LOST", label: "Lost", color: "text-red-500 bg-red-50 border-red-200" },
  { value: "ARCHIVED", label: "Archived", color: "text-carbon/40 bg-carbon/5 border-carbon/20" },
];

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit",
  }).format(new Date(iso));
}

function parseServices(raw: string): string[] {
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [raw];
  } catch {
    return [raw];
  }
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

interface Props {
  quoteId: string;
  onClose: () => void;
  onStatusChange: () => void;
}

export default function QuoteDetailPanel({ quoteId, onClose, onStatusChange }: Props) {
  const [quote, setQuote] = useState<QuoteDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [notes, setNotes] = useState("");
  const [notesChanged, setNotesChanged] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState<QuotePhoto | null>(null);
  const [emailOpen, setEmailOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/quotes/${quoteId}`)
      .then((r) => r.json())
      .then((data) => {
        setQuote(data);
        setNotes(data.internalNotes ?? "");
      })
      .finally(() => setLoading(false));
  }, [quoteId]);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (lightboxPhoto) setLightboxPhoto(null);
        else onClose();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, lightboxPhoto]);

  async function updateStatus(status: string) {
    if (!quote) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/quotes/${quoteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const updated = await res.json();
        setQuote((prev) => prev ? { ...prev, status: updated.status } : prev);
        onStatusChange();
        // Refresh to get updated statusHistory
        const detail = await fetch(`/api/admin/quotes/${quoteId}`).then(r => r.json());
        setQuote(detail);
      }
    } finally {
      setSaving(false);
    }
  }

  async function sendEmail() {
    if (!quote) return;
    setSendingEmail(true);
    try {
      await fetch(`/api/admin/quotes/${quoteId}/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: emailSubject, body: emailBody }),
      });
      setEmailOpen(false);
      setEmailSubject("");
      setEmailBody("");
      setEmailSent(true);
      setTimeout(() => setEmailSent(false), 4000);
    } finally {
      setSendingEmail(false);
    }
  }

  async function saveNotes() {
    setSaving(true);
    try {
      await fetch(`/api/admin/quotes/${quoteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ internalNotes: notes }),
      });
      setNotesChanged(false);
    } finally {
      setSaving(false);
    }
  }

  async function deleteQuote() {
    if (!confirm("Delete this quote request and all its photos? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await fetch(`/api/admin/quotes/${quoteId}`, { method: "DELETE" });
      onStatusChange();
      onClose();
    } finally {
      setDeleting(false);
    }
  }

  const currentStatus = STATUS_OPTIONS.find((s) => s.value === quote?.status);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-carbon/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] lg:w-[520px] bg-white shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-carbon/10 flex-shrink-0">
          <h2 className="font-semibold text-carbon">
            {loading ? "Loading…" : quote ? `${quote.firstName} ${quote.lastName}` : "Not found"}
          </h2>
          <div className="flex items-center gap-2">
            {quote && (
              <>
                {emailSent && (
                  <span className="text-xs text-green-600 flex items-center gap-1 mr-2">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    Sent
                  </span>
                )}
                <button
                  onClick={() => setEmailOpen(true)}
                  className="p-2 text-gold hover:bg-gold/10 rounded-lg transition-colors"
                  title="Send email to client"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </button>
              </>
            )}
          {quote && (
              <button
                onClick={deleteQuote}
                disabled={deleting}
                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                title="Delete quote"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-carbon/40 hover:text-carbon hover:bg-carbon/5 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            </div>
          ) : !quote ? (
            <div className="p-6 text-center text-carbon/40">Quote not found.</div>
          ) : (
            <div className="divide-y divide-carbon/8">
              {/* Status */}
              <div className="px-6 py-5">
                <p className="text-xs font-medium text-carbon/40 uppercase tracking-wide mb-3">Status</p>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateStatus(opt.value)}
                      disabled={saving || quote.status === opt.value}
                      className={[
                        "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150",
                        quote.status === opt.value
                          ? opt.color + " ring-2 ring-offset-1 ring-current/20"
                          : "bg-white border-carbon/20 text-carbon/50 hover:border-carbon/40 hover:text-carbon",
                        saving ? "opacity-50 cursor-not-allowed" : "",
                      ].join(" ")}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Client info */}
              <div className="px-6 py-5">
                <p className="text-xs font-medium text-carbon/40 uppercase tracking-wide mb-3">Client</p>
                <dl className="space-y-2 text-sm">
                  <div className="flex gap-2">
                    <dt className="text-carbon/40 w-20 flex-shrink-0">Email</dt>
                    <dd>
                      <a href={`mailto:${quote.email}`} className="text-gold hover:underline break-all">{quote.email}</a>
                    </dd>
                  </div>
                  {quote.phone && (
                    <div className="flex gap-2">
                      <dt className="text-carbon/40 w-20 flex-shrink-0">Phone</dt>
                      <dd><a href={`tel:${quote.phone}`} className="text-carbon hover:underline">{quote.phone}</a></dd>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <dt className="text-carbon/40 w-20 flex-shrink-0">City</dt>
                    <dd className="text-carbon">{quote.city}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="text-carbon/40 w-20 flex-shrink-0">Property</dt>
                    <dd className="text-carbon">{quote.propertyType}</dd>
                  </div>
                  {quote.hearAboutUs && (
                    <div className="flex gap-2">
                      <dt className="text-carbon/40 w-20 flex-shrink-0">Source</dt>
                      <dd className="text-carbon">{quote.hearAboutUs}</dd>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <dt className="text-carbon/40 w-20 flex-shrink-0">Submitted</dt>
                    <dd className="text-carbon">{formatDate(quote.createdAt)}</dd>
                  </div>
                </dl>
              </div>

              {/* Project details */}
              <div className="px-6 py-5">
                <p className="text-xs font-medium text-carbon/40 uppercase tracking-wide mb-3">Project</p>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-carbon/40 mb-1">Services</p>
                    <div className="flex flex-wrap gap-1.5">
                      {parseServices(quote.services).map((s) => (
                        <span key={s} className="px-2.5 py-0.5 bg-gold/10 text-gold rounded-full text-xs font-medium">{s}</span>
                      ))}
                    </div>
                  </div>
                  {quote.budget && (
                    <div>
                      <p className="text-carbon/40 mb-0.5">Budget</p>
                      <p className="text-carbon font-medium">{quote.budget}</p>
                    </div>
                  )}
                  {quote.description && (
                    <div>
                      <p className="text-carbon/40 mb-0.5">Description</p>
                      <p className="text-carbon/80 leading-relaxed">{quote.description}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Photos */}
              {quote.photos.length > 0 && (
                <div className="px-6 py-5">
                  <p className="text-xs font-medium text-carbon/40 uppercase tracking-wide mb-3">
                    Photos ({quote.photos.length})
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {quote.photos.map((photo) => (
                      <button
                        key={photo.id}
                        onClick={() => setLightboxPhoto(photo)}
                        className="aspect-square rounded-xl overflow-hidden border border-carbon/10 hover:border-gold/40 transition-colors group relative"
                        title={photo.originalName}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={photo.url}
                          alt={photo.originalName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="absolute inset-0 bg-carbon/0 group-hover:bg-carbon/10 transition-colors rounded-xl" />
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-carbon/30 mt-2">Click photo to enlarge</p>
                </div>
              )}

              {/* Internal notes */}
              <div className="px-6 py-5">
                <p className="text-xs font-medium text-carbon/40 uppercase tracking-wide mb-3">Internal Notes</p>
                <textarea
                  value={notes}
                  onChange={(e) => { setNotes(e.target.value); setNotesChanged(true); }}
                  rows={4}
                  placeholder="Add notes visible only to you…"
                  className="w-full px-3 py-2.5 border border-carbon/20 rounded-xl text-sm text-carbon placeholder-carbon/30 focus:outline-none focus:border-gold transition-colors resize-none"
                />
                {notesChanged && (
                  <button
                    onClick={saveNotes}
                    disabled={saving}
                    className="mt-2 text-sm text-gold hover:underline disabled:opacity-50"
                  >
                    {saving ? "Saving…" : "Save notes"}
                  </button>
                )}
              </div>

              {/* Status history */}
              {quote.statusHistory.length > 0 && (
                <div className="px-6 py-5">
                  <p className="text-xs font-medium text-carbon/40 uppercase tracking-wide mb-3">History</p>
                  <ul className="space-y-2">
                    {quote.statusHistory.map((log) => (
                      <li key={log.id} className="flex items-start gap-2 text-xs text-carbon/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold/60 mt-1.5 flex-shrink-0" />
                        <span>
                          {log.fromStatus
                            ? `${log.fromStatus} → ${log.toStatus}`
                            : `Set to ${log.toStatus}`}
                          <span className="text-carbon/30 ml-2">{formatDate(log.changedAt)}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Email modal */}
      {emailOpen && quote && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-carbon/60 backdrop-blur-sm" onClick={() => setEmailOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10">
            <h3 className="font-semibold text-carbon mb-1">Email {quote.firstName}</h3>
            <p className="text-xs text-carbon/40 mb-4">Sending to {quote.email}</p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-carbon/50 mb-1">Subject</label>
                <input
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Your quote from SurfaceArt Palm Beach"
                  className="w-full px-3 py-2 border border-carbon/20 rounded-lg text-sm text-carbon focus:outline-none focus:border-gold transition-colors"
                  maxLength={300}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-carbon/50 mb-1">Message</label>
                <textarea
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  placeholder={`Hi ${quote.firstName},\n\nThank you for your interest in our services…`}
                  rows={6}
                  className="w-full px-3 py-2 border border-carbon/20 rounded-lg text-sm text-carbon focus:outline-none focus:border-gold transition-colors resize-none"
                  maxLength={10000}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={sendEmail}
                disabled={sendingEmail || !emailSubject.trim() || !emailBody.trim()}
                className="flex-1 py-2.5 bg-gold hover:bg-gold-light text-carbon text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
              >
                {sendingEmail ? "Sending…" : "Send Email"}
              </button>
              <button
                onClick={() => setEmailOpen(false)}
                className="px-4 py-2.5 text-sm text-carbon/60 hover:text-carbon transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxPhoto && (
        <div
          className="fixed inset-0 z-[60] bg-carbon/90 flex items-center justify-center p-4"
          onClick={() => setLightboxPhoto(null)}
        >
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightboxPhoto.url}
              alt={lightboxPhoto.originalName}
              className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
            />
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-white/70">{lightboxPhoto.originalName}</span>
              <span className="text-white/40">{formatBytes(lightboxPhoto.size)}</span>
            </div>
            <button
              onClick={() => setLightboxPhoto(null)}
              className="absolute -top-3 -right-3 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
