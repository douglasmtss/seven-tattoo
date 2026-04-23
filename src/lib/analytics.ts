import { AnalyticsEvent } from "@/types";

export async function trackEvent(
  type: AnalyticsEvent["type"],
  page: string
): Promise<void> {
  try {
    await fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, page }),
    });
  } catch {
    // Silently fail - analytics should never block UX
  }
}

export function groupEventsByDay(
  events: AnalyticsEvent[]
): { date: string; count: number }[] {
  const grouped: Record<string, number> = {};

  events.forEach((e) => {
    const date = new Date(e.timestamp).toISOString().split("T")[0];
    grouped[date] = (grouped[date] || 0) + 1;
  });

  return Object.entries(grouped)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));
}

export function getTopPages(
  events: AnalyticsEvent[]
): { page: string; views: number }[] {
  const pageviews = events.filter((e) => e.type === "pageview");
  const grouped: Record<string, number> = {};

  pageviews.forEach((e) => {
    grouped[e.page] = (grouped[e.page] || 0) + 1;
  });

  return Object.entries(grouped)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([page, views]) => ({ page, views }));
}
