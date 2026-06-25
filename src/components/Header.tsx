import Link from "next/link";

const NAV_ITEMS = [
  { href: "/business-events", label: "Business Events" },
  { href: "/industries", label: "Industries" },
  { href: "/research", label: "Research" },
  { href: "/about", label: "About" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-sm bg-crimson text-[10px] font-bold text-white">
            CS
          </span>
          <span className="text-sm font-semibold tracking-tight text-foreground">
            Crimson Signal
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[13px] text-muted transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
