import type { ReactNode } from "react";
import type { BusinessEvent } from "@/lib/types";
import {
  CONVERSATION_INTRO_CONFIRM_INDUSTRY,
  CONVERSATION_INTRO_CONFIRM_SITUATION,
  CONVERSATION_INTRO_DURATION_BODY,
  CONVERSATION_INTRO_DURATION_HEADING,
  CONVERSATION_INTRO_LABEL,
  CONVERSATION_INTRO_RECEIVE_HEADING,
  CONVERSATION_INTRO_RECEIVE_INTRO,
  CONVERSATION_INTRO_RECEIVE_ITEMS,
  CONVERSATION_INTRO_WHAT_BODY,
  CONVERSATION_INTRO_WHAT_BODY_SECOND,
  CONVERSATION_INTRO_WHAT_HEADING,
  CONVERSATION_INTRO_WHY_BODY,
  CONVERSATION_INTRO_WHY_BODY_SECOND,
  CONVERSATION_INTRO_WHY_HEADING,
  conversationIntroQuestionCountBody,
} from "@/lib/copy";
import { CTAButton } from "./CTAButton";

interface ConversationIntroProps {
  event: BusinessEvent;
  industryTitle?: string;
  onContinue: () => void;
  onBack: () => void;
}

function IntroSection({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-5">
      <h3 className="mb-1.5 text-sm font-medium text-foreground">{heading}</h3>
      <div className="space-y-3 text-[15px] leading-relaxed text-muted">{children}</div>
    </section>
  );
}

function ConfirmationField({ label, value }: { label: string; value: string }) {
  return (
    <div className={label === CONVERSATION_INTRO_CONFIRM_INDUSTRY ? "mt-4" : ""}>
      <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-light">
        {label}
      </p>
      <p className="text-base font-medium tracking-tight text-foreground">{value}</p>
    </div>
  );
}

export function ConversationIntro({
  event,
  industryTitle,
  onContinue,
  onBack,
}: ConversationIntroProps) {
  const questionCount = event.questions.length;

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

      <div className="mb-6 rounded-xl border border-border bg-border-light/40 px-4 py-4">
        <ConfirmationField label={CONVERSATION_INTRO_CONFIRM_SITUATION} value={event.title} />
        {industryTitle && (
          <ConfirmationField
            label={CONVERSATION_INTRO_CONFIRM_INDUSTRY}
            value={industryTitle}
          />
        )}
      </div>

      <IntroSection heading={CONVERSATION_INTRO_WHAT_HEADING}>
        <p>{CONVERSATION_INTRO_WHAT_BODY}</p>
        <p>{CONVERSATION_INTRO_WHAT_BODY_SECOND}</p>
      </IntroSection>

      <IntroSection heading={CONVERSATION_INTRO_DURATION_HEADING}>
        <p>{CONVERSATION_INTRO_DURATION_BODY}</p>
        <p>{conversationIntroQuestionCountBody(questionCount)}</p>
      </IntroSection>

      <IntroSection heading={CONVERSATION_INTRO_RECEIVE_HEADING}>
        <p>{CONVERSATION_INTRO_RECEIVE_INTRO}</p>
        <ul className="list-disc space-y-1.5 pl-5">
          {CONVERSATION_INTRO_RECEIVE_ITEMS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </IntroSection>

      <IntroSection heading={CONVERSATION_INTRO_WHY_HEADING}>
        <p>{CONVERSATION_INTRO_WHY_BODY}</p>
        <p>{CONVERSATION_INTRO_WHY_BODY_SECOND}</p>
      </IntroSection>

      <div className="mt-8">
        <CTAButton onClick={onContinue}>Begin assessment</CTAButton>
      </div>
    </div>
  );
}
