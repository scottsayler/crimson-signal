import Link from "next/link";

interface CTAButtonProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}

export function CTAButton({
  href,
  onClick,
  children,
  variant = "primary",
  className = "",
}: CTAButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-all duration-200";
  const styles =
    variant === "primary"
      ? "bg-crimson text-white hover:bg-crimson-dark hover:shadow-[0_4px_16px_rgba(155,27,48,0.25)]"
      : "border border-border bg-surface text-foreground hover:border-crimson/30 hover:bg-crimson-light";

  if (href) {
    return (
      <Link href={href} className={`${base} ${styles} ${className}`}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={`${base} ${styles} ${className}`}>
      {children}
    </button>
  );
}
