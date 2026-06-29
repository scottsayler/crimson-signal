import { renderEditorialTemplate } from "./humanize";
import { editorializeText } from "./editorialize";

export function resolvePatternContent(
  content: string,
  variables: Record<string, string>
): string | null {
  const templated = renderEditorialTemplate(content, variables);
  if (templated) {
    return editorializeText(templated);
  }

  const resolved = content.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const value = variables[key]?.trim();
    return value ?? "";
  });

  if (/\{\{[^}]+\}\}/.test(resolved)) return null;

  const cleaned = resolved.replace(/\s{2,}/g, " ").trim();
  if (!cleaned) return null;

  return editorializeText(cleaned);
}
