import { describe, expect, it } from "vitest";

import { parseNaturalLanguageIntent } from "@/lib/intent/nl-parser";

describe("parseNaturalLanguageIntent", () => {
  it("parses immediate swap intent", () => {
    const parsed = parseNaturalLanguageIntent("swap 100 WETH to POL");
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) {
      return;
    }
    expect(parsed.intent.kind).toBe("swap");
    if (parsed.intent.kind === "swap") {
      expect(parsed.intent.amountIn).toBe(100);
      expect(parsed.intent.tokenIn).toBe("WETH");
      expect(parsed.intent.tokenOut).toBe("POL");
    }
  });

  it("parses price-triggered limit intent", () => {
    const parsed = parseNaturalLanguageIntent("swap 100 WETH to POL when price reaches 3500");
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) {
      return;
    }
    expect(parsed.intent.kind).toBe("limit");
    if (parsed.intent.kind === "limit") {
      expect(parsed.intent.limitPriceUsd).toBe(3500);
    }
  });

  it("parses multi conversion intent", () => {
    const parsed = parseNaturalLanguageIntent("convert 100 WETH, 500 POL, 1000 USDC to USDT");
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) {
      return;
    }
    expect(parsed.intent.kind).toBe("multi");
    if (parsed.intent.kind === "multi") {
      expect(parsed.intent.assets).toHaveLength(3);
      expect(parsed.intent.receiveToken).toBe("USDT");
    }
  });

  it("rejects ambiguous input", () => {
    const parsed = parseNaturalLanguageIntent("buy some ETH soon");
    expect(parsed.ok).toBe(false);
  });
});

