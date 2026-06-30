import { QuestionList } from "./QuestionList";
import { SectionPlaceholder } from "./SectionPlaceholder";

interface AskBeforeYouBuyProps {
  questions: string[];
}

export function AskBeforeYouBuy({ questions }: AskBeforeYouBuyProps) {
  return (
    <section aria-label="Ask before you buy" className="scroll-mt-24">
      <h2 className="mb-2 font-serif text-2xl font-medium tracking-tight text-foreground">
        Ask Before You Buy
      </h2>
      <p className="mb-5 max-w-3xl text-sm leading-relaxed text-muted">
        Use these questions during vendor conversations and contract review.
      </p>
      {questions.length === 0 ? (
        <SectionPlaceholder />
      ) : (
        <QuestionList questions={questions} numbered variant="buy" />
      )}
    </section>
  );
}
