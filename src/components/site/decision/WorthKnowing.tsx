import { ExecutiveNote } from "./ExecutiveNote";

interface WorthKnowingProps {
  children: string;
}

export function WorthKnowing({ children }: WorthKnowingProps) {
  return (
    <ExecutiveNote title="Worth Knowing" variant="worth-knowing">
      {children}
    </ExecutiveNote>
  );
}
