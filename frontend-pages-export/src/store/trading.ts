import { create } from "zustand";

export type CollateralSource = "wallet" | "vault";

interface TradingState {
  collateralSource: CollateralSource;
  selectedVaultStrategy: string | null;
  leverage: number;
  side: "LONG" | "SHORT";
  analysisId: string | null;
  analysisTradeType: "spot" | "perps" | null;
  recommendedVaultStrategy: string | null;
  tradeRequestId: string | null;
  setCollateralSource: (value: CollateralSource) => void;
  setSelectedVaultStrategy: (value: string | null) => void;
  setLeverage: (value: number) => void;
  setSide: (value: "LONG" | "SHORT") => void;
  setAnalysisContext: (value: {
    analysisId: string | null;
    analysisTradeType: "spot" | "perps" | null;
    recommendedVaultStrategy: string | null;
  }) => void;
  setTradeRequestId: (value: string | null) => void;
}

export const useTradingStore = create<TradingState>((set) => ({
  collateralSource: "wallet",
  selectedVaultStrategy: null,
  leverage: 5,
  side: "LONG",
  analysisId: null,
  analysisTradeType: null,
  recommendedVaultStrategy: null,
  tradeRequestId: null,
  setCollateralSource: (value) => set({ collateralSource: value }),
  setSelectedVaultStrategy: (value) => set({ selectedVaultStrategy: value }),
  setLeverage: (value) => set({ leverage: value }),
  setSide: (value) => set({ side: value }),
  setAnalysisContext: (value) =>
    set({
      analysisId: value.analysisId,
      analysisTradeType: value.analysisTradeType,
      recommendedVaultStrategy: value.recommendedVaultStrategy,
    }),
  setTradeRequestId: (value) => set({ tradeRequestId: value }),
}));
