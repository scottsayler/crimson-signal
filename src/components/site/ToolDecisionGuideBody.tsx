import type { DecisionGuide, SitePage } from "@/lib/site/types";
import type { AssessmentDefinition } from "@/lib/assessments";
import { isPlaceholderText } from "@/lib/site/decision-guide";
import { MarkdownContent } from "@/components/MarkdownContent";
import {
  QuickAnswer,
  DecisionBox,
  RealityCheck,
  WorthKnowing,
  BottomLine,
  SectionPlaceholder,
} from "./decision";
import { AssessmentRenderer } from "./assessments/AssessmentRenderer";
import { ToolCalculator, hasToolCalculator } from "./tools/ToolCalculator";

const SECTION_HEADING =
  "mb-5 font-serif text-2xl font-medium tracking-tight text-foreground";
const PROSE_BODY = "max-w-3xl text-[15px] leading-[1.75] text-muted";

interface ToolDecisionGuideBodyProps {
  guide: DecisionGuide;
  sections?: SitePage["sections"];
  toolSlug: string;
  assessment?: AssessmentDefinition;
}

export function ToolDecisionGuideBody({
  guide,
  sections = [],
  toolSlug,
  assessment,
}: ToolDecisionGuideBodyProps) {
  const interactiveSection = sections.find(
    (section) => section.heading === "Calculator" || section.heading === "Assessment"
  );
  const interactiveHeading = interactiveSection?.heading ?? "Calculator";
  const contentSections = sections.filter(
    (section) => section.heading !== "Calculator" && section.heading !== "Assessment"
  );

  return (
    <div className="space-y-14">
      <QuickAnswer>{guide.quickAnswer}</QuickAnswer>

      <section className="scroll-mt-24">
        <h2 className={SECTION_HEADING}>Why This Calculator Exists</h2>
        <div className={PROSE_BODY}>
          <MarkdownContent content={guide.whyYoureHere} />
        </div>
      </section>

      <DecisionBox shouldConsider={guide.shouldConsider} mode="decision-guide" />

      {contentSections.map((section) => (
        <section key={section.heading} className="scroll-mt-24">
          <h2 className={SECTION_HEADING}>{section.heading}</h2>
          <div className={PROSE_BODY}>
            <MarkdownContent content={section.body} />
          </div>
        </section>
      ))}

      {(interactiveSection || assessment || hasToolCalculator(toolSlug)) && (
        <section className="scroll-mt-24">
          <h2 className={SECTION_HEADING}>{interactiveHeading}</h2>
          {interactiveSection?.body && !isPlaceholderText(interactiveSection.body) && (
            <div className={`${PROSE_BODY} mb-6`}>
              <MarkdownContent content={interactiveSection.body} />
            </div>
          )}
          {assessment ? (
            <AssessmentRenderer definition={assessment} />
          ) : (
            <ToolCalculator slug={toolSlug} />
          )}
        </section>
      )}

      <RealityCheck>{guide.realityCheck}</RealityCheck>

      {guide.worthKnowing && !isPlaceholderText(guide.worthKnowing) && (
        <WorthKnowing>{guide.worthKnowing}</WorthKnowing>
      )}

      {guide.bottomLine && <BottomLine>{guide.bottomLine}</BottomLine>}

      <section aria-label="Frequently asked questions" className="scroll-mt-24">
        <h2 className={SECTION_HEADING}>Frequently Asked Questions</h2>
        {guide.faqs && guide.faqs.some((f) => !isPlaceholderText(f.answer)) ? (
          <div className="max-w-3xl space-y-3">
            {guide.faqs.map((faq) => (
              <div key={faq.question} className="rounded-xl border border-border bg-surface px-5 py-5">
                <h3 className="text-[15px] font-semibold text-foreground">{faq.question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{faq.answer}</p>
              </div>
            ))}
          </div>
        ) : (
          <SectionPlaceholder />
        )}
      </section>
    </div>
  );
}
