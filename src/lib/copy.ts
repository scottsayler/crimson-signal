export const HOME_HEADLINE = "Business decisions create technology consequences.";

export const HOME_SUBHEAD =
  "Understand the technology implications of organizational change before evaluating products or vendors.";

export const HOME_HERO_PRIMARY_CTA = "Start Your Technology Impact Review";

export const HOME_HERO_SECONDARY_CTA = "View Sample Reviews";

export const HOME_BUSINESS_EVENTS_EYEBROW = "Business Events";

export const HOME_BUSINESS_EVENTS_HEADING =
  "What changed in your organization?";

export const HOME_BUSINESS_EVENTS_SUBHEAD =
  "Select the business situation driving your technology conversation. Each path leads to a focused Technology Impact Review.";

export const HOME_HOW_IT_WORKS_EYEBROW = "How It Works";

export const HOME_HOW_IT_WORKS_HEADING = "From business change to clarity";

export const HOME_HOW_IT_WORKS_STEPS = [
  {
    title: "Choose your business situation",
    body: "Start with what changed — expansion, acquisition, cost pressure, or another organizational shift.",
  },
  {
    title: "Answer a few focused questions",
    body: "A short conversation about your context. No vendor pitches, no product recommendations.",
  },
  {
    title: "Receive a Technology Impact Review",
    body: "Executive observations, technology implications, blind spots, and questions leadership should consider.",
  },
] as const;

export const HOME_SAMPLE_REVIEWS_EYEBROW = "Sample Reviews";

export const HOME_SAMPLE_REVIEWS_HEADING =
  "See what a Technology Impact Review looks like";

export const HOME_SAMPLE_REVIEWS_SUBHEAD =
  "Real examples of how business change surfaces technology implications across industries.";

export const HOME_WHY_EYEBROW = "Why Crimson Signal";

export const HOME_WHY_HEADING = "Technology advisory without an agenda";

export const HOME_WHY_POINTS = [
  {
    title: "Independent technology advisory",
    body: "Guidance shaped by your business situation — not by a product catalog or carrier contract.",
  },
  {
    title: "Vendor neutral",
    body: "No technology products to sell and no vendor relationships to protect. The focus is on what you need to decide.",
  },
  {
    title: "Built for executive teams",
    body: "Focused on helping leadership understand technology consequences before timelines narrow the options.",
  },
] as const;

export const HOME_FOOTER_CTA_HEADING = "Ready to understand what changed?";

export const HOME_FOOTER_CTA_BUTTON = "Start Your Technology Impact Review";

export const CONVERSATION_PAGE_SUBHEAD =
  "Business change creates technology implications. Select the event driving your organization's technology conversation.";

export const CONVERSATION_INTRO_LABEL = "Technology Impact Review";

export const CONVERSATION_INTRO_CONFIRM_SITUATION = "Situation";

export const CONVERSATION_INTRO_CONFIRM_INDUSTRY = "Industry";

export const CONVERSATION_INTRO_WHAT_HEADING = "What you'll do";

export const CONVERSATION_INTRO_WHAT_BODY =
  "Answer a short set of focused questions about your organization's situation.";

export const CONVERSATION_INTRO_WHAT_BODY_SECOND =
  "Your responses guide the review. We don't draw conclusions until we understand the context.";

export const CONVERSATION_INTRO_DURATION_HEADING = "How long it takes";

export const CONVERSATION_INTRO_DURATION_BODY = "About 2 minutes.";

export function conversationIntroQuestionCountBody(questionCount: number) {
  const questionLabel = questionCount === 1 ? "question" : "questions";

  return `${questionCount} ${questionLabel}, answered one at a time.`;
}

export const CONVERSATION_INTRO_RECEIVE_HEADING = "What you'll receive";

export const CONVERSATION_INTRO_RECEIVE_INTRO =
  "A Technology Impact Review tailored to your responses, including:";

export const CONVERSATION_INTRO_RECEIVE_ITEMS = [
  "Executive observations",
  "Technology implications",
  "Common blind spots",
  "Questions leadership should consider",
  "Suggested sequencing",
] as const;

export const CONVERSATION_INTRO_WHY_HEADING = "Why this matters";

export const CONVERSATION_INTRO_WHY_BODY =
  "Business decisions create technology consequences.";

export const CONVERSATION_INTRO_WHY_BODY_SECOND =
  "Understanding those consequences before evaluating products or vendors helps leadership make better decisions.";

export const HOME_BANNER_LINE_1 =
  "Business decisions create technology consequences.";

export const HOME_BANNER_LINE_2 =
  "Crimson Signal helps executive teams understand those consequences before they evaluate vendors.";

export const VALIDATE_ASSESSMENT_HEADING = "Validate This Assessment";

export const VALIDATE_ASSESSMENT_HOOK =
  "These implications deserve a second opinion from someone without a product to sell. A short working conversation — not a vendor pitch — to pressure-test what matters most before your timeline narrows the options.";

export const VALIDATE_ASSESSMENT_BODY =
  "Want to pressure-test these assumptions with someone who isn't selling anything? We'll explore your situation together, sequence what to evaluate, and identify what must be decided before commitments are made.";

export const VALIDATE_ASSESSMENT_DEFAULT_CTA = "Request a validation conversation";

export const UNEXPECTED_QUESTION = "Was anything in this assessment unexpected?";

export const UNEXPECTED_YES_HOOK =
  "When the implications surprise you, a second perspective helps separate signal from noise before vendor conversations begin.";

export const UNEXPECTED_YES_CTA = "Talk through what surprised you";

export const UNEXPECTED_SOMEWHAT_HOOK =
  "When some of this rings true and some doesn't, that's worth exploring together before you commit to a direction.";

export const UNEXPECTED_SOMEWHAT_CTA = "Validate what resonated";

export const UNEXPECTED_NO_HOOK =
  "When the assessment aligns with your instincts, the next step is pressure-testing these conclusions before commitments are made.";

export const UNEXPECTED_NO_CTA = "Pressure-test these conclusions";

export const CONTACT_FORM_PROMPT_LABEL =
  "What prompted you to run this assessment today?";

export const CONTACT_FORM_SUCCESS =
  "Thank you — we'll be in touch shortly to schedule a conversation.";

export const SCOTT_LINKEDIN_URL = "https://www.linkedin.com/in/scottsayler";

export const CONVERSATION_SECONDS_PER_QUESTION = 45;
export const CONVERSATION_SECONDS_FOR_REVIEW = 30;
