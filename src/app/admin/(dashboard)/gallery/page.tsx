"use client";

import { useState, useEffect } from "react";

interface GalleryItem {
  id: string;
  title: string;
  service: string;
  city: string | null;
  description: string | null;
  beforeImage: string;
  afterImage: string;
  isPublic: boolean;
  order: number;
}

function GalleryForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<GalleryItem>;
  onSave: (data: Omit<GalleryItem, "id">) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    service: initial?.service ?? "",
    city: initial?.city ?? "",
    description: initial?.description ?? "",
    beforeImage: initial?.beforeImage ?? "",
    afterImage: initial?.afterImage ?? "",
    isPublic: initial?.isPublic ?? true,
    order: initial?.order ?? 0,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await onSave({
        ...form,
        city: form.city || null,
        description: form.description || null,
      } as Omit<GalleryItem, "id">);
    } catch (err) {
      setError((err as Error).message || "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  const inputClass = "w-full px-3 py-2 border border-carbon/20 rounded-lg text-sm text-carbon focus:outline-none focus:border-gold transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-carbon/50 mb-1">Title *</label>
          <input className={inputClass} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required maxLength={200} placeholder="Modern Kitchen Transformation" />
        </div>
        <div>
          <label className="block text-xs font-medium text-carbon/50 mb-1">Service *</label>
          <input className={inputClass} value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))} required maxLength={100} placeholder="Kitchen Wraps" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-carbon/50 mb-1">City</label>
          <input className={inputClass} value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} maxLength={100} placeholder="West Palm Beach" />
        </div>
        <div>
          <label className="block text-xs font-medium text-carbon/50 mb-1">Sort Order</label>
          <input type="number" className={inputClass} value={form.order} onChange={e => setForm(f => ({ ...f, order: parseInt(e.target.value) || 0 }))} />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-carbon/50 mb-1">Before Image URL *</label>
        <input className={inputClass} value={form.beforeImage} onChange={e => setForm(f => ({ ...f, beforeImage: e.target.value }))} required type="url" placeholder="https://…" />
      </div>
      <div>
        <label className="block text-xs font-medium text-carbon/50 mb-1">After Image URL *</label>
        <input className={inputClass} value={form.afterImage} onChange={e => setForm(f => ({ ...f, afterImage: e.target.value }))} required type="url" placeholder="https://…" />
      </div>
      <div>
        <label className="block text-xs font-medium text-carbon/50 mb-1">Description</label>
        <textarea className={inputClass} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} maxLength={1000} />
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={form.isPublic}
          onChange={e => setForm(f => ({ ...f, isPublic: e.target.checked }))}
          className="w-4 h-4 accent-gold"
        />
        <span className="text-sm text-carbon">Visible on public website</span>
      </label>
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-gold hover:bg-gold-light text-carbon text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-carbon/60 hover:text-carbon transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function GalleryAdminPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/gallery");
    setItems(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(data: Omit<GalleryItem, "id">) {
    const res = await fetch("/api/admin/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create");
    setShowForm(false);
    load();
  }

  async function handleEdit(data: Omit<GalleryItem, "id">) {
    if (!editing) return;
    const res = await fetch(`/api/admin/gallery/${editing.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update");
    setEditing(null);
    load();
  }

  async function handleTogglePublic(item: GalleryItem) {
    await fetch(`/api/admin/gallery/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublic: !item.isPublic }),
    });
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this gallery item?")) return;
    setDeletingId(id);
    await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
    setDeletingId(null);
    load();
  }

  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <p className="text-carbon/50 text-sm">{items.length} items</p>
        <button
          onClick={() => { setShowForm(true); setEditing(null); }}
          className="flex items-center gap-2 px-4 py-2 bg-gold hover:bg-gold-light text-carbon text-sm font-semibold rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Item
        </button>
      </div>

      {/* Create form */}
      {showForm && !editing && (
        <div className="bg-white rounded-2xl border border-carbon/8 p-6 mb-6">
          <h3 className="font-semibold text-carbon mb-4">New Gallery Item</h3>
          <GalleryForm onSave={handleCreate} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-carbon/8 animate-pulse h-64" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-carbon/40">
          <svg className="w-12 h-12 mx-auto mb-3 text-carbon/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p>No gallery items yet. Add your first one!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id}>
              {editing?.id === item.id ? (
                <div className="bg-white rounded-2xl border border-gold/30 p-5">
                  <h3 className="font-semibold text-carbon mb-4 text-sm">Edit Item</h3>
                  <GalleryForm initial={item} onSave={handleEdit} onCancel={() => setEditing(null)} />
                </div>
              ) : (
                <div className={[
                  "bg-white rounded-2xl border overflow-hidden",
                  item.isPublic ? "border-carbon/8" : "border-carbon/8 opacity-60",
                ].join(" ")}>
                  {/* Before/After preview */}
                  <div className="h-36 grid grid-cols-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.beforeImage} alt="Before" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.afterImage} alt="After" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="font-medium text-carbon text-sm truncate">{item.title}</p>
                      {!item.isPublic && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-carbon/10 text-carbon/40 rounded flex-shrink-0">Hidden</span>
                      )}
                    </div>
                    <p className="text-xs text-carbon/40">{item.service}{item.city ? ` · ${item.city}` : ""}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => handleTogglePublic(item)}
                        className="text-xs text-carbon/50 hover:text-carbon transition-colors"
                        title={item.isPublic ? "Hide from public" : "Show on public site"}
                      >
                        {item.isPublic ? "Hide" : "Publish"}
                      </button>
                      <span className="text-carbon/20">·</span>
                      <button
                        onClick={() => setEditing(item)}
                        className="text-xs text-gold hover:underline"
                      >
                        Edit
                      </button>
                      <span className="text-carbon/20">·</span>
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                        className="text-xs text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
                      >
                        {deletingId === item.id ? "Deleting…" : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
