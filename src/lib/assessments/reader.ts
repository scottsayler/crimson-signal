import fs from "fs";
import path from "path";
import yaml from "yaml";
import { normalizeAssessment } from "./normalize";
import type { AssessmentDefinition, RawAssessmentYaml } from "./types";

const ASSESSMENTS_DIR = path.join(process.cwd(), "content", "site", "assessments");

function readAssessmentFile(filePath: string): AssessmentDefinition {
  const raw = fs.readFileSync(filePath, "utf-8");
  const parsed = yaml.parse(raw) as RawAssessmentYaml;
  return normalizeAssessment(parsed);
}

export function readAllAssessmentsFromDisk(): AssessmentDefinition[] {
  if (!fs.existsSync(ASSESSMENTS_DIR)) {
    return [];
  }

  const files = fs
    .readdirSync(ASSESSMENTS_DIR)
    .filter(
      (filename) =>
        (filename.endsWith(".yaml") || filename.endsWith(".yml")) && !filename.startsWith("_")
    );

  const definitions: AssessmentDefinition[] = [];
  const seenIds = new Set<string>();

  for (const filename of files) {
    const definition = readAssessmentFile(path.join(ASSESSMENTS_DIR, filename));

    if (seenIds.has(definition.id)) {
      throw new Error(`Duplicate assessment id "${definition.id}" in ${filename}`);
    }

    seenIds.add(definition.id);
    definitions.push(definition);
  }

  return definitions;
}
