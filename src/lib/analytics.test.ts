import {
  trackEvent,
  groupEventsByDay,
  getTopPages,
} from "@/lib/analytics";
import { AnalyticsEvent } from "@/types";

global.fetch = jest.fn();

describe("trackEvent", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("should call fetch with correct parameters for pageview", async (): Promise<void> => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });
    await trackEvent("pageview", "/");
    expect(global.fetch).toHaveBeenCalledWith("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "pageview", page: "/" }),
    });
  });

  it("should call fetch for contact_form event", async (): Promise<void> => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });
    await trackEvent("contact_form", "/");
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("should silently fail when fetch throws", async (): Promise<void> => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("network error"));
    await expect(trackEvent("pageview", "/")).resolves.toBeUndefined();
  });

  it("should not throw when fetch returns non-ok response", async (): Promise<void> => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false, status: 500 });
    await expect(trackEvent("pageview", "/")).resolves.toBeUndefined();
  });
});

describe("groupEventsByDay", () => {
  beforeEach(() => {});
  afterEach(() => {});

  const makeEvent = (timestamp: string, type: AnalyticsEvent["type"] = "pageview"): AnalyticsEvent => ({
    id: "1",
    type,
    page: "/",
    referrer: "",
    userAgent: "",
    timestamp,
  });

  it("should group events by their date", () => {
    const events = [
      makeEvent("2024-01-01T10:00:00.000Z"),
      makeEvent("2024-01-01T20:00:00.000Z"),
      makeEvent("2024-01-02T10:00:00.000Z"),
    ];
    const result = groupEventsByDay(events);
    expect(result).toHaveLength(2);
    const day1 = result.find((r) => r.date === "2024-01-01");
    expect(day1?.count).toBe(2);
  });

  it("should return an empty array for empty input", () => {
    expect(groupEventsByDay([])).toEqual([]);
  });

  it("should sort dates in ascending order", () => {
    const events = [
      makeEvent("2024-03-01T00:00:00.000Z"),
      makeEvent("2024-01-01T00:00:00.000Z"),
      makeEvent("2024-02-01T00:00:00.000Z"),
    ];
    const result = groupEventsByDay(events);
    expect(result[0].date).toBe("2024-01-01");
    expect(result[2].date).toBe("2024-03-01");
  });
});

describe("getTopPages", () => {
  beforeEach(() => {});
  afterEach(() => {});

  const makeEvent = (page: string, type: AnalyticsEvent["type"] = "pageview"): AnalyticsEvent => ({
    id: "1",
    type,
    page,
    referrer: "",
    userAgent: "",
    timestamp: new Date().toISOString(),
  });

  it("should return top pages by pageview count", () => {
    const events = [
      makeEvent("/"),
      makeEvent("/"),
      makeEvent("/galeria"),
      makeEvent("/sobre"),
      makeEvent("/"),
    ];
    const result = getTopPages(events);
    expect(result[0].page).toBe("/");
    expect(result[0].views).toBe(3);
  });

  it("should ignore non-pageview events", () => {
    const events = [
      makeEvent("/", "contact_form"),
      makeEvent("/", "pageview"),
    ];
    const result = getTopPages(events);
    expect(result[0].views).toBe(1);
  });

  it("should return at most 10 pages", () => {
    const events = Array.from({ length: 15 }, (_, i) =>
      makeEvent(`/page${i}`)
    );
    const result = getTopPages(events);
    expect(result.length).toBeLessThanOrEqual(10);
  });

  it("should return empty array for no events", () => {
    expect(getTopPages([])).toEqual([]);
  });

  it("should return empty array when no pageview events", () => {
    const events = [makeEvent("/", "contact_form")];
    expect(getTopPages(events)).toEqual([]);
  });
});
