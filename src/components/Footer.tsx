import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 sm:flex-row sm:px-6">
        <p className="text-xs text-muted-light">
          © {new Date().getFullYear()} Crimson Signal
        </p>
        <div className="flex items-center gap-4">
          {[
            { href: "/industries", label: "Industries" },
            { href: "/research", label: "Research" },
            { href: "/about", label: "About" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xs text-muted-light transition-colors hover:text-muted"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
