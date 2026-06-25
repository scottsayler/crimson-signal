import Link from "next/link";

const NAV_ITEMS = [
  { href: "/business-events", label: "Business Events" },
  { href: "/industries", label: "Industries" },
  { href: "/research", label: "Research" },
  { href: "/executive-briefs", label: "Executive Briefs" },
  { href: "/about", label: "About" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-sm bg-crimson text-xs font-bold text-white">
            CS
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-foreground">
            Crimson Signal
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[13px] font-medium text-muted transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/brief"
          className="rounded-full bg-crimson px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-crimson-dark"
        >
          Get Your Brief
        </Link>
      </div>
    </header>
  );
}
