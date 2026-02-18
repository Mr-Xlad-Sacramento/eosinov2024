import { describe, expect, it } from "vitest";

import { asCurrency, cn, formatPercentFromBps } from "./utils";

describe("utils", () => {
  it("formats bps into a percentage string", () => {
    expect(formatPercentFromBps(420)).toBe("4.20%");
  });

  it("formats valid numeric strings as USD currency", () => {
    expect(asCurrency("12000.5")).toBe("$12,000.50");
  });

  it("returns original value when currency parsing fails", () => {
    expect(asCurrency("not-a-number")).toBe("not-a-number");
  });

  it("merges class names", () => {
    expect(cn("px-2", false && "hidden", "py-1")).toContain("px-2");
    expect(cn("px-2", false && "hidden", "py-1")).toContain("py-1");
  });
});
