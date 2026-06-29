import {
  HOME_BANNER_LINE_1,
  HOME_BANNER_LINE_2,
} from "@/lib/copy";

export function HomeBanner() {
  return (
    <div className="mb-8 rounded-xl border border-border bg-border-light/60 px-4 py-4 text-center md:px-5">
      <p className="text-sm font-medium leading-relaxed text-foreground">
        {HOME_BANNER_LINE_1}
      </p>
      <p className="mt-1 text-sm leading-relaxed text-muted">
        {HOME_BANNER_LINE_2}
      </p>
    </div>
  );
}
