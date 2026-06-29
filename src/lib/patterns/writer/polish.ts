import type { TechnologyImpactReview } from "../../brief";
import {
  editorializeList,
  editorializeParagraph,
  editorializeRoadmapItem,
} from "./editorialize";

export function polishReview(review: TechnologyImpactReview): TechnologyImpactReview {
  const executiveObservation = editorializeParagraph(review.executiveObservation);
  const prior = [executiveObservation];

  const whatWeHeard = editorializeList(review.whatWeHeard, prior);
  const likelyImpacts = editorializeList(review.likelyImpacts, [
    ...prior,
    ...whatWeHeard,
  ]);
  const blindSpots = editorializeList(review.blindSpots, [
    ...prior,
    ...whatWeHeard,
    ...likelyImpacts,
  ]);
  const questionsToExplore = editorializeList(review.questionsToExplore, [
    ...prior,
    ...whatWeHeard,
    ...likelyImpacts,
    ...blindSpots,
  ]);

  const polishRoadmapItems = (items: string[]) =>
    items
      .map((item) => editorializeRoadmapItem(item))
      .filter((item): item is string => item !== null);

  return {
    ...review,
    executiveObservation,
    whatWeHeard,
    likelyImpacts,
    blindSpots,
    questionsToExplore,
    nextConversation: editorializeParagraph(review.nextConversation),
    roadmap: {
      immediate: polishRoadmapItems(review.roadmap.immediate),
      next30Days: polishRoadmapItems(review.roadmap.next30Days),
      next90Days: polishRoadmapItems(review.roadmap.next90Days),
    },
  };
}
