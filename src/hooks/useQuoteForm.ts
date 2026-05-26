"use client";

import { useState } from "react";
import type { PhotoFile } from "@/components/public/PhotoUpload";

export interface FormFields {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  propertyType: string;
  services: string[];
  budget: string;
  description: string;
  hearAboutUs: string;
}

const INITIAL: FormFields = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  city: "",
  propertyType: "",
  services: [],
  budget: "",
  description: "",
  hearAboutUs: "",
};

type SubmitState = "idle" | "uploading" | "saving" | "success" | "error";

export function useQuoteForm() {
  const [fields, setFields] = useState<FormFields>(INITIAL);
  const [photos, setPhotos] = useState<PhotoFile[]>([]);
  const [errors, setErrors] = useState<Partial<Record<keyof FormFields, string>>>({});
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [serverError, setServerError] = useState<string | null>(null);
  const [uploadWarnings, setUploadWarnings] = useState<string[]>([]);
  const [quoteId, setQuoteId] = useState<string | null>(null);

  function setField<K extends keyof FormFields>(key: K, value: FormFields[K]) {
    setFields((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function toggleService(service: string) {
    setFields((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
    if (errors.services) setErrors((prev) => ({ ...prev, services: undefined }));
  }

  function validate(): boolean {
    const errs: Partial<Record<keyof FormFields, string>> = {};
    if (!fields.firstName.trim()) errs.firstName = "First name is required";
    if (!fields.lastName.trim()) errs.lastName = "Last name is required";
    if (!fields.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
      errs.email = "Please enter a valid email address";
    if (!fields.city) errs.city = "Please select your city";
    if (!fields.propertyType) errs.propertyType = "Please select your property type";
    if (fields.services.length === 0) errs.services = "Please select at least one service";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function submit(): Promise<boolean> {
    if (!validate()) return false;

    setServerError(null);
    setUploadWarnings([]);
    setSubmitState("uploading");
    setUploadProgress(0);

    const validPhotos = photos.filter((p) => !p.error);

    const formData = new FormData();
    formData.append("firstName", fields.firstName);
    formData.append("lastName", fields.lastName);
    formData.append("email", fields.email);
    if (fields.phone) formData.append("phone", fields.phone);
    formData.append("city", fields.city);
    formData.append("propertyType", fields.propertyType);
    for (const service of fields.services) formData.append("services", service);
    if (fields.budget) formData.append("budget", fields.budget);
    if (fields.description) formData.append("description", fields.description);
    if (fields.hearAboutUs) formData.append("hearAboutUs", fields.hearAboutUs);

    for (let i = 0; i < validPhotos.length; i++) {
      formData.append("photos", validPhotos[i].file);
      setUploadProgress(Math.round(((i + 1) / validPhotos.length) * 80));
    }

    setSubmitState("saving");
    setUploadProgress(90);

    // Timeout after 60 seconds
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60_000);

    try {
      const res = await fetch("/api/quotes/submit", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });
      clearTimeout(timeout);
      setUploadProgress(100);

      const json = await res.json();

      if (!res.ok) {
        if (json.fields) setErrors(json.fields);
        setServerError(json.error ?? "Something went wrong. Please try again.");
        setSubmitState("error");
        return false;
      }

      if (json.uploadErrors?.length) setUploadWarnings(json.uploadErrors);
      setQuoteId(json.quoteId);
      setSubmitState("success");
      return true;
    } catch (err) {
      clearTimeout(timeout);
      if ((err as Error).name === "AbortError") {
        setServerError("The upload is taking too long. Please check your connection and try again.");
      } else {
        setServerError("Failed to submit. Please check your connection and try again.");
      }
      setSubmitState("error");
      return false;
    }
  }

  return {
    fields,
    photos,
    errors,
    submitState,
    uploadProgress,
    serverError,
    uploadWarnings,
    quoteId,
    setField,
    setPhotos,
    toggleService,
    submit,
  };
}
