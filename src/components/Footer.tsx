import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="mb-4 flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-sm bg-crimson text-xs font-bold text-white">
                CS
              </span>
              <span className="text-[15px] font-semibold tracking-tight">
                Crimson Signal
              </span>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-muted">
              Independent technology advisory for multi-location organizations.
              Business change creates technology implications.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-light">
              Explore
            </h4>
            <ul className="space-y-2.5">
              {[
                { href: "/business-events", label: "Business Events" },
                { href: "/industries", label: "Industries" },
                { href: "/research", label: "Research" },
                { href: "/executive-briefs", label: "Executive Briefs" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-light">
              Connect
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted transition-colors hover:text-foreground"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/brief"
                  className="text-sm text-muted transition-colors hover:text-foreground"
                >
                  Technology Strategy Session
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 md:flex-row md:items-center">
          <p className="text-xs text-muted-light">
            © {new Date().getFullYear()} Crimson Signal. Independent technology
            advisory.
          </p>
          <p className="text-xs text-muted-light">
            Not affiliated with any vendor or carrier.
          </p>
        </div>
      </div>
    </footer>
  );
}
