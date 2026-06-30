interface TechnologyStackProps {
  layers: string[];
}

export function TechnologyStack({ layers }: TechnologyStackProps) {
  if (layers.length === 0) return null;

  return (
    <section aria-label="Technology stack">
      <h2 className="mb-4 font-serif text-2xl font-medium tracking-tight text-foreground">
        Technology Stack
      </h2>
      <div className="flex flex-col items-center gap-0">
        {layers.map((layer, index) => (
          <div key={layer} className="flex w-full max-w-xs flex-col items-center">
            <div className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-center text-sm font-medium text-foreground">
              {layer}
            </div>
            {index < layers.length - 1 && (
              <span className="py-1 text-muted-light" aria-hidden="true">
                ↓
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
