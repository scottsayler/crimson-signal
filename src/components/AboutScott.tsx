import Link from "next/link";
import { SCOTT_LINKEDIN_URL } from "@/lib/copy";

const CREDENTIALS = [
  "Experience with multi-location organizations",
  "100+ cloud transformation projects",
] as const;

export function AboutScott() {
  return (
    <section className="mb-10 border-t border-border pt-10">
      <div className="flex gap-5">
        <div
          className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-border bg-border-light text-lg font-medium text-muted"
          aria-label="Scott Sayler headshot placeholder"
        >
          SS
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-medium tracking-tight text-foreground">
            Scott Sayler
          </h2>
          <p className="mt-1 text-sm font-medium text-crimson">
            Independent Technology Advisor
          </p>
          <ul className="mt-3 space-y-1.5">
            {CREDENTIALS.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-[15px] leading-relaxed text-muted"
              >
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-crimson" />
                {item}
              </li>
            ))}
          </ul>
          <Link
            href={SCOTT_LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-crimson"
          >
            View LinkedIn profile
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
