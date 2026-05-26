"use client";

import { useState, useEffect } from "react";

const SETTING_FIELDS = [
  { key: "company_name", label: "Company Name", placeholder: "SurfaceArt Palm Beach" },
  { key: "company_phone", label: "Phone Number", placeholder: "(561) 000-0000" },
  { key: "company_email", label: "Contact Email", placeholder: "info@surfaceartpb.com" },
  { key: "company_address", label: "Address", placeholder: "West Palm Beach, FL" },
  { key: "response_time_hours", label: "Response Time (hours)", placeholder: "24" },
  { key: "instagram_url", label: "Instagram URL", placeholder: "https://instagram.com/…" },
  { key: "facebook_url", label: "Facebook URL", placeholder: "https://facebook.com/…" },
];

export default function SettingsAdminPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => { setValues(data); setLoading(false); });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const inputClass = "w-full px-3 py-2.5 border border-carbon/20 rounded-xl text-sm text-carbon bg-white focus:outline-none focus:border-gold transition-colors";

  return (
    <div className="p-6 sm:p-8 max-w-2xl">
      <div className="bg-white rounded-2xl border border-carbon/8 p-6">
        <h2 className="font-semibold text-carbon mb-6">Company Settings</h2>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 bg-carbon/5 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            {SETTING_FIELDS.map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-carbon/50 mb-1.5">{label}</label>
                <input
                  className={inputClass}
                  value={values[key] ?? ""}
                  onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
                  placeholder={placeholder}
                />
              </div>
            ))}

            <div className="pt-2 flex items-center gap-4">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 bg-gold hover:bg-gold-light text-carbon text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save Settings"}
              </button>
              {saved && (
                <span className="text-sm text-green-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Saved
                </span>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
