import type { BusinessEvent } from "@/lib/types";
import { CONVERSATION_INTRO_CLOSING, CONVERSATION_INTRO_LABEL } from "@/lib/copy";
import { CTAButton } from "./CTAButton";

interface ConversationIntroProps {
  event: BusinessEvent;
  industryTitle?: string;
  onContinue: () => void;
  onBack: () => void;
}

export function ConversationIntro({
  event,
  industryTitle,
  onContinue,
  onBack,
}: ConversationIntroProps) {
  const framing = event.executiveMindset ?? event.summary ?? event.shortDescription;

  return (
    <div className="animate-fade-in">
      <button
        onClick={onBack}
        className="mb-6 text-sm text-muted-light transition-colors hover:text-foreground"
      >
        ← Back
      </button>

      <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-light">
        {CONVERSATION_INTRO_LABEL}
      </p>

      <h2 className="mb-4 text-xl font-medium tracking-tight text-foreground md:text-2xl">
        {event.title}
      </h2>

      {industryTitle && (
        <p className="mb-4 text-sm text-muted-light">
          Industry context: <span className="text-muted">{industryTitle}</span>
        </p>
      )}

      {framing && (
        <p className="mb-4 text-[15px] leading-relaxed text-muted">{framing}</p>
      )}

      {event.businessProblem && (
        <p className="mb-6 text-[15px] leading-relaxed text-muted">
          {event.businessProblem}
        </p>
      )}

      <p className="mb-8 text-sm leading-relaxed text-muted-light">
        {CONVERSATION_INTRO_CLOSING}
      </p>

      <CTAButton onClick={onContinue}>Continue</CTAButton>
    </div>
  );
}
