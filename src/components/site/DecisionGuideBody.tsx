import type { AlternativeItem, DecisionGuide, PagePresentationMode, SitePage } from "@/lib/site/types";
import { isPlaceholderText } from "@/lib/site/decision-guide";
import { MarkdownContent } from "@/components/MarkdownContent";
import {
  QuickAnswer,
  DecisionBox,
  RealityCheck,
  WorthKnowing,
  AskBeforeYouBuy,
  DecisionMatrix,
  BottomLine,
  EvidenceCard,
  IndustrySnapshot,
  TechnologyStack,
  BuyingTriggerTimeline,
  SectionPlaceholder,
  QuestionList,
  CrimsonSignalPerspective,
  EvidenceBehindGuide,
} from "./decision";

function isAlternativeItem(item: string | AlternativeItem): item is AlternativeItem {
  return typeof item === "object" && "title" in item;
}

const SECTION_HEADING =
  "mb-5 font-serif text-2xl font-medium tracking-tight text-foreground";
const PROSE_BODY = "max-w-3xl text-[15px] leading-[1.75] text-muted";

interface DecisionGuideBodyProps {
  guide: DecisionGuide;
  sections?: SitePage["sections"];
  presentationMode?: PagePresentationMode;
}

/**
 * Renders the full Editorial System section flow.
 * All required components are always present per DESIGN_SYSTEM.md.
 */
export function DecisionGuideBody({
  guide,
  sections = [],
  presentationMode = "decision-guide",
}: DecisionGuideBodyProps) {
  const askBeforeYouBuy = guide.askBeforeYouBuy ?? guide.questionsToAsk;

  return (
    <div className="space-y-14">
      <QuickAnswer>{guide.quickAnswer}</QuickAnswer>

      <DecisionBox shouldConsider={guide.shouldConsider} mode={presentationMode} />

      <section className="scroll-mt-24">
        <h2 className={SECTION_HEADING}>Why You&apos;re Here</h2>
        <div className={PROSE_BODY}>
          <MarkdownContent content={guide.whyYoureHere} />
        </div>
      </section>

      <section className="scroll-mt-24">
        <h2 className={SECTION_HEADING}>What Problem Does It Solve?</h2>
        <div className={PROSE_BODY}>
          <MarkdownContent content={guide.whatProblemSolves} />
        </div>
      </section>

      <section className="scroll-mt-24">
        <h2 className={SECTION_HEADING}>Alternatives</h2>
        {guide.alternatives.length > 0 &&
        !guide.alternatives.every((a) => typeof a === "string" && isPlaceholderText(a)) ? (
          <ul className="max-w-3xl space-y-3">
            {guide.alternatives.map((alt) => {
              if (isAlternativeItem(alt)) {
                return (
                  <li
                    key={alt.title}
                    className="rounded-xl border border-border bg-surface px-5 py-4"
                  >
                    <p className="font-medium text-foreground">{alt.title}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">
                      {alt.description}
                    </p>
                  </li>
                );
              }
              if (isPlaceholderText(alt)) {
                return (
                  <li key={alt}>
                    <SectionPlaceholder />
                  </li>
                );
              }
              return (
                <li key={alt} className="flex gap-2.5 text-[15px] leading-relaxed text-muted">
                  <span aria-hidden="true" className="text-muted-light">
                    •
                  </span>
                  <span>{alt}</span>
                </li>
              );
            })}
          </ul>
        ) : (
          <SectionPlaceholder />
        )}
      </section>

      <section className="scroll-mt-24">
        <h2 className={SECTION_HEADING}>Questions to Ask</h2>
        <p className="mb-5 max-w-3xl text-sm leading-relaxed text-muted">
          Start with these questions to clarify fit, scope, and risk before going deeper.
        </p>
        {guide.questionsToAsk.some((q) => !isPlaceholderText(q)) ? (
          <div className="max-w-3xl">
            <QuestionList
              questions={guide.questionsToAsk.filter((q) => !isPlaceholderText(q))}
              variant="evaluate"
            />
          </div>
        ) : (
          <SectionPlaceholder />
        )}
      </section>

      {guide.buyingTriggerTimeline && guide.buyingTriggerTimeline.length > 0 && (
        <BuyingTriggerTimeline steps={guide.buyingTriggerTimeline} />
      )}

      {guide.industrySnapshot && <IndustrySnapshot snapshot={guide.industrySnapshot} />}

      {guide.technologyStack && guide.technologyStack.length > 0 && (
        <TechnologyStack layers={guide.technologyStack} />
      )}

      {sections.map((section) => (
        <section key={section.heading} className="scroll-mt-24">
          <h2 className={SECTION_HEADING}>{section.heading}</h2>
          <div className={PROSE_BODY}>
            <MarkdownContent content={section.body} />
          </div>
        </section>
      ))}

      <RealityCheck>{guide.realityCheck}</RealityCheck>

      {guide.worthKnowing && !isPlaceholderText(guide.worthKnowing) && (
        <WorthKnowing>{guide.worthKnowing}</WorthKnowing>
      )}

      {guide.crimsonSignalPerspective &&
        !isPlaceholderText(guide.crimsonSignalPerspective) && (
          <CrimsonSignalPerspective>{guide.crimsonSignalPerspective}</CrimsonSignalPerspective>
        )}

      <DecisionMatrix rows={guide.decisionMatrix ?? []} />

      <AskBeforeYouBuy questions={askBeforeYouBuy} />

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

      {guide.evidence && guide.evidence.length > 0 && (
        <EvidenceCard items={guide.evidence} />
      )}

      {guide.evidenceBehindGuide && (
        <EvidenceBehindGuide data={guide.evidenceBehindGuide} />
      )}
    </div>
  );
}
