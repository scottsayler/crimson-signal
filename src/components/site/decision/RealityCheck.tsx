import { ExecutiveNote } from "./ExecutiveNote";
import { isPlaceholderText } from "@/lib/site/decision-guide";
import { SectionPlaceholder } from "./SectionPlaceholder";

interface RealityCheckProps {
  children: string;
}

export function RealityCheck({ children }: RealityCheckProps) {
  if (!children.trim() || isPlaceholderText(children)) {
    return (
      <section aria-label="Reality check" className="scroll-mt-24">
        <h2 className="mb-5 font-serif text-2xl font-medium tracking-tight text-foreground">
          Reality Check
        </h2>
        <SectionPlaceholder />
      </section>
    );
  }

  return (
    <ExecutiveNote title="Reality Check" variant="reality-check">
      {children}
    </ExecutiveNote>
  );
}
