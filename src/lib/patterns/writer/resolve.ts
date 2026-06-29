export function resolvePatternContent(
  content: string,
  variables: Record<string, string>
): string {
  return content.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const value = variables[key];
    return value ?? `{{${key}}}`;
  });
}
