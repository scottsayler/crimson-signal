import { CTAButton } from "@/components/CTAButton";

interface PageCTAProps {
  label: string;
  href: string;
  title?: string;
  description?: string;
}

export function PageCTA({ label, href, title, description }: PageCTAProps) {
  return (
    <section className="mt-12 rounded-2xl border border-crimson/20 bg-crimson-light p-8">
      {title && (
        <h2 className="mb-2 font-serif text-xl font-medium tracking-tight text-foreground">
          {title}
        </h2>
      )}
      {description && (
        <p className="mb-5 text-sm leading-relaxed text-muted">{description}</p>
      )}
      <CTAButton href={href}>{label}</CTAButton>
    </section>
  );
}
