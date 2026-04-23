import { renderHook } from "@testing-library/react";
import { useAnalytics } from "@/hooks/useAnalytics";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  usePathname: jest.fn().mockReturnValue("/"),
}));

// Mock fetch
global.fetch = jest.fn().mockResolvedValue({ ok: true });

describe("useAnalytics", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("should call trackEvent on mount with the current pathname", () => {
    renderHook(() => useAnalytics());
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/analytics",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ type: "pageview", page: "/" }),
      })
    );
  });

  it("should return void", () => {
    const { result } = renderHook(() => useAnalytics());
    expect(result.current).toBeUndefined();
  });

  it("should call fetch when pathname changes", () => {
    const usePathname = jest.requireMock("next/navigation").usePathname as jest.Mock;
    usePathname.mockReturnValueOnce("/galeria");
    renderHook(() => useAnalytics());
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/analytics",
      expect.objectContaining({
        body: JSON.stringify({ type: "pageview", page: "/galeria" }),
      })
    );
  });
});
