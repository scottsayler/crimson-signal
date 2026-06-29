import Link from "next/link";
import { PRIMARY_NAV } from "@/lib/site/navigation";
import { MobileNav } from "@/components/site/MobileNav";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="relative mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-sm bg-crimson text-[10px] font-bold text-white">
            CS
          </span>
          <span className="text-sm font-semibold tracking-tight text-foreground">
            Crimson Signal
          </span>
        </Link>

        <nav className="hidden items-center gap-5 lg:flex">
          {PRIMARY_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[13px] text-muted transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <MobileNav />
      </div>
    </header>
  );
}
