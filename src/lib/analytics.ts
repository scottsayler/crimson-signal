export type AnalyticsEvent =
  | "landing"
  | "event_selected"
  | "industry_selected"
  | "assessment_completed"
  | "cta_clicked"
  | "form_submitted";

type AnalyticsProperties = Record<string, string | number | boolean | null>;

export function trackEvent(event: AnalyticsEvent, properties?: AnalyticsProperties) {
  const payload = {
    event,
    properties: properties ?? {},
    timestamp: new Date().toISOString(),
    path: typeof window !== "undefined" ? window.location.pathname : undefined,
  };

  if (process.env.NODE_ENV === "development") {
    console.info("[analytics]", payload);
  }

  if (typeof window === "undefined") return;

  const body = JSON.stringify(payload);

  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon("/api/analytics", blob);
    return;
  }

  fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
}
