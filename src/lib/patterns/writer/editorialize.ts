const FILLER_PREFIXES = [
  /^this is\s+/i,
  /^it is\s+/i,
  /^there is\s+/i,
  /^organizations often\s+/i,
  /^organizations at this scale typically\s+/i,
];

const DESCRIPTION_TO_INTERPRETATION: Array<[RegExp, string]> = [
  [
    /^Growth through acquisition or franchising will inherit heterogeneous technology estates/i,
    "Acquisition and franchise growth will inherit incompatible estates. Early standardization decisions determine how much integration work follows.",
  ],
  [
    /^Revenue opportunity is the primary driver/i,
    "Revenue pressure will put customer-facing consistency under scrutiny before internal teams align.",
  ],
  [
    /^Competitive dynamics are shaping the pace of expansion/i,
    "Competitive pressure is outpacing standardization. That gap will show up in the next opening cycle.",
  ],
  [
    /^Geographic expansion is the strategic intent/i,
    "Geographic expansion multiplies connectivity, compliance, and operating variables that rarely transfer cleanly between markets.",
  ],
  [
    /^The target posture is core standards with local flexibility/i,
    "Core standards with local flexibility only works when the boundary between standard and exception is explicit and enforced.",
  ],
  [
    /^Locations are expected to operate with significant independence/i,
    "Location independence reduces short-term friction but increases integration and audit complexity over time.",
  ],
  [
    /^Full standardization across sites is the ambition/i,
    "Full standardization raises the bar for blueprint definition, testing, and governance before the first opening.",
  ],
  [
    /^Cost predictability is the executive priority/i,
    "Without deliberate architecture, fragmented contracts and per-location provisioning will make forecasting difficult.",
  ],
  [
    /^Rollout speed is the binding constraint/i,
    "Without a location blueprint, each opening will inherit whatever worked last time, including accumulated technical debt.",
  ],
  [
    /^Consistency is the stated pressure point/i,
    "Consistency pressure usually reflects gaps in standards, monitoring, or handoff between real estate, operations, and technology.",
  ],
];

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3)
  );
}

function overlapRatio(a: string, b: string): number {
  const wordsA = tokenize(a);
  const wordsB = tokenize(b);
  if (wordsA.size === 0 || wordsB.size === 0) return 0;

  let shared = 0;
  for (const word of wordsA) {
    if (wordsB.has(word)) shared++;
  }
  return shared / Math.min(wordsA.size, wordsB.size);
}

export function replaceEmDashes(text: string): string {
  return text
    .replace(/\s—\s+which\b/gi, ", which")
    .replace(/\s—\s+and whether\b/gi, ", and whether")
    .replace(/\s—\s+and\b/gi, ", and")
    .replace(/\s—\s+not\b/gi, ", not")
    .replace(/\s—\s+or\b/gi, ", or")
    .replace(/\s—\s+but\b/gi, ". But")
    .replace(/\s—\s+particularly\b/gi, ", particularly")
    .replace(/\s—\s+these\b/gi, ". These")
    .replace(/\s—\s+the\b/gi, ". The")
    .replace(/\s—\s+/g, ". ")
    .replace(/—/g, ", ")
    .replace(/\.\s+([a-z])/g, (_, letter: string) => `. ${letter.toUpperCase()}`)
    .replace(/\s{2,}/g, " ")
    .replace(/\.\s*\./g, ".")
    .trim();
}

function stripMergeArtifacts(text: string): string {
  return text
    .replace(/\{\{[^}]+\}\}/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function applyInterpretation(text: string): string {
  for (const [pattern, replacement] of DESCRIPTION_TO_INTERPRETATION) {
    if (pattern.test(text)) return replacement;
  }
  return text;
}

function tightenProse(text: string): string {
  let result = text;
  for (const prefix of FILLER_PREFIXES) {
    result = result.replace(prefix, "");
  }
  if (result.length > 0) {
    result = result.charAt(0).toUpperCase() + result.slice(1);
  }
  return result;
}

export function editorializeText(text: string): string | null {
  let result = stripMergeArtifacts(text);
  if (!result) return null;
  if (/\{\{|\}\}/.test(result)) return null;

  result = applyInterpretation(result);
  result = replaceEmDashes(result);
  result = tightenProse(result);

  if (!result || result.length < 12) return null;
  return result;
}

export function editorializeParagraph(text: string): string {
  const editorialized = editorializeText(text);
  if (!editorialized) {
    return replaceEmDashes(
      tightenProse(stripMergeArtifacts(text))
    );
  }

  const sentences = editorialized
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const unique: string[] = [];
  for (const sentence of sentences) {
    if (unique.some((existing) => overlapRatio(existing, sentence) > 0.72)) {
      continue;
    }
    unique.push(sentence);
  }

  return unique.join(" ");
}

export function editorializeList(
  items: string[],
  priorTexts: string[] = []
): string[] {
  const exclusions = priorTexts.flatMap((text) =>
    text.split(/(?<=[.!?])\s+/).map((s) => s.trim())
  );

  const result: string[] = [];
  const seenOpenings = new Set<string>();

  for (const raw of items) {
    const editorialized = editorializeText(raw);
    if (!editorialized) continue;

    const isDuplicate = [...exclusions, ...result].some(
      (existing) => overlapRatio(existing, editorialized) > 0.58
    );
    if (isDuplicate) continue;

    const opening = editorialized.split(/\s+/).slice(0, 2).join(" ").toLowerCase();
    if (seenOpenings.has(opening) && result.length >= 2) {
      continue;
    }
    seenOpenings.add(opening);

    result.push(editorialized);
  }

  return result;
}

export function editorializeRoadmapItem(text: string): string | null {
  const editorialized = editorializeText(text);
  if (!editorialized) return null;
  return editorialized.replace(/\.+$/, "");
}
