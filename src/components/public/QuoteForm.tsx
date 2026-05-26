"use client";

import { useQuoteForm } from "@/hooks/useQuoteForm";
import PhotoUpload from "./PhotoUpload";
import {
  CITIES,
  PROPERTY_TYPES,
  SERVICES,
  BUDGETS,
  HEAR_ABOUT_US,
} from "@/lib/validations";

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-sm text-red-500 mt-1" role="alert">{msg}</p>;
}

function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
  required,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  placeholder: string;
  error?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-carbon/70 mb-1.5">
        {label}{required && <span className="text-gold ml-1" aria-hidden>*</span>}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        aria-invalid={!!error}
        className={[
          "w-full px-4 py-2.5 rounded-xl border text-carbon bg-white appearance-none",
          "focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors",
          error ? "border-red-400" : "border-carbon/20 hover:border-carbon/40",
          !value ? "text-carbon/40" : "",
        ].join(" ")}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <FieldError msg={error} />
    </div>
  );
}

export default function QuoteForm() {
  const {
    fields,
    photos,
    errors,
    submitState,
    uploadProgress,
    serverError,
    uploadWarnings,
    setField,
    setPhotos,
    toggleService,
    submit,
  } = useQuoteForm();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await submit();
  }

  const isSubmitting = submitState === "uploading" || submitState === "saving";

  // Success screen
  if (submitState === "success") {
    return (
      <div className="text-center py-8 px-4">
        {/* Animated checkmark */}
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6 animate-[fade-up_0.5s_ease_forwards]">
          <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-serif text-3xl text-carbon mb-3">
          Thank you, {fields.firstName}!
        </h3>
        <p className="text-carbon/60 text-lg mb-2">
          We&apos;ve received your quote request and will get back to you within{" "}
          <strong className="text-carbon">24 hours</strong>.
        </p>
        <p className="text-carbon/50 text-sm mb-6">
          A confirmation email has been sent to{" "}
          <span className="text-carbon font-medium">{fields.email}</span>.
        </p>
        {uploadWarnings.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-sm text-left">
            <p className="font-medium text-yellow-800 mb-1">Note — some photos could not be uploaded:</p>
            <ul className="list-disc list-inside text-yellow-700">
              {uploadWarnings.map((w, i) => <li key={i}>{w}</li>)}
            </ul>
            <p className="text-yellow-600 mt-2">You can reply to the confirmation email to send them separately.</p>
          </div>
        )}
        <div className="bg-cream rounded-2xl p-6 text-left max-w-sm mx-auto">
          <h4 className="font-semibold text-carbon mb-3 text-sm uppercase tracking-wide">What happens next</h4>
          <ol className="space-y-2">
            {[
              "We review your photos and project details",
              "We prepare your personalized estimate",
              "We contact you within 24 hours",
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-carbon/70">
                <span className="w-5 h-5 rounded-full bg-gold/20 text-gold flex items-center justify-center flex-shrink-0 font-semibold text-xs mt-0.5">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Server error */}
      {serverError && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3" role="alert">
          <p className="text-red-600 text-sm font-medium">{serverError}</p>
        </div>
      )}

      {/* Row 1: Name */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-carbon/70 mb-1.5">
            First Name <span className="text-gold" aria-hidden>*</span>
          </label>
          <input
            id="firstName"
            type="text"
            value={fields.firstName}
            onChange={(e) => setField("firstName", e.target.value)}
            required
            autoComplete="given-name"
            aria-invalid={!!errors.firstName}
            placeholder="Jane"
            className={[
              "w-full px-4 py-2.5 rounded-xl border text-carbon bg-white placeholder-carbon/30",
              "focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors",
              errors.firstName ? "border-red-400" : "border-carbon/20 hover:border-carbon/40",
            ].join(" ")}
          />
          <FieldError msg={errors.firstName} />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-carbon/70 mb-1.5">
            Last Name <span className="text-gold" aria-hidden>*</span>
          </label>
          <input
            id="lastName"
            type="text"
            value={fields.lastName}
            onChange={(e) => setField("lastName", e.target.value)}
            required
            autoComplete="family-name"
            aria-invalid={!!errors.lastName}
            placeholder="Doe"
            className={[
              "w-full px-4 py-2.5 rounded-xl border text-carbon bg-white placeholder-carbon/30",
              "focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors",
              errors.lastName ? "border-red-400" : "border-carbon/20 hover:border-carbon/40",
            ].join(" ")}
          />
          <FieldError msg={errors.lastName} />
        </div>
      </div>

      {/* Row 2: Email + Phone */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-carbon/70 mb-1.5">
            Email Address <span className="text-gold" aria-hidden>*</span>
          </label>
          <input
            id="email"
            type="email"
            value={fields.email}
            onChange={(e) => setField("email", e.target.value)}
            required
            autoComplete="email"
            aria-invalid={!!errors.email}
            placeholder="jane@example.com"
            className={[
              "w-full px-4 py-2.5 rounded-xl border text-carbon bg-white placeholder-carbon/30",
              "focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors",
              errors.email ? "border-red-400" : "border-carbon/20 hover:border-carbon/40",
            ].join(" ")}
          />
          <FieldError msg={errors.email} />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-carbon/70 mb-1.5">
            Phone Number
            <span className="text-carbon/40 ml-1 text-xs font-normal">(optional)</span>
          </label>
          <input
            id="phone"
            type="tel"
            value={fields.phone}
            onChange={(e) => setField("phone", e.target.value)}
            autoComplete="tel"
            placeholder="(561) 000-0000"
            className="w-full px-4 py-2.5 rounded-xl border border-carbon/20 hover:border-carbon/40 text-carbon bg-white placeholder-carbon/30 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors"
          />
        </div>
      </div>

      {/* Row 3: City + Property Type */}
      <div className="grid sm:grid-cols-2 gap-4">
        <SelectField
          id="city"
          label="City / Area"
          value={fields.city}
          onChange={(v) => setField("city", v)}
          options={CITIES}
          placeholder="Select your city"
          error={errors.city}
          required
        />
        <SelectField
          id="propertyType"
          label="Property Type"
          value={fields.propertyType}
          onChange={(v) => setField("propertyType", v)}
          options={PROPERTY_TYPES}
          placeholder="Select property type"
          error={errors.propertyType}
          required
        />
      </div>

      {/* Row 4: Services (multi-select pills) */}
      <div>
        <p className="text-sm font-medium text-carbon/70 mb-2">
          Services Interested In <span className="text-gold" aria-hidden>*</span>
        </p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Select services">
          {SERVICES.map((service) => {
            const selected = fields.services.includes(service);
            return (
              <button
                key={service}
                type="button"
                onClick={() => toggleService(service)}
                aria-pressed={selected}
                className={[
                  "px-4 py-2 rounded-full text-sm font-medium border transition-all duration-150",
                  selected
                    ? "bg-gold border-gold text-carbon"
                    : "bg-white border-carbon/20 text-carbon/70 hover:border-gold/50 hover:text-carbon",
                ].join(" ")}
              >
                {service}
              </button>
            );
          })}
        </div>
        <FieldError msg={errors.services} />
      </div>

      {/* Row 5: Budget */}
      <SelectField
        id="budget"
        label="Estimated Budget"
        value={fields.budget}
        onChange={(v) => setField("budget", v)}
        options={BUDGETS}
        placeholder="Select your budget range"
      />

      {/* Row 6: Photo Upload */}
      <div>
        <p className="text-sm font-medium text-carbon/70 mb-2">
          Photos of Your Space
          <span className="text-carbon/40 ml-1 text-xs font-normal">(optional but helps us give you an accurate quote)</span>
        </p>
        <PhotoUpload photos={photos} onChange={setPhotos} />
      </div>

      {/* Row 7: Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-carbon/70 mb-1.5">
          Describe What You&apos;d Like to Achieve
          <span className="text-carbon/40 ml-1 text-xs font-normal">(optional)</span>
        </label>
        <textarea
          id="description"
          value={fields.description}
          onChange={(e) => setField("description", e.target.value)}
          rows={4}
          maxLength={2000}
          placeholder="E.g. I have a dated oak kitchen with 18 cabinet doors. Looking for a dark walnut or matte black finish. Also interested in a TV accent wall with concrete or stone texture..."
          className="w-full px-4 py-2.5 rounded-xl border border-carbon/20 hover:border-carbon/40 text-carbon bg-white placeholder-carbon/30 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors resize-none"
        />
        <p className="text-xs text-carbon/40 mt-1 text-right">
          {fields.description.length}/2000
        </p>
      </div>

      {/* Row 8: How did you hear about us */}
      <SelectField
        id="hearAboutUs"
        label="How Did You Hear About Us?"
        value={fields.hearAboutUs}
        onChange={(v) => setField("hearAboutUs", v)}
        options={HEAR_ABOUT_US}
        placeholder="Select an option"
      />

      {/* Upload progress */}
      {isSubmitting && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-carbon/60">
              {submitState === "uploading" ? "Uploading your photos..." : "Saving your request..."}
            </span>
            <span className="text-gold font-medium">{uploadProgress}%</span>
          </div>
          <div className="h-2 bg-carbon/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gold rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Submit */}
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-gold hover:bg-gold-light disabled:opacity-60 disabled:cursor-not-allowed text-carbon font-semibold text-lg rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/20 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <span className="w-5 h-5 border-2 border-carbon/30 border-t-carbon rounded-full animate-spin" />
              {submitState === "uploading" ? "Uploading photos..." : "Submitting..."}
            </>
          ) : (
            <>
              Request My Free Quote
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </>
          )}
        </button>

        <p className="text-center text-carbon/40 text-sm mt-3">
          <span aria-hidden>🔒</span> We never share your info. No spam, ever.
        </p>
      </div>
    </form>
  );
}
