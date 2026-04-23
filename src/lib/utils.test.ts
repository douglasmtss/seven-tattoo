import {
  cn,
  formatDate,
  formatDateTime,
  generateId,
  truncate,
  sanitizeInput,
  isValidEmail,
  isValidPhone,
  groupByDate,
  getLast7Days,
} from "@/lib/utils";

describe("cn", () => {
  it("should join truthy class names with a space", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  it("should filter out falsy values", () => {
    expect(cn("a", undefined, null, false, "b")).toBe("a b");
  });

  it("should return empty string when all values are falsy", () => {
    expect(cn(undefined, null, false)).toBe("");
  });

  it("should handle empty input", () => {
    expect(cn()).toBe("");
  });

  it("should handle single class", () => {
    expect(cn("only")).toBe("only");
  });
});

describe("formatDate", () => {
  it("should format a valid ISO date to pt-BR format", () => {
    const result = formatDate("2024-01-15T00:00:00.000Z");
    expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });

  it("should handle a date string", () => {
    const result = formatDate("2024-12-31");
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });
});

describe("formatDateTime", () => {
  it("should return a non-empty string for a valid date", () => {
    const result = formatDateTime("2024-06-10T10:30:00.000Z");
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });
});

describe("generateId", () => {
  it("should return a non-empty string", () => {
    const id = generateId();
    expect(typeof id).toBe("string");
    expect(id.length).toBeGreaterThan(0);
  });

  it("should generate unique IDs on each call", () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    expect(ids.size).toBe(100);
  });
});

describe("truncate", () => {
  it("should return the original string if shorter than limit", () => {
    expect(truncate("short", 10)).toBe("short");
  });

  it("should truncate and add ellipsis when string exceeds limit", () => {
    expect(truncate("hello world", 5)).toBe("hello...");
  });

  it("should return the string unchanged when equal to limit", () => {
    expect(truncate("exact", 5)).toBe("exact");
  });

  it("should handle empty string", () => {
    expect(truncate("", 5)).toBe("");
  });

  it("should handle limit of 0", () => {
    expect(truncate("hello", 0)).toBe("...");
  });
});

describe("sanitizeInput", () => {
  it("should escape < and > characters", () => {
    expect(sanitizeInput("<script>")).toBe("&lt;script&gt;");
  });

  it('should escape double quotes', () => {
    expect(sanitizeInput('"test"')).toBe("&quot;test&quot;");
  });

  it("should escape single quotes", () => {
    expect(sanitizeInput("it's")).toBe("it&#x27;s");
  });

  it("should escape forward slashes", () => {
    expect(sanitizeInput("a/b")).toBe("a&#x2F;b");
  });

  it("should return normal strings unchanged", () => {
    expect(sanitizeInput("Hello World")).toBe("Hello World");
  });

  it("should handle empty string", () => {
    expect(sanitizeInput("")).toBe("");
  });
});

describe("isValidEmail", () => {
  it("should return true for a valid email", () => {
    expect(isValidEmail("test@example.com")).toBe(true);
  });

  it("should return false for an email without @", () => {
    expect(isValidEmail("testexample.com")).toBe(false);
  });

  it("should return false for an email without domain", () => {
    expect(isValidEmail("test@")).toBe(false);
  });

  it("should return false for an empty string", () => {
    expect(isValidEmail("")).toBe(false);
  });

  it("should return false for a string with only spaces", () => {
    expect(isValidEmail("   ")).toBe(false);
  });

  it("should return true for email with subdomain", () => {
    expect(isValidEmail("user@mail.example.com")).toBe(true);
  });
});

describe("isValidPhone", () => {
  it("should return true for a valid 11-digit Brazilian phone", () => {
    expect(isValidPhone("21965813894")).toBe(true);
  });

  it("should return true for a formatted phone number", () => {
    expect(isValidPhone("(21) 96581-3894")).toBe(true);
  });

  it("should return false for a phone with fewer than 10 digits", () => {
    expect(isValidPhone("123456")).toBe(false);
  });

  it("should return false for an empty string", () => {
    expect(isValidPhone("")).toBe(false);
  });

  it("should return false for a phone with more than 11 digits", () => {
    expect(isValidPhone("123456789012")).toBe(false);
  });
});

describe("groupByDate", () => {
  it("should group items by date", () => {
    const items = [
      { timestamp: "2024-01-01T10:00:00.000Z" },
      { timestamp: "2024-01-01T15:00:00.000Z" },
      { timestamp: "2024-01-02T10:00:00.000Z" },
    ];
    const result = groupByDate(items);
    expect(Object.keys(result)).toHaveLength(2);
    expect(result["2024-01-01"]).toHaveLength(2);
    expect(result["2024-01-02"]).toHaveLength(1);
  });

  it("should handle empty array", () => {
    expect(groupByDate([])).toEqual({});
  });

  it("should use createdAt when timestamp is not present", () => {
    const items = [{ createdAt: "2024-03-05T09:00:00.000Z" }];
    const result = groupByDate(items);
    expect(result["2024-03-05"]).toHaveLength(1);
  });

  it("should handle items with no timestamp or createdAt", () => {
    const items = [{}];
    const result = groupByDate(items);
    // Items with no date are grouped under "Invalid Date" or a fallback key
    expect(typeof result).toBe("object");
  });
});

describe("getLast7Days", () => {
  it("should return an array of 7 elements", () => {
    const days = getLast7Days();
    expect(days).toHaveLength(7);
  });

  it("should return dates in YYYY-MM-DD format", () => {
    const days = getLast7Days();
    days.forEach((day) => {
      expect(day).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  it("should return dates in ascending order", () => {
    const days = getLast7Days();
    for (let i = 1; i < days.length; i++) {
      expect(days[i] >= days[i - 1]).toBe(true);
    }
  });

  it("should include today as the last element", () => {
    const days = getLast7Days();
    const today = new Date().toISOString().split("T")[0];
    expect(days[6]).toBe(today);
  });
});
