import "server-only";
import fs from "fs";
import path from "path";
import { parse as parseYaml } from "yaml";
import type {
  AnswerWeightEntry,
  AnswerWeightFile,
  IndustryWeightFile,
  PatternGroupFile,
  PatternRegistry,
  SignalWeightFile,
} from "../types";
import { buildEventIndex, parsePatternDefinition } from "./parse";

const PATTERNS_DIR = path.join(process.cwd(), "content", "patterns");
const DEFINITIONS_DIR = path.join(PATTERNS_DIR, "definitions");
const WEIGHTS_DIR = path.join(PATTERNS_DIR, "weights");

function readYamlFile<T>(filePath: string): T | null {
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  return parseYaml(raw) as T;
}

function collectYamlFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];

  const files: string[] = [];
  for (const entry of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      files.push(...collectYamlFiles(fullPath));
    } else if (entry.endsWith(".yaml") || entry.endsWith(".yml")) {
      files.push(fullPath);
    }
  }
  return files;
}

function loadPatternDefinitions(): Map<string, ReturnType<typeof parsePatternDefinition>> {
  const patterns = new Map<string, ReturnType<typeof parsePatternDefinition>>();
  const files = collectYamlFiles(DEFINITIONS_DIR);

  for (const filePath of files) {
    const group = readYamlFile<PatternGroupFile>(filePath);
    if (!group?.patterns?.length) continue;

    for (const raw of group.patterns) {
      const pattern = parsePatternDefinition(raw);
      if (patterns.has(pattern.id)) {
        throw new Error(
          `Duplicate pattern id "${pattern.id}" in ${filePath}`
        );
      }
      patterns.set(pattern.id, pattern);
    }
  }

  return patterns;
}

function loadIndustryWeights(): Map<string, Map<string, number>> {
  const industryDir = path.join(WEIGHTS_DIR, "industries");
  const weights = new Map<string, Map<string, number>>();
  if (!fs.existsSync(industryDir)) return weights;

  for (const filename of fs.readdirSync(industryDir)) {
    if (!filename.endsWith(".yaml") && !filename.endsWith(".yml")) continue;
    const file = readYamlFile<IndustryWeightFile>(
      path.join(industryDir, filename)
    );
    if (!file?.industry || !file.patterns) continue;
    weights.set(file.industry, new Map(Object.entries(file.patterns)));
  }

  return weights;
}

function loadSignalWeights(): Map<string, Map<string, number>> {
  const file = readYamlFile<SignalWeightFile>(
    path.join(WEIGHTS_DIR, "signals.yaml")
  );
  const weights = new Map<string, Map<string, number>>();
  if (!file?.signals) return weights;

  for (const [signal, adjustments] of Object.entries(file.signals)) {
    weights.set(signal, new Map(Object.entries(adjustments)));
  }
  return weights;
}

function loadAnswerWeights(): Map<string, AnswerWeightEntry[]> {
  const answerDir = path.join(WEIGHTS_DIR, "answers");
  const weights = new Map<string, AnswerWeightEntry[]>();
  if (!fs.existsSync(answerDir)) return weights;

  for (const filename of fs.readdirSync(answerDir)) {
    if (!filename.endsWith(".yaml") && !filename.endsWith(".yml")) continue;
    const file = readYamlFile<AnswerWeightFile>(
      path.join(answerDir, filename)
    );
    if (!file?.event || !file.adjustments) continue;
    weights.set(file.event, file.adjustments);
  }
  return weights;
}

export function loadPatternRegistry(): PatternRegistry {
  const patterns = loadPatternDefinitions();

  return {
    patterns,
    eventIndex: buildEventIndex(patterns),
    industryWeights: loadIndustryWeights(),
    signalWeights: loadSignalWeights(),
    answerWeights: loadAnswerWeights(),
  };
}
