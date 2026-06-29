import type {
  ExecutivePattern,
  PatternConfidenceBreakdown,
  PatternScore,
  ReportSection,
  SelectedPatterns,
} from "../types";
import { SECTION_LIMITS } from "../config";

function patternsForSection(
  scores: PatternScore[],
  section: ReportSection
): PatternScore[] {
  return scores.filter((s) => s.pattern.section === section);
}

function selectWithThemeDedup(
  sectionScores: PatternScore[],
  limit: number
): { selected: ExecutivePattern[]; winners: Map<string, PatternScore> } {
  const selected: ExecutivePattern[] = [];
  const usedThemes = new Set<string>();
  const winners = new Map<string, PatternScore>();

  for (const score of sectionScores) {
    if (selected.length >= limit) break;

    const theme = score.pattern.theme;
    if (theme) {
      if (usedThemes.has(theme)) continue;
      usedThemes.add(theme);
    }

    selected.push(score.pattern);
    winners.set(score.pattern.id, score);
  }

  return { selected, winners };
}

function selectSingleDominant(
  sectionScores: PatternScore[]
): { pattern: ExecutivePattern | null; winner: PatternScore | null } {
  if (sectionScores.length === 0) {
    return { pattern: null, winner: null };
  }
  const winner = sectionScores[0];
  return { pattern: winner.pattern, winner };
}

export function selectPatterns(scores: PatternScore[]): {
  selected: SelectedPatterns;
  confidence: PatternConfidenceBreakdown[];
} {
  const observationScores = patternsForSection(scores, "executiveObservation");
  const { pattern: dominantObservation, winner: observationWinner } =
    selectSingleDominant(observationScores);

  const whatWeHeard = selectWithThemeDedup(
    patternsForSection(scores, "whatWeHeard"),
    SECTION_LIMITS.whatWeHeard
  );
  const likelyImpacts = selectWithThemeDedup(
    patternsForSection(scores, "likelyImpacts"),
    SECTION_LIMITS.likelyImpacts
  );
  const blindSpots = selectWithThemeDedup(
    patternsForSection(scores, "blindSpots"),
    SECTION_LIMITS.blindSpots
  );
  const questionsToExplore = selectWithThemeDedup(
    patternsForSection(scores, "questionsToExplore"),
    SECTION_LIMITS.questionsToExplore
  );
  const areasToExploreNext = selectWithThemeDedup(
    patternsForSection(scores, "areasToExploreNext"),
    SECTION_LIMITS.areasToExploreNext
  );
  const roadmapImmediate = selectWithThemeDedup(
    patternsForSection(scores, "roadmap.immediate"),
    SECTION_LIMITS["roadmap.immediate"]
  );
  const roadmap30 = selectWithThemeDedup(
    patternsForSection(scores, "roadmap.next30Days"),
    SECTION_LIMITS["roadmap.next30Days"]
  );
  const roadmap90 = selectWithThemeDedup(
    patternsForSection(scores, "roadmap.next90Days"),
    SECTION_LIMITS["roadmap.next90Days"]
  );
  const nextConversation = selectSingleDominant(
    patternsForSection(scores, "nextConversation")
  );

  const winnerById = new Map<string, PatternScore>();
  if (observationWinner) winnerById.set(observationWinner.pattern.id, observationWinner);
  for (const bucket of [
    whatWeHeard,
    likelyImpacts,
    blindSpots,
    questionsToExplore,
    areasToExploreNext,
    roadmapImmediate,
    roadmap30,
    roadmap90,
  ]) {
    for (const [id, score] of bucket.winners) {
      winnerById.set(id, score);
    }
  }
  if (nextConversation.winner) {
    winnerById.set(
      nextConversation.winner.pattern.id,
      nextConversation.winner
    );
  }

  const selectedIds = new Set(winnerById.keys());

  const confidence: PatternConfidenceBreakdown[] = scores.map((score) => {
    const isSelected = selectedIds.has(score.pattern.id);
    let selectionReason: string | undefined;

    if (isSelected) {
      if (score.pattern.section === "executiveObservation") {
        selectionReason = "dominant observation (highest score in section)";
      } else if (score.pattern.section === "nextConversation") {
        selectionReason = "top next conversation pattern";
      } else {
        selectionReason = score.pattern.theme
          ? `selected within theme "${score.pattern.theme}"`
          : "selected within section quota";
      }
    } else if (
      score.pattern.theme &&
      scores.some(
        (s) =>
          selectedIds.has(s.pattern.id) &&
          s.pattern.theme === score.pattern.theme &&
          s.pattern.section === score.pattern.section
      )
    ) {
      selectionReason = "superseded by higher-scoring pattern in same theme";
    } else if (
      patternsForSection(scores, score.pattern.section).findIndex(
        (s) => s.pattern.id === score.pattern.id
      ) >= SECTION_LIMITS[score.pattern.section]
    ) {
      selectionReason = "below section quota";
    }

    return {
      patternId: score.pattern.id,
      section: score.pattern.section,
      finalScore: score.finalScore,
      selected: isSelected,
      selectionReason,
      factors: {
        basePriority: score.basePriority,
        industryMultiplier: score.industryMultiplier,
        answerDelta: score.answerDelta,
        matchedSignals: score.matchedSignals,
        matchedConditions: score.matchedConditions,
      },
    };
  });

  return {
    selected: {
      executiveObservation: dominantObservation,
      dominantPrinciple: dominantObservation?.principle ?? null,
      whatWeHeard: whatWeHeard.selected,
      likelyImpacts: likelyImpacts.selected,
      blindSpots: blindSpots.selected,
      questionsToExplore: questionsToExplore.selected,
      areasToExploreNext: areasToExploreNext.selected,
      roadmap: {
        immediate: roadmapImmediate.selected,
        next30Days: roadmap30.selected,
        next90Days: roadmap90.selected,
      },
      nextConversation: nextConversation.pattern,
    },
    confidence,
  };
}
