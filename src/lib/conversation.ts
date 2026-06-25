export type ConversationStep =
  | "select"
  | "industry"
  | "intro"
  | "conversation"
  | "brief";

export type ConversationAnswers = Record<string, string | string[]>;
