export type {
  PatternId,
  ReportSection,
  ExecutivePattern,
  PatternRegistry,
  PatternEngineInput,
  PatternEngineResult,
  PatternConfidenceBreakdown,
  SelectedPatterns,
  WriteContext,
} from "./types";

export { SECTION_LIMITS } from "./config";
export { runPatternEngine } from "./engine/run";
export { composeReport } from "./writer/compose";
