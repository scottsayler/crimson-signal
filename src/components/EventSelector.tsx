import type { BusinessEvent } from "@/lib/types";
import {
  HOME_HEADLINE,
  HOME_SUBHEAD,
  CONVERSATION_PAGE_SUBHEAD,
} from "@/lib/copy";

interface EventSelectorProps {
  events: BusinessEvent[];
  variant: "home" | "page";
  onSelect: (event: BusinessEvent) => void;
}

export function EventSelector({ events, variant, onSelect }: EventSelectorProps) {
  const isHome = variant === "home";

  return (
    <div className={isHome ? "w-full" : ""}>
      <div className={isHome ? "mb-8 text-center" : "mb-6 text-center"}>
        <h1
          className={`font-medium tracking-tight text-foreground ${
            isHome ? "text-2xl md:text-[1.75rem]" : "font-serif text-4xl md:text-5xl"
          }`}
        >
          {HOME_HEADLINE}
        </h1>
        {isHome && (
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted md:text-[15px]">
            {HOME_SUBHEAD}
          </p>
        )}
      </div>

      {isHome ? (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {events.map((event) => (
            <button
              key={event.slug}
              onClick={() => onSelect(event)}
              className="group flex w-full items-center justify-between rounded-xl border border-border bg-surface px-4 py-3.5 text-left transition-all duration-150 hover:border-foreground/15 hover:bg-border-light/50 active:scale-[0.99]"
            >
              <span className="text-sm font-medium text-foreground">
                {event.title}
              </span>
              <span className="text-muted-light transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-muted">
                →
              </span>
            </button>
          ))}
        </div>
      ) : (
        <>
          <p className="mx-auto mb-10 max-w-lg text-center text-[15px] leading-relaxed text-muted">
            {CONVERSATION_PAGE_SUBHEAD}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {events.map((event) => (
              <button
                key={event.slug}
                onClick={() => onSelect(event)}
                className="group flex flex-col rounded-xl border border-border bg-surface p-5 text-left transition-all duration-200 hover:border-crimson/30 hover:bg-border-light/40"
              >
                <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-crimson-light text-base text-crimson transition-colors group-hover:bg-crimson group-hover:text-white">
                  {event.icon}
                </span>
                <span className="mb-1 text-[16px] font-semibold tracking-tight text-foreground">
                  {event.title}
                </span>
                <span className="text-sm leading-relaxed text-muted">
                  {event.shortDescription}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
