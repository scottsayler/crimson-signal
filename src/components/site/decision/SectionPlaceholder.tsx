import { EMPTY_SECTION_MESSAGE } from "@/lib/site/standards";

interface SectionPlaceholderProps {
  message?: string;
}

export function SectionPlaceholder({
  message = EMPTY_SECTION_MESSAGE,
}: SectionPlaceholderProps) {
  return (
    <p className="rounded-lg border border-dashed border-border bg-border-light/40 px-4 py-3 text-sm italic text-muted-light">
      {message}
    </p>
  );
}
