"use client";

import { useState, type FormEvent } from "react";
import { CONTACT_FORM_PROMPT_LABEL, CONTACT_FORM_SUCCESS } from "@/lib/copy";
import { trackEvent } from "@/lib/analytics";
import type { UnexpectedResponse } from "./UnexpectedFeedback";

export interface ContactFormData {
  name: string;
  company: string;
  email: string;
  role: string;
  phone: string;
  prompt: string;
}

interface ContactFormProps {
  submitLabel: string;
  unexpectedResponse?: UnexpectedResponse | null;
  eventSlug?: string | null;
  industrySlug?: string | null;
  onCtaClick?: () => void;
}

const inputClassName =
  "w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-light focus:border-crimson/40 focus:outline-none focus:ring-2 focus:ring-crimson/15";

export function ContactForm({
  submitLabel,
  unexpectedResponse = null,
  eventSlug = null,
  industrySlug = null,
  onCtaClick,
}: ContactFormProps) {
  const [form, setForm] = useState<ContactFormData>({
    name: "",
    company: "",
    email: "",
    role: "",
    phone: "",
    prompt: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function updateField(field: keyof ContactFormData, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    onCtaClick?.();
    trackEvent("cta_clicked", {
      unexpectedResponse: unexpectedResponse ?? null,
      eventSlug: eventSlug ?? null,
    });

    setSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          unexpectedResponse,
          eventSlug,
          industrySlug,
        }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(data.error ?? "Unable to submit the form.");
        return;
      }

      trackEvent("form_submitted", {
        unexpectedResponse: unexpectedResponse ?? null,
        eventSlug: eventSlug ?? null,
        industrySlug: industrySlug ?? null,
      });
      setSubmitted(true);
    } catch {
      setError("Unable to submit the form. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <p className="text-[15px] leading-relaxed text-foreground">
        {CONTACT_FORM_SUCCESS}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm text-muted">Name</span>
          <input
            required
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            className={inputClassName}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm text-muted">Company</span>
          <input
            required
            type="text"
            autoComplete="organization"
            value={form.company}
            onChange={(event) => updateField("company", event.target.value)}
            className={inputClassName}
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm text-muted">Email</span>
          <input
            required
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            className={inputClassName}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm text-muted">
            Role <span className="text-muted-light">(optional)</span>
          </span>
          <input
            type="text"
            autoComplete="organization-title"
            value={form.role}
            onChange={(event) => updateField("role", event.target.value)}
            className={inputClassName}
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-sm text-muted">
          Phone <span className="text-muted-light">(optional)</span>
        </span>
        <input
          type="tel"
          autoComplete="tel"
          value={form.phone}
          onChange={(event) => updateField("phone", event.target.value)}
          className={inputClassName}
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm text-muted">
          {CONTACT_FORM_PROMPT_LABEL}
        </span>
        <textarea
          required
          rows={3}
          value={form.prompt}
          onChange={(event) => updateField("prompt", event.target.value)}
          className={`${inputClassName} resize-y`}
        />
      </label>

      {error && <p className="text-sm text-crimson">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center justify-center rounded-full bg-crimson px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-crimson-dark hover:shadow-[0_4px_16px_rgba(155,27,48,0.25)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Submitting..." : submitLabel}
      </button>
    </form>
  );
}
