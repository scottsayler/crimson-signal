import type { ReactNode } from "react";

export function ReviewSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 text-lg font-medium tracking-tight text-foreground">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2.5 pl-5">
      {items.map((item) => (
        <li key={item} className="text-[15px] leading-relaxed text-muted">
          {item}
        </li>
      ))}
    </ul>
  );
}
