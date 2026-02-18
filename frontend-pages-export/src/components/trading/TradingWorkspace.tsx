"use client";

import { FormEvent, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  ChartColumnBig,
  Plus,
  Repeat,
  Settings,
  Shield,
  Sparkles,
  X,
} from "lucide-react";

import { standrApi } from "@/lib/api/standr";
import { protocolApi } from "@/components/protocol/api";
import { TradingSurfaceNav } from "@/components/trading/TradingSurfaceNav";
import { DEMO_TOKEN } from "@/lib/constants";
import { useTraderAddress } from "@/lib/hooks/use-trader-address";
import { parseNaturalLanguageIntent } from "@/lib/intent/nl-parser";
import { AdvancedTradingMode } from "@/lib/types/domain";

type TradingMode = "Swap" | "Limit" | "DCA" | "Multi" | "Intent";

type TokenOption = {
  symbol: string;
  name: string;
  chain: string;
  address: string;
  priceUsd: number;
  icon: string;
};

type AssetRow = {
  id: string;
  token: string;
  amount: string;
};

type PendingAdvancedOrder = {
  mode: AdvancedTradingMode;
  payload: Record<string, unknown>;
  summary: string;
} | null;

const TOKEN_OPTIONS: TokenOption[] = [
  {
    symbol: "POL",
    name: "Polygon",
    chain: "Polygon",
    address: DEMO_TOKEN,
    priceUsd: 0.23,
    icon: "P",
  },
  {
    symbol: "USDT",
    name: "Tether",
    chain: "Solana",
    address: "0x0000000000000000000000000000000000000002",
    priceUsd: 1,
    icon: "T",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    chain: "Katana",
    address: "0x0000000000000000000000000000000000000003",
    priceUsd: 1,
    icon: "$",
  },
  {
    symbol: "WETH",
    name: "Wrapped Ether",
    chain: "Ethereum",
    address: "0x0000000000000000000000000000000000000004",
    priceUsd: 2200,
    icon: "E",
  },
];

function findToken(symbol: string): TokenOption {
  const normalized = symbol.trim().toUpperCase();
  return TOKEN_OPTIONS.find((token) => token.symbol === normalized) ?? TOKEN_OPTIONS[0];
}

function normalizeAmount(value: number): string {
  return value.toString();
}

function estimateMinOut(amountIn: number, tokenIn: TokenOption, tokenOut: TokenOption): string {
  const grossUsd = amountIn * tokenIn.priceUsd;
  const output = grossUsd / tokenOut.priceUsd;
  return (output * 0.9).toFixed(6);
}

function toFiniteNumber(value: string, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function queryModeToTradingMode(modeQuery: string): TradingMode | null {
  const normalized = modeQuery.trim().toLowerCase();
  const map: Record<string, TradingMode> = {
    swap: "Swap",
    limit: "Limit",
    dca: "DCA",
    multi: "Multi",
    intent: "Intent",
  };
  return map[normalized] ?? null;
}

export function TradingWorkspace() {
  const { traderAddress } = useTraderAddress();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<TradingMode>(() => {
    const fromQuery = queryModeToTradingMode(searchParams.get("mode") ?? "");
    return fromQuery ?? "Swap";
  });
  const [tokenIn, setTokenIn] = useState("POL");
  const [tokenOut, setTokenOut] = useState("USDT");
  const [amountIn, setAmountIn] = useState("1000");
  const [minAmountOut, setMinAmountOut] = useState("950");
  const [limitPrice, setLimitPrice] = useState("1.00");
  const [dcaFrequency, setDcaFrequency] = useState("5");
  const [dcaUnit, setDcaUnit] = useState("minutes");
  const [dcaOrders, setDcaOrders] = useState("4");
  const [slippage, setSlippage] = useState("1");
  const [intentText, setIntentText] = useState("");
  const [multiAssets, setMultiAssets] = useState<AssetRow[]>([
    { id: "asset_1", token: "POL", amount: "500" },
    { id: "asset_2", token: "USDC", amount: "500" },
  ]);
  const [showSettings, setShowSettings] = useState(false);
  const [showAdvancedConfirm, setShowAdvancedConfirm] = useState(false);
  const [pendingAdvanced, setPendingAdvanced] = useState<PendingAdvancedOrder>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedTokenIn = useMemo(() => findToken(tokenIn), [tokenIn]);
  const selectedTokenOut = useMemo(() => findToken(tokenOut), [tokenOut]);
  const estimatedReceive = useMemo(() => {
    const input = Number(amountIn);
    if (!Number.isFinite(input) || input <= 0) {
      return "0";
    }
    const grossUsd = input * selectedTokenIn.priceUsd;
    const output = grossUsd / selectedTokenOut.priceUsd;
    return output.toFixed(2);
  }, [amountIn, selectedTokenIn.priceUsd, selectedTokenOut.priceUsd]);
  const isCrossChainRoute = selectedTokenIn.chain !== selectedTokenOut.chain;
  const crossChainRouteNotice = `${selectedTokenIn.chain} -> ${selectedTokenOut.chain} (AggLayer primary, Avail Nexus + LayerZero fallback)`;

  const parsedIntent = useMemo(() => parseNaturalLanguageIntent(intentText), [intentText]);

  const advancedOrdersQuery = useQuery({
    queryKey: ["advanced-orders", traderAddress],
    queryFn: () => standrApi.getAdvancedTradingOrdersForTrader(traderAddress),
    staleTime: 5_000,
  });
  const liveSwapMutation = useMutation({
    mutationFn: async (params: {
      tokenInAddress: string;
      tokenOutAddress: string;
      amountInValue: string;
      minAmountOutValue: string;
      crossChain: boolean;
      routeLabel: string;
    }) => {
      const deadlineUnix = Math.floor(Date.now() / 1000) + 60 * 10;
      const parsedAmount = toFiniteNumber(params.amountInValue, 0);
      const parsedMinOut = toFiniteNumber(params.minAmountOutValue, Math.max(parsedAmount * 0.9, 1));
      const parsedSlippage = toFiniteNumber(slippage, 1);
      const shouldBatch = parsedAmount >= 5_000 || parsedSlippage <= 0.35;

      if (shouldBatch) {
        const slices = parsedAmount >= 20_000 ? 4 : 2;
        const amountPerIntent = (parsedAmount / slices).toString();
        const minOutPerIntent = (parsedMinOut / slices).toString();
        const batch = await protocolApi.submitBatchIntents({
          trader: traderAddress,
          intents: Array.from({ length: slices }).map(() => ({
            token_in: params.tokenInAddress,
            token_out: params.tokenOutAddress,
            amount_in: amountPerIntent,
            min_amount_out: minOutPerIntent,
            deadline_unix: deadlineUnix,
          })),
        });
        return {
          referenceId: batch.batch_id,
          executionPath: "batch" as const,
          crossChain: params.crossChain,
          routeLabel: params.routeLabel,
        };
      }

      try {
        const gasless = await protocolApi.submitGaslessIntent({
          trader: traderAddress,
          token_in: params.tokenInAddress,
          token_out: params.tokenOutAddress,
          amount_in: params.amountInValue,
          min_amount_out: params.minAmountOutValue,
          deadline_unix: deadlineUnix,
        });
        return {
          referenceId: gasless.intent_id,
          executionPath: "gasless" as const,
          crossChain: params.crossChain,
          routeLabel: params.routeLabel,
        };
      } catch {
        const intent = await standrApi.createIntent({
          trader: traderAddress,
          token_in: params.tokenInAddress,
          token_out: params.tokenOutAddress,
          amount_in: params.amountInValue,
          min_amount_out: params.minAmountOutValue,
          deadline_unix: deadlineUnix,
        });
        return {
          referenceId: intent.intent_id,
          executionPath: "direct" as const,
          crossChain: params.crossChain,
          routeLabel: params.routeLabel,
        };
      }
    },
    onSuccess: (data) => {
      setError(null);
      const routeText = data.crossChain ? `Cross-chain route auto-selected (${data.routeLabel}). ` : "";
      if (data.executionPath === "batch") {
        setFeedback(`${routeText}Execution submitted in internal batch mode. Ref ${data.referenceId}.`);
        return;
      }
      if (data.executionPath === "gasless") {
        setFeedback(`${routeText}Execution submitted with sponsored gas. Ref ${data.referenceId}.`);
        return;
      }
      setFeedback(`${routeText}Execution submitted. Ref ${data.referenceId}.`);
    },
    onError: (mutationError) => {
      setFeedback(null);
      setError(mutationError instanceof Error ? mutationError.message : "Swap failed");
    },
  });

  const advancedOrderMutation = useMutation({
    mutationFn: async (input: { mode: AdvancedTradingMode; payload: Record<string, unknown>; summary: string }) => {
      const idempotencyKey = [traderAddress.toLowerCase(), input.mode, JSON.stringify(input.payload)].join("|");

      const created = await standrApi.createAdvancedTradingOrder(
        {
          trader: traderAddress,
          mode: input.mode,
          summary: input.summary,
          payload: input.payload,
        },
        idempotencyKey,
      );
      const executed = await standrApi.executeAdvancedTradingOrder(created.order_id);
      return {
        created,
        executed,
      };
    },
    onSuccess: async (result) => {
      setError(null);
      const executionKind =
        result.executed.execution &&
        typeof result.executed.execution === "object"
          ? (result.executed.execution as Record<string, unknown>)["execution_kind"]
          : null;
      const executionKindText = typeof executionKind === "string" ? executionKind : "ok";
      setFeedback(`Advanced order executed: ${result.created.order_id} (${executionKindText})`);
      setShowAdvancedConfirm(false);
      setPendingAdvanced(null);
      await queryClient.invalidateQueries({ queryKey: ["advanced-orders", traderAddress] });
    },
    onError: (mutationError) => {
      setFeedback(null);
      setError(mutationError instanceof Error ? mutationError.message : "Advanced execution failed");
      setShowAdvancedConfirm(false);
    },
  });

  function onSwapTokens() {
    setTokenIn(tokenOut);
    setTokenOut(tokenIn);
  }

  function onAddMultiAsset() {
    if (multiAssets.length >= 4) {
      return;
    }
    setMultiAssets((prev) => [
      ...prev,
      {
        id: `asset_${prev.length + 1}`,
        token: TOKEN_OPTIONS[(prev.length + 1) % TOKEN_OPTIONS.length].symbol,
        amount: "0",
      },
    ]);
  }

  function onUpdateMultiAsset(id: string, field: "token" | "amount", value: string) {
    setMultiAssets((prev) => prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  }

  function onRemoveMultiAsset(id: string) {
    setMultiAssets((prev) => prev.filter((row) => row.id !== id));
  }

  function buildManualAdvancedOrder(): { mode: AdvancedTradingMode; payload: Record<string, unknown>; summary: string } {
    if (mode === "Limit") {
      return {
        mode: "limit",
        payload: {
          token_in: tokenIn,
          token_out: tokenOut,
          amount_in: amountIn,
          min_amount_out: minAmountOut,
          limit_price: Number(limitPrice),
        },
        summary: `Limit ${amountIn} ${tokenIn} -> ${tokenOut} @ ${limitPrice}`,
      };
    }

    if (mode === "DCA") {
      return {
        mode: "dca",
        payload: {
          token_in: tokenIn,
          token_out: tokenOut,
          amount_per_order: amountIn,
          min_amount_out: minAmountOut,
          frequency_value: Number(dcaFrequency),
          frequency_unit: dcaUnit,
          total_orders: Number(dcaOrders),
        },
        summary: `DCA ${amountIn} ${tokenIn} every ${dcaFrequency} ${dcaUnit} x ${dcaOrders}`,
      };
    }

    return {
      mode: "multi",
      payload: {
        receive_token: tokenOut,
        assets: multiAssets.map((asset) => ({
          token: asset.token,
          amount: asset.amount,
        })),
        slippage: Number(slippage),
      },
      summary: `Multi ${multiAssets.map((asset) => `${asset.amount} ${asset.token}`).join(", ")}`,
    };
  }

  function queueAdvancedOrder(order: { mode: AdvancedTradingMode; payload: Record<string, unknown>; summary: string }) {
    setPendingAdvanced(order);
    setShowAdvancedConfirm(true);
  }

  function submitIntentMode() {
    if (!parsedIntent.ok) {
      setError(parsedIntent.error);
      return;
    }

    if (parsedIntent.intent.kind === "swap") {
      const tokenInOption = findToken(parsedIntent.intent.tokenIn);
      const tokenOutOption = findToken(parsedIntent.intent.tokenOut);
      const amountValue = normalizeAmount(parsedIntent.intent.amountIn);
      const minOutValue = estimateMinOut(parsedIntent.intent.amountIn, tokenInOption, tokenOutOption);

      liveSwapMutation.mutate({
        tokenInAddress: tokenInOption.address,
        tokenOutAddress: tokenOutOption.address,
        amountInValue: amountValue,
        minAmountOutValue: minOutValue,
        crossChain: tokenInOption.chain !== tokenOutOption.chain,
        routeLabel: `${tokenInOption.chain} -> ${tokenOutOption.chain}`,
      });
      return;
    }

    if (parsedIntent.intent.kind === "limit") {
      const tokenInOption = findToken(parsedIntent.intent.tokenIn);
      const tokenOutOption = findToken(parsedIntent.intent.tokenOut);
      const minOut = estimateMinOut(parsedIntent.intent.amountIn, tokenInOption, tokenOutOption);
      queueAdvancedOrder({
        mode: "limit",
        payload: {
          token_in: parsedIntent.intent.tokenIn,
          token_out: parsedIntent.intent.tokenOut,
          amount_in: normalizeAmount(parsedIntent.intent.amountIn),
          min_amount_out: minOut,
          limit_price: parsedIntent.intent.limitPriceUsd,
          trigger_price_usd: parsedIntent.intent.limitPriceUsd,
          intent_text: intentText,
        },
        summary: parsedIntent.intent.summary,
      });
      return;
    }

    if (parsedIntent.intent.kind === "dca") {
      queueAdvancedOrder({
        mode: "dca",
        payload: {
          token_in: parsedIntent.intent.tokenIn,
          token_out: parsedIntent.intent.tokenOut,
          amount_per_order: normalizeAmount(parsedIntent.intent.amountPerOrder),
          min_amount_out: normalizeAmount(parsedIntent.intent.amountPerOrder * 0.9),
          frequency_value: parsedIntent.intent.frequencyValue,
          frequency_unit: parsedIntent.intent.frequencyUnit,
          total_orders: parsedIntent.intent.totalOrders,
          intent_text: intentText,
        },
        summary: parsedIntent.intent.summary,
      });
      return;
    }

    if (parsedIntent.intent.kind === "split") {
      queueAdvancedOrder({
        mode: "multi",
        payload: {
          receive_token: parsedIntent.intent.allocations.map((a) => a.token).join(","),
          assets: parsedIntent.intent.allocations.map((a) => ({
            token: a.token,
            amount: normalizeAmount(parsedIntent.intent.kind === "split" ? parsedIntent.intent.amountIn * a.percentage / 100 : 0),
          })),
          slippage: Number(slippage),
          intent_text: intentText,
        },
        summary: parsedIntent.intent.summary,
      });
      return;
    }

    queueAdvancedOrder({
      mode: "multi",
      payload: {
        receive_token: parsedIntent.intent.receiveToken,
        assets: parsedIntent.intent.assets.map((asset) => ({
          token: asset.token,
          amount: normalizeAmount(asset.amount),
        })),
        slippage: Number(slippage),
        intent_text: intentText,
      },
      summary: parsedIntent.intent.summary,
    });
  }

  function onSubmitTrade(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);
    setError(null);

    if (mode === "Swap") {
      liveSwapMutation.mutate({
        tokenInAddress: selectedTokenIn.address,
        tokenOutAddress: selectedTokenOut.address,
        amountInValue: amountIn,
        minAmountOutValue: minAmountOut,
        crossChain: isCrossChainRoute,
        routeLabel: crossChainRouteNotice,
      });
      return;
    }

    if (mode === "Intent") {
      submitIntentMode();
      return;
    }

    queueAdvancedOrder(buildManualAdvancedOrder());
  }

  function onConfirmAdvancedExecution() {
    if (!pendingAdvanced) {
      return;
    }
    advancedOrderMutation.mutate(pendingAdvanced);
  }

  const canSubmit = useMemo(() => {
    if (mode === "Swap") {
      return Number(amountIn) > 0 && Number(minAmountOut) > 0;
    }
    if (mode === "Limit") {
      return Number(amountIn) > 0 && Number(minAmountOut) > 0 && Number(limitPrice) > 0;
    }
    if (mode === "DCA") {
      return Number(amountIn) > 0 && Number(minAmountOut) > 0 && Number(dcaFrequency) > 0 && Number(dcaOrders) > 0;
    }
    if (mode === "Multi") {
      return multiAssets.every((asset) => Number(asset.amount) > 0) && multiAssets.length >= 2;
    }
    if (!intentText.trim()) {
      return false;
    }
    return parsedIntent.ok;
  }, [amountIn, dcaFrequency, dcaOrders, intentText, limitPrice, minAmountOut, mode, multiAssets, parsedIntent.ok]);

  return (
    <div className="space-y-4">
      <section className="warning-banner rounded-2xl px-4 py-3 text-xs">
        <AlertTriangle className="mr-2 inline" size={14} />
        Critical Risk Warning: leveraged and volatile markets can result in severe loss. This interface is tooling, not financial advice.
      </section>

      <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)_430px]">
        <TradingSurfaceNav />

        <section className="space-y-4">
          <div className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                  <div className="rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-sm text-muted">
                  {selectedTokenIn.icon} {selectedTokenIn.symbol}
                </div>
                <span className="text-sm text-muted">/</span>
                  <div className="rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-sm text-muted">
                  {selectedTokenOut.icon} {selectedTokenOut.symbol}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted">Estimated Receive</p>
                <p className="text-lg font-semibold text-blue-300">{estimatedReceive}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-8">
            <div className="flex h-[320px] items-center justify-center rounded-2xl border border-dashed border-line bg-canvas/50">
              <div className="text-center">
                <ChartColumnBig className="mx-auto text-blue-300" size={42} />
                <p className="mt-4 text-base font-semibold">Market Chart Placeholder</p>
                <p className="mt-1 text-sm text-muted">
                  Analyzer-inspired chart container. Data panel wiring can be added later without changing layout.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-4">
            <h3 className="text-sm uppercase tracking-[0.14em] text-muted">Advanced Order History</h3>
            {advancedOrdersQuery.isLoading ? (
              <p className="mt-3 text-sm text-muted">Loading backend orders...</p>
            ) : advancedOrdersQuery.isError ? (
              <p className="mt-3 text-sm text-danger">
                {advancedOrdersQuery.error instanceof Error
                  ? advancedOrdersQuery.error.message
                  : "Failed to load advanced order history"}
              </p>
            ) : !advancedOrdersQuery.data || advancedOrdersQuery.data.orders.length === 0 ? (
              <p className="mt-3 text-sm text-muted">No advanced backend orders yet.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {advancedOrdersQuery.data.orders.map((order) => (
                  <li key={order.order_id} className="rounded-xl border border-line bg-[#0b1018] p-3 text-sm">
                    <p className="font-semibold text-ink">{order.order_id}</p>
                    <p className="mt-1 text-muted">{order.summary}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.12em] text-blue-300">
                      {order.mode} | {order.status}
                    </p>
                    <p className="mt-1 text-xs text-muted">{new Date(order.updated_at * 1000).toLocaleString()}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <aside className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-5 shadow-[0_20px_45px_rgba(2,6,23,0.34)]">
          <form className="space-y-4" onSubmit={onSubmitTrade}>
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap items-center gap-1">
                {(["Swap", "Limit", "DCA", "Multi", "Intent"] as TradingMode[]).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setMode(item)}
                className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                      mode === item ? "bg-cyan-500/20 text-cyan-100" : "text-muted hover:bg-[#0b1018] hover:text-ink"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setShowSettings(true)}
                className="rounded-full border border-line bg-[#0b1018] p-2 text-muted hover:text-ink"
              >
                <Settings size={14} />
              </button>
            </div>

            {mode !== "Swap" ? (
              <div className="rounded-xl border border-cyan-400/35 bg-cyan-500/12 px-3 py-2 text-xs text-cyan-100">
                <Sparkles size={12} className="mr-1 inline" />
                Advanced execution mode: {mode} orders are orchestrated internally and routed to the correct execution module.
              </div>
            ) : null}

            <div className="rounded-xl border border-success/40 bg-success/10 px-3 py-2 text-xs text-success">
              <Shield size={12} className="mr-1 inline" />
              Gasless execution and batch intent splitting are automatic when needed. You do not need to manually submit sponsored transactions.
            </div>

            {isCrossChainRoute ? (
              <div className="rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-xs text-muted">
                Cross-chain path detected: {crossChainRouteNotice}.
              </div>
            ) : null}

            {mode !== "Intent" ? (
              <div className="space-y-2 rounded-2xl border border-line bg-[#0b1018]/90 p-4">
                <label className="block text-sm text-muted">
                  Amount In
                  <input
                    value={amountIn}
                    onChange={(event) => setAmountIn(event.target.value)}
                    className="mt-1 w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
                  />
                </label>
                <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
                  <label className="text-sm text-muted">
                    Token In
                    <select
                      value={tokenIn}
                      onChange={(event) => setTokenIn(event.target.value)}
                      className="mt-1 w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
                    >
                      {TOKEN_OPTIONS.map((token) => (
                        <option key={token.symbol} value={token.symbol}>
                          {token.symbol}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button
                    type="button"
                    onClick={onSwapTokens}
                    className="mb-1 rounded-full border border-line bg-[#0b1018] p-2 text-muted hover:text-ink"
                  >
                    <Repeat size={14} />
                  </button>
                  <label className="text-sm text-muted">
                    Token Out
                    <select
                      value={tokenOut}
                      onChange={(event) => setTokenOut(event.target.value)}
                      className="mt-1 w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
                    >
                      {TOKEN_OPTIONS.map((token) => (
                        <option key={token.symbol} value={token.symbol}>
                          {token.symbol}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <label className="block text-sm text-muted">
                  Min Amount Out
                  <input
                    value={minAmountOut}
                    onChange={(event) => setMinAmountOut(event.target.value)}
                    className="mt-1 w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
                  />
                </label>
              </div>
            ) : null}

            {mode === "Limit" ? (
              <label className="block text-sm text-muted">
                Limit Price
                <input
                  value={limitPrice}
                  onChange={(event) => setLimitPrice(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
                />
              </label>
            ) : null}

            {mode === "DCA" ? (
              <div className="grid grid-cols-2 gap-2">
                <label className="text-sm text-muted">
                  Every
                  <input
                    value={dcaFrequency}
                    onChange={(event) => setDcaFrequency(event.target.value)}
                    className="mt-1 w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
                  />
                </label>
                <label className="text-sm text-muted">
                  Unit
                  <select
                    value={dcaUnit}
                    onChange={(event) => setDcaUnit(event.target.value)}
                    className="mt-1 w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
                  >
                    <option value="minutes">Minutes</option>
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                  </select>
                </label>
                <label className="col-span-2 text-sm text-muted">
                  Total Orders
                  <input
                    value={dcaOrders}
                    onChange={(event) => setDcaOrders(event.target.value)}
                    className="mt-1 w-full rounded-xl border border-line bg-panel-strong px-3 py-2 text-ink"
                  />
                </label>
              </div>
            ) : null}

            {mode === "Multi" ? (
                <div className="space-y-2 rounded-2xl border border-line bg-[#0b1018]/90 p-4">
                {multiAssets.map((asset) => (
                  <div key={asset.id} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                    <select
                      value={asset.token}
                      onChange={(event) => onUpdateMultiAsset(asset.id, "token", event.target.value)}
                      className="rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
                    >
                      {TOKEN_OPTIONS.map((token) => (
                        <option key={token.symbol} value={token.symbol}>
                          {token.symbol}
                        </option>
                      ))}
                    </select>
                    <input
                      value={asset.amount}
                      onChange={(event) => onUpdateMultiAsset(asset.id, "amount", event.target.value)}
                      className="rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
                    />
                    <button
                      type="button"
                      onClick={() => onRemoveMultiAsset(asset.id)}
                      className="rounded-xl border border-line bg-[#0b1018] px-2 text-muted hover:text-ink"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                {multiAssets.length < 4 ? (
                  <button
                    type="button"
                    onClick={onAddMultiAsset}
                    className="inline-flex items-center gap-1 rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-xs font-semibold text-muted hover:text-ink"
                  >
                    <Plus size={13} /> Add asset
                  </button>
                ) : null}
              </div>
            ) : null}

            {mode === "Intent" ? (
                <div className="space-y-3 rounded-2xl border border-line bg-[#0b1018]/90 p-4">
                <label className="block text-sm text-muted">
                  Natural Language Intent
                  <textarea
                    value={intentText}
                    onChange={(event) => setIntentText(event.target.value)}
                    className="mt-1 min-h-[120px] w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
                    placeholder="swap 100 WETH to POL"
                  />
                </label>
                <p className="text-xs text-muted">
                  Strict patterns only: swap, price-triggered swap, DCA, and multi convert statements.
                </p>
                {intentText.trim().length > 0 ? (
                  parsedIntent.ok ? (
                    <div className="rounded-xl border border-success/35 bg-success/10 px-3 py-2 text-xs text-success">
                      <p className="font-semibold uppercase tracking-[0.08em]">Parsed {parsedIntent.intent.kind} intent</p>
                      <p className="mt-1">{parsedIntent.intent.summary}</p>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-danger/35 bg-danger/10 px-3 py-2 text-xs text-danger">
                      {parsedIntent.error}
                    </div>
                  )
                ) : null}
              </div>
            ) : null}

            {error ? <p className="text-sm text-danger">{error}</p> : null}
            {feedback ? <p className="text-sm text-success">{feedback}</p> : null}

            <button
              type="submit"
              disabled={!canSubmit || liveSwapMutation.isPending || advancedOrderMutation.isPending}
              className="w-full rounded-2xl border border-cyan-400/40 bg-cyan-500/15 px-4 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20 disabled:opacity-60"
            >
              {liveSwapMutation.isPending || advancedOrderMutation.isPending
                ? "Submitting..."
                : mode === "Swap"
                  ? "Submit Swap"
                  : mode === "Intent"
                    ? "Execute Intent"
                    : `Create + Execute ${mode} Order`}
            </button>

            <p className="text-xs text-muted">
              Wallet context: <span className="font-semibold text-ink">{traderAddress}</span>
            </p>
          </form>
        </aside>
      </div>

      {showSettings ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-3">
          <div className="w-full max-w-lg rounded-2xl border border-line bg-gradient-to-br from-[#111729] via-[#11151f] to-[#0d1118] p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Trading Settings</h3>
              <button
                type="button"
                onClick={() => setShowSettings(false)}
                className="rounded-full border border-line bg-[#0b1018] p-2 text-muted hover:text-ink"
              >
                <X size={14} />
              </button>
            </div>
            <label className="mt-4 block text-sm text-muted">
              Slippage %
              <input
                value={slippage}
                onChange={(event) => setSlippage(event.target.value)}
                className="mt-1 w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
              />
            </label>
            <p className="mt-3 text-xs text-muted">
              Routing note: this frontend calls backend advanced order APIs for non-swap modes.
            </p>
            <button
              type="button"
              onClick={() => setShowSettings(false)}
              className="mt-5 rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20"
            >
              Save
            </button>
          </div>
        </div>
      ) : null}

      {showAdvancedConfirm && pendingAdvanced ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-3">
          <div className="w-full max-w-lg rounded-2xl border border-line bg-gradient-to-br from-[#111729] via-[#11151f] to-[#0d1118] p-6">
            <div className="inline-flex items-center gap-1 rounded-full border border-cyan-400/35 bg-cyan-500/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100">
              <Sparkles size={12} />
              Backend Advanced Execution
            </div>
            <h3 className="mt-3 text-xl font-semibold">Confirm Order Submission</h3>
            <p className="mt-2 text-sm text-muted">{pendingAdvanced.summary}</p>
            <p className="mt-2 text-xs text-muted">
              This will create an advanced backend order and execute it immediately.
            </p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAdvancedConfirm(false)}
                className="rounded-xl border border-line bg-[#0b1018] px-4 py-2 text-sm font-semibold text-ink"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirmAdvancedExecution}
                className="rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
