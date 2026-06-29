"use client";

import { useState } from "react";
import {
  VALIDATE_ASSESSMENT_BODY,
  VALIDATE_ASSESSMENT_DEFAULT_CTA,
  VALIDATE_ASSESSMENT_HEADING,
  VALIDATE_ASSESSMENT_HOOK,
  UNEXPECTED_NO_CTA,
  UNEXPECTED_NO_HOOK,
  UNEXPECTED_SOMEWHAT_CTA,
  UNEXPECTED_SOMEWHAT_HOOK,
  UNEXPECTED_YES_CTA,
  UNEXPECTED_YES_HOOK,
} from "@/lib/copy";
import { ContactForm } from "./ContactForm";
import { UnexpectedFeedback, type UnexpectedResponse } from "./UnexpectedFeedback";

interface ValidateAssessmentCTAProps {
  variant?: "prominent" | "standard";
  showUnexpectedFeedback?: boolean;
  unexpectedResponse?: UnexpectedResponse | null;
  onUnexpectedChange?: (value: UnexpectedResponse) => void;
  eventSlug?: string | null;
  industrySlug?: string | null;
  label?: string;
}

function getPersonalizedCopy(response: UnexpectedResponse | null) {
  switch (response) {
    case "yes":
      return { hook: UNEXPECTED_YES_HOOK, cta: UNEXPECTED_YES_CTA };
    case "somewhat":
      return { hook: UNEXPECTED_SOMEWHAT_HOOK, cta: UNEXPECTED_SOMEWHAT_CTA };
    case "no":
      return { hook: UNEXPECTED_NO_HOOK, cta: UNEXPECTED_NO_CTA };
    default:
      return null;
  }
}

export function ValidateAssessmentCTA({
  variant = "standard",
  showUnexpectedFeedback = false,
  unexpectedResponse: controlledUnexpectedResponse,
  onUnexpectedChange,
  eventSlug = null,
  industrySlug = null,
  label,
}: ValidateAssessmentCTAProps) {
  const [internalUnexpectedResponse, setInternalUnexpectedResponse] =
    useState<UnexpectedResponse | null>(null);

  const unexpectedResponse = controlledUnexpectedResponse ?? internalUnexpectedResponse;

  function handleUnexpectedChange(value: UnexpectedResponse) {
    onUnexpectedChange?.(value);
    if (controlledUnexpectedResponse === undefined) {
      setInternalUnexpectedResponse(value);
    }
  }

  const personalized = getPersonalizedCopy(unexpectedResponse);
  const readyForForm = !showUnexpectedFeedback || unexpectedResponse !== null;
  const hook = personalized?.hook ?? (variant === "prominent" ? VALIDATE_ASSESSMENT_HOOK : VALIDATE_ASSESSMENT_BODY);
  const submitLabel = label ?? personalized?.cta ?? VALIDATE_ASSESSMENT_DEFAULT_CTA;

  const content = (
    <>
      {showUnexpectedFeedback && (
        <UnexpectedFeedback
          value={unexpectedResponse}
          onChange={handleUnexpectedChange}
        />
      )}

      {readyForForm && (
        <>
          <p
            className={`${
              variant === "prominent" ? "mb-5" : "mb-6"
            } max-w-2xl text-[15px] leading-relaxed text-muted`}
          >
            {hook}
          </p>
          <ContactForm
            submitLabel={submitLabel}
            unexpectedResponse={unexpectedResponse}
            eventSlug={eventSlug}
            industrySlug={industrySlug}
          />
        </>
      )}
    </>
  );

  if (variant === "prominent") {
    return (
      <div className="mb-10 rounded-xl border border-crimson/25 bg-crimson-light px-5 py-6 md:px-6">
        <p className="mb-1 text-xs font-medium uppercase tracking-wider text-crimson">
          {VALIDATE_ASSESSMENT_HEADING}
        </p>
        {content}
      </div>
    );
  }

  return (
    <div className="border-t border-border pt-8">
      <h2 className="mb-3 text-lg font-medium tracking-tight text-foreground">
        {VALIDATE_ASSESSMENT_HEADING}
      </h2>
      {content}
    </div>
  );
}
