"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

interface QuoteData {
  clientName: string;
  city: string;
  service: string;
  services: string[];
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} star${star !== 1 ? "s" : ""}`}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
          className="focus:outline-none"
        >
          <svg
            className={`w-9 h-9 transition-colors ${
              (hovered || value) >= star ? "text-[#B8965A]" : "text-[#1C1C1A]/20"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

export default function ReviewPage() {
  const { token } = useParams<{ token: string }>();

  const [quoteData, setQuoteData] = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [invalid, setInvalid] = useState(false);

  const [clientName, setClientName] = useState("");
  const [city, setCity] = useState("");
  const [service, setService] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/review/${token}`)
      .then(async (r) => {
        if (!r.ok) { setInvalid(true); return; }
        const data: QuoteData = await r.json();
        setQuoteData(data);
        setClientName(data.clientName);
        setCity(data.city);
        setService(data.service);
      })
      .catch(() => setInvalid(true))
      .finally(() => setLoading(false));
  }, [token]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) { setError("Please share your experience."); return; }
    setError("");
    setSubmitting(true);

    const formData = new FormData();
    formData.append("clientName", clientName);
    formData.append("city", city);
    formData.append("service", service);
    formData.append("rating", String(rating));
    formData.append("text", text);
    if (imageFile) formData.append("image", imageFile);

    try {
      const res = await fetch(`/api/review/${token}`, { method: "POST", body: formData });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? "Something went wrong. Please try again.");
      } else {
        setSubmitted(true);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full px-4 py-3 border border-[#1C1C1A]/15 rounded-xl text-sm text-[#1C1C1A] focus:outline-none focus:border-[#B8965A] transition-colors bg-white placeholder:text-[#1C1C1A]/30";

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex flex-col">
      {/* Header */}
      <header className="py-6 px-4 text-center border-b border-[#1C1C1A]/8 bg-[#FAFAF7]">
        <h1 className="font-serif text-2xl text-[#1C1C1A]">SurfaceArt</h1>
        <p className="text-[#B8965A] text-[10px] font-medium tracking-[3px] uppercase mt-0.5">
          Palm Beach · Est. 2025
        </p>
      </header>

      <main className="flex-1 flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-lg">

          {loading && (
            <div className="text-center py-20">
              <div className="w-8 h-8 border-2 border-[#B8965A] border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          )}

          {!loading && invalid && (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-[#1C1C1A]/8">
              <div className="w-14 h-14 bg-[#1C1C1A]/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-[#1C1C1A]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <h2 className="font-serif text-xl text-[#1C1C1A] mb-2">Link not found</h2>
              <p className="text-[#1C1C1A]/50 text-sm">This review link is invalid or has already been used. Thank you!</p>
            </div>
          )}

          {!loading && !invalid && submitted && (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-[#1C1C1A]/8">
              <div className="w-14 h-14 bg-[#B8965A]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-[#B8965A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="font-serif text-2xl text-[#1C1C1A] mb-2">Thank you!</h2>
              <p className="text-[#1C1C1A]/60 text-sm leading-relaxed">
                Your review has been received. We&apos;ll review it and publish it on our website soon.
                <br className="hidden sm:block" /> We truly appreciate you sharing your experience!
              </p>
            </div>
          )}

          {!loading && !invalid && !submitted && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Intro card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#1C1C1A]/8">
                <p className="text-[#B8965A] text-xs font-medium tracking-widest uppercase mb-1">Your Review</p>
                <h2 className="font-serif text-2xl text-[#1C1C1A] mb-1">
                  How did we do, {quoteData?.clientName.split(" ")[0]}?
                </h2>
                <p className="text-[#1C1C1A]/50 text-sm">Your feedback helps other homeowners make confident decisions.</p>
              </div>

              {/* Rating */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#1C1C1A]/8">
                <label className="block text-xs font-medium text-[#1C1C1A]/50 uppercase tracking-widest mb-3">
                  Overall Rating *
                </label>
                <StarPicker value={rating} onChange={setRating} />
              </div>

              {/* Review text */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#1C1C1A]/8">
                <label className="block text-xs font-medium text-[#1C1C1A]/50 uppercase tracking-widest mb-3">
                  Your Experience *
                </label>
                <textarea
                  className={inputClass}
                  rows={5}
                  maxLength={2000}
                  required
                  placeholder="Tell us about your experience — how did the transformation turn out? What surprised you most?"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <p className="text-[#1C1C1A]/30 text-xs mt-1.5 text-right">{text.length}/2000</p>
              </div>

              {/* Pre-filled fields */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#1C1C1A]/8 space-y-4">
                <p className="text-xs font-medium text-[#1C1C1A]/50 uppercase tracking-widest">Your Details</p>
                <div>
                  <label className="block text-xs text-[#1C1C1A]/40 mb-1">Name</label>
                  <input
                    className={inputClass}
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    required
                    maxLength={100}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-[#1C1C1A]/40 mb-1">City</label>
                    <input
                      className={inputClass}
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      maxLength={100}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#1C1C1A]/40 mb-1">Service</label>
                    {quoteData && quoteData.services.length > 1 ? (
                      <select
                        className={inputClass}
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                      >
                        {quoteData.services.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        className={inputClass}
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        required
                        maxLength={100}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Optional photo */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#1C1C1A]/8">
                <p className="text-xs font-medium text-[#1C1C1A]/50 uppercase tracking-widest mb-1">
                  Your Photo <span className="font-normal normal-case tracking-normal text-[#1C1C1A]/30">(optional)</span>
                </p>
                <p className="text-xs text-[#1C1C1A]/40 mb-4">A photo makes your review more personal and trustworthy.</p>

                {imagePreview ? (
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#B8965A]/30 flex-shrink-0">
                      <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                    </div>
                    <button
                      type="button"
                      onClick={() => { setImageFile(null); setImagePreview(null); if (fileRef.current) fileRef.current.value = ""; }}
                      className="text-xs text-[#1C1C1A]/40 hover:text-red-500 transition-colors"
                    >
                      Remove photo
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex items-center gap-3 px-4 py-3 border border-dashed border-[#1C1C1A]/20 rounded-xl text-sm text-[#1C1C1A]/40 hover:border-[#B8965A]/50 hover:text-[#B8965A] transition-colors w-full"
                  >
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    Upload a photo of yourself
                  </button>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm px-1">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-[#B8965A] hover:bg-[#A07848] text-[#1C1C1A] font-semibold rounded-xl transition-colors disabled:opacity-50 text-base"
              >
                {submitting ? "Submitting…" : "Submit My Review"}
              </button>

              <p className="text-center text-[#1C1C1A]/30 text-xs pb-4">
                Your review will be visible on our website after we review it.
              </p>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
