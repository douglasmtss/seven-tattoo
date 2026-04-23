import { renderHook, act } from "@testing-library/react";
import { useToast } from "@/hooks/useToast";

describe("useToast", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("should start with empty toasts", () => {
    const { result } = renderHook(() => useToast());
    expect(result.current.toasts).toEqual([]);
  });

  it("should add a toast with addToast", () => {
    const { result } = renderHook(() => useToast());
    act(() => {
      result.current.addToast("Hello!", "success");
    });
    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].message).toBe("Hello!");
    expect(result.current.toasts[0].type).toBe("success");
  });

  it("should default type to info when not specified", () => {
    const { result } = renderHook(() => useToast());
    act(() => {
      result.current.addToast("Default type");
    });
    expect(result.current.toasts[0].type).toBe("info");
  });

  it("should remove a toast with removeToast", () => {
    const { result } = renderHook(() => useToast());
    act(() => {
      result.current.addToast("Toast 1", "info");
    });
    const id = result.current.toasts[0].id;
    act(() => {
      result.current.removeToast(id);
    });
    expect(result.current.toasts).toHaveLength(0);
  });

  it("should auto-remove toast after 4 seconds", () => {
    const { result } = renderHook(() => useToast());
    act(() => {
      result.current.addToast("Auto remove", "info");
    });
    expect(result.current.toasts).toHaveLength(1);
    act(() => {
      jest.advanceTimersByTime(4000);
    });
    expect(result.current.toasts).toHaveLength(0);
  });

  it("should not remove other toasts when removing one", () => {
    const { result } = renderHook(() => useToast());
    act(() => {
      result.current.addToast("First", "info");
      result.current.addToast("Second", "success");
    });
    expect(result.current.toasts).toHaveLength(2);
    const firstId = result.current.toasts[0].id;
    act(() => {
      result.current.removeToast(firstId);
    });
    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].message).toBe("Second");
  });

  it("should handle removeToast with non-existent id gracefully", () => {
    const { result } = renderHook(() => useToast());
    act(() => {
      result.current.addToast("Toast", "info");
    });
    act(() => {
      result.current.removeToast("non-existent-id");
    });
    expect(result.current.toasts).toHaveLength(1);
  });

  it("should add multiple toasts", () => {
    const { result } = renderHook(() => useToast());
    act(() => {
      result.current.addToast("One", "success");
      result.current.addToast("Two", "error");
      result.current.addToast("Three", "info");
    });
    expect(result.current.toasts).toHaveLength(3);
  });

  it("should assign unique ids to toasts", () => {
    const { result } = renderHook(() => useToast());
    act(() => {
      result.current.addToast("One", "info");
      result.current.addToast("Two", "info");
    });
    const ids = result.current.toasts.map((t) => t.id);
    expect(new Set(ids).size).toBe(2);
  });
});
