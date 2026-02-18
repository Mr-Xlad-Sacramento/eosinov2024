import { beforeEach, describe, expect, it } from "vitest";

import { useTradingStore } from "./trading";

describe("useTradingStore", () => {
  beforeEach(() => {
    useTradingStore.setState({
      collateralSource: "wallet",
      selectedVaultStrategy: null,
      leverage: 5,
      side: "LONG",
      analysisId: null,
      analysisTradeType: null,
      recommendedVaultStrategy: null,
      tradeRequestId: null,
    });
  });

  it("starts with expected defaults", () => {
    const state = useTradingStore.getState();
    expect(state.collateralSource).toBe("wallet");
    expect(state.selectedVaultStrategy).toBeNull();
    expect(state.leverage).toBe(5);
    expect(state.side).toBe("LONG");
    expect(state.analysisId).toBeNull();
    expect(state.analysisTradeType).toBeNull();
    expect(state.recommendedVaultStrategy).toBeNull();
    expect(state.tradeRequestId).toBeNull();
  });

  it("updates leverage and side", () => {
    const state = useTradingStore.getState();
    state.setLeverage(12);
    state.setSide("SHORT");

    const updated = useTradingStore.getState();
    expect(updated.leverage).toBe(12);
    expect(updated.side).toBe("SHORT");
  });

  it("updates analyzer context", () => {
    const state = useTradingStore.getState();
    state.setAnalysisContext({
      analysisId: "anl_123",
      analysisTradeType: "perps",
      recommendedVaultStrategy: "katana-stable",
    });
    state.setTradeRequestId("trr_123");

    const updated = useTradingStore.getState();
    expect(updated.analysisId).toBe("anl_123");
    expect(updated.analysisTradeType).toBe("perps");
    expect(updated.recommendedVaultStrategy).toBe("katana-stable");
    expect(updated.tradeRequestId).toBe("trr_123");
  });
});
