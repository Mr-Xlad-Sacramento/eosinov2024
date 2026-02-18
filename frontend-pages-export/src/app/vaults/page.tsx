"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { formatUnits } from "viem";

import { PageFrame } from "@/components/page-frame";
import { WiringBadges } from "@/components/wiring-badges";
import { standrApi } from "@/lib/api/standr";
import { useTraderAddress } from "@/lib/hooks/use-trader-address";
import { useYieldAggregator } from "@/lib/hooks/contracts";
import { useTradingStore } from "@/store/trading";

type ActionMode = "deposit" | "withdraw" | null;

function parseNumber(value: string, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

const sectionCardClass =
  "rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017]";
const inputClass =
  "mt-1 w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45";

export default function VaultsOverviewPage() {
  const { traderAddress } = useTraderAddress();
  const queryClient = useQueryClient();
  const selectedVaultStrategy = useTradingStore((state) => state.selectedVaultStrategy);
  const yieldOnChain = useYieldAggregator();

  const [activeAction, setActiveAction] = useState<ActionMode>(null);
  const [selectedVaultAddress, setSelectedVaultAddress] = useState("");
  const [depositAmount, setDepositAmount] = useState("1000");
  const [withdrawShares, setWithdrawShares] = useState("100");
  const [vaultMode, setVaultMode] = useState("balanced");
  const [optimizeAmount, setOptimizeAmount] = useState("10000");
  const [optimizeChainId, setOptimizeChainId] = useState("137");
  const [autoHedgeAmount0, setAutoHedgeAmount0] = useState("500");
  const [autoHedgeAmount1, setAutoHedgeAmount1] = useState("500");
  const [autoHedgeWithdrawShares, setAutoHedgeWithdrawShares] = useState("50");
  const [erc4626Assets, setErc4626Assets] = useState("1000");
  const [erc4626Shares, setErc4626Shares] = useState("500");
  const [leverageCollateralAmount, setLeverageCollateralAmount] = useState("1500");
  const [leverageRecursionLevel, setLeverageRecursionLevel] = useState("2");
  const [swapTokenIn, setSwapTokenIn] = useState("USDC");
  const [swapTokenOut, setSwapTokenOut] = useState("USDT");
  const [swapAmountIn, setSwapAmountIn] = useState("1000");
  const [wrapToken, setWrapToken] = useState("USDC");
  const [wrapAmount, setWrapAmount] = useState("400");
  const [unwrapVaultToken, setUnwrapVaultToken] = useState("vUSDC");
  const [unwrapShares, setUnwrapShares] = useState("250");
  const [shareValueToken, setShareValueToken] = useState("USDC");
  const [shareValueShares, setShareValueShares] = useState("100");

  const vaultsQuery = useQuery({
    queryKey: ["vault-overview-vaults"],
    queryFn: standrApi.getVaults,
  });
  const balanceQuery = useQuery({
    queryKey: ["vault-overview-balance", traderAddress],
    queryFn: () => standrApi.getYieldBalance(traderAddress),
  });
  const apyQuery = useQuery({
    queryKey: ["vault-overview-apy"],
    queryFn: standrApi.getApy,
  });
  const apyHistoryQuery = useQuery({
    queryKey: ["vault-overview-apy-history"],
    queryFn: standrApi.getYieldApyHistory,
  });
  const sourceDistributionQuery = useQuery({
    queryKey: ["vault-overview-source-distribution"],
    queryFn: standrApi.getYieldSourceDistribution,
  });
  const vaultModeQuery = useQuery({
    queryKey: ["vault-overview-mode", traderAddress],
    queryFn: () => standrApi.getVaultMode(traderAddress),
  });
  const autoHedgedMetricsQuery = useQuery({
    queryKey: ["vault-overview-autohedged-metrics", traderAddress],
    queryFn: () => standrApi.getAutoHedgedMetrics(traderAddress),
  });
  const autoHedgedUserQuery = useQuery({
    queryKey: ["vault-overview-autohedged-user", traderAddress],
    queryFn: () => standrApi.getAutoHedgedUserInfo(traderAddress),
  });
  const erc4626PreviewQuery = useQuery({
    queryKey: ["vault-overview-erc4626-preview", erc4626Assets],
    queryFn: () => standrApi.erc4626PreviewDeposit({ assets: parseNumber(erc4626Assets, 0) }),
    enabled: parseNumber(erc4626Assets, 0) > 0,
  });
  const autoHedgedPositionQuery = useQuery({
    queryKey: ["vault-overview-autohedged-position", traderAddress],
    queryFn: () => standrApi.getAutoHedgedPositionInfo(traderAddress),
    enabled: false,
  });
  const wiringQuery = useQuery({
    queryKey: ["wiring-report"],
    queryFn: standrApi.getWiringReport,
  });

  const selectedVault = useMemo(() => {
    const vaults = vaultsQuery.data ?? [];
    return (
      vaults.find((vault) => vault.vault_address === selectedVaultAddress) ?? vaults[0] ?? null
    );
  }, [selectedVaultAddress, vaultsQuery.data]);

  const totalPendingRewards = useMemo(
    () => (balanceQuery.data?.rewards ?? []).reduce((sum, reward) => sum + Number(reward.pending_amount), 0),
    [balanceQuery.data?.rewards],
  );

  const strategyList = useMemo(
    () => Array.from(new Set((vaultsQuery.data ?? []).map((vault) => vault.strategy))),
    [vaultsQuery.data],
  );
  const wiringByKey = useMemo(() => {
    return new Map((wiringQuery.data?.bindings ?? []).map((binding) => [binding.feature_key, binding]));
  }, [wiringQuery.data?.bindings]);
  const wiringMode = wiringQuery.data?.execution_mode ?? "simulation";
  const wiring = (featureKey: string) => wiringByKey.get(featureKey) ?? null;

  const depositMutation = useMutation({
    mutationFn: () =>
      standrApi.depositToYield({
        address: traderAddress,
        vault_address: selectedVault?.vault_address ?? "",
        amount: parseNumber(depositAmount, 0),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["vault-overview-balance", traderAddress] });
      await queryClient.invalidateQueries({ queryKey: ["vault-overview-vaults"] });
    },
  });

  const withdrawMutation = useMutation({
    mutationFn: () =>
      standrApi.withdrawFromYield({
        address: traderAddress,
        shares: parseNumber(withdrawShares, 0),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["vault-overview-balance", traderAddress] });
    },
  });

  const setModeMutation = useMutation({
    mutationFn: () => standrApi.setVaultMode({ wallet_address: traderAddress, mode: vaultMode }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["vault-overview-mode", traderAddress] });
    },
  });
  const depositWithModeMutation = useMutation({
    mutationFn: () =>
      standrApi.depositWithMode({
        wallet_address: traderAddress,
        amount: parseNumber(depositAmount, 0),
      }),
  });
  const optimizeMutation = useMutation({
    mutationFn: () =>
      standrApi.optimizeCrossChainYield({
        wallet_address: traderAddress,
        amount: parseNumber(optimizeAmount, 0),
        source_chain_id: parseNumber(optimizeChainId, 137),
      }),
  });
  const leverageLendingMutation = useMutation({
    mutationFn: () =>
      standrApi.executeLeverageLending({
        wallet_address: traderAddress,
        collateral_amount: parseNumber(leverageCollateralAmount, 0),
        recursion_level: parseNumber(leverageRecursionLevel, 1),
      }),
  });
  const swapExactInMutation = useMutation({
    mutationFn: () =>
      standrApi.swapExactInYield({
        token_in: swapTokenIn,
        token_out: swapTokenOut,
        amount_in: parseNumber(swapAmountIn, 0),
      }),
  });
  const wrapMutation = useMutation({
    mutationFn: () =>
      standrApi.wrapYieldToken({
        wallet_address: traderAddress,
        token: wrapToken,
        amount: parseNumber(wrapAmount, 0),
      }),
  });
  const unwrapMutation = useMutation({
    mutationFn: () =>
      standrApi.unwrapYieldToken({
        wallet_address: traderAddress,
        vault_token: unwrapVaultToken,
        shares: parseNumber(unwrapShares, 0),
      }),
  });
  const shareValueMutation = useMutation({
    mutationFn: () =>
      standrApi.getYieldShareValue({
        base_token: shareValueToken,
        shares: parseNumber(shareValueShares, 0),
      }),
  });
  const autoHedgedDepositMutation = useMutation({
    mutationFn: () =>
      standrApi.autoHedgedDeposit({
        wallet_address: traderAddress,
        amount0: parseNumber(autoHedgeAmount0, 0),
        amount1: parseNumber(autoHedgeAmount1, 0),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["vault-overview-autohedged-metrics", traderAddress] });
      await queryClient.invalidateQueries({ queryKey: ["vault-overview-autohedged-user", traderAddress] });
    },
  });
  const autoHedgedWithdrawMutation = useMutation({
    mutationFn: () =>
      standrApi.autoHedgedWithdraw({
        wallet_address: traderAddress,
        shares: parseNumber(autoHedgeWithdrawShares, 0),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["vault-overview-autohedged-metrics", traderAddress] });
      await queryClient.invalidateQueries({ queryKey: ["vault-overview-autohedged-user", traderAddress] });
    },
  });
  const autoHedgedRebalanceMutation = useMutation({
    mutationFn: () => standrApi.autoHedgedRebalance({ wallet_address: traderAddress }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["vault-overview-autohedged-metrics", traderAddress] });
    },
  });
  const autoHedgedFeesMutation = useMutation({
    mutationFn: () => standrApi.autoHedgedCollectFees({ wallet_address: traderAddress }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["vault-overview-autohedged-metrics", traderAddress] });
    },
  });
  const erc4626DepositMutation = useMutation({
    mutationFn: () =>
      standrApi.erc4626Deposit({
        wallet_address: traderAddress,
        assets: parseNumber(erc4626Assets, 0),
      }),
  });
  const erc4626MintMutation = useMutation({
    mutationFn: () =>
      standrApi.erc4626Mint({
        wallet_address: traderAddress,
        shares: parseNumber(erc4626Shares, 0),
      }),
  });
  const erc4626WithdrawMutation = useMutation({
    mutationFn: () =>
      standrApi.erc4626Withdraw({
        wallet_address: traderAddress,
        assets: parseNumber(erc4626Assets, 0),
      }),
  });
  const erc4626RedeemMutation = useMutation({
    mutationFn: () =>
      standrApi.erc4626Redeem({
        wallet_address: traderAddress,
        shares: parseNumber(erc4626Shares, 0),
      }),
  });

  const currentMode = vaultModeQuery.data?.mode ?? "balanced";

  return (
    <PageFrame
      title="Vault Overview"
      description="Standard vault actions plus advanced yield mode, cross-chain optimization, and auto-hedged/4626 modules."
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <article className={`${sectionCardClass} p-4`}>
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Combined Vault Balance</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{balanceQuery.data?.balance ?? "0"}</p>
          <p className="mt-1 text-xs text-muted">Sum of your vault positions</p>
        </article>
        <article className={`${sectionCardClass} p-4`}>
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Active Vaults</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{vaultsQuery.data?.length ?? 0}</p>
          <p className="mt-1 text-xs text-muted">Currently available vault types</p>
        </article>
        <article className={`${sectionCardClass} p-4`}>
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Active Strategy</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{selectedVaultStrategy ?? "Not selected"}</p>
          <p className="mt-1 text-xs text-muted">From your trading collateral preferences</p>
        </article>
        <article className={`${sectionCardClass} p-4`}>
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Pending Rewards</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{totalPendingRewards.toFixed(4)}</p>
          <p className="mt-1 text-xs text-muted">Across all reward tokens</p>
        </article>
        <article className={`${sectionCardClass} p-4`}>
          <p className="text-xs uppercase tracking-[0.16em] text-muted">On-Chain APY</p>
          <p className="mt-2 text-2xl font-semibold text-ink">
            {yieldOnChain.currentAPY !== undefined
              ? `${(Number(formatUnits(yieldOnChain.currentAPY, 2))).toFixed(2)}%`
              : "..."}
          </p>
          <p className="mt-1 text-xs text-muted">
            {yieldOnChain.vaults ? `${yieldOnChain.vaults.length} on-chain vaults` : "From YieldAggregator contract"}
          </p>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.35fr_1fr]">
        <article className={`${sectionCardClass} p-5`}>
          <h2 className="text-lg font-semibold">Vault Strategies & Analytics</h2>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {strategyList.map((strategy) => (
              <span
                key={strategy}
                className="rounded-full border border-line bg-[#0b1018]/90 px-3 py-1 font-semibold text-muted"
              >
                {strategy}
              </span>
            ))}
            {strategyList.length === 0 ? <span className="text-muted">No strategies loaded yet.</span> : null}
          </div>

          <h3 className="mt-6 text-sm uppercase tracking-[0.14em] text-muted">APY History (14 days)</h3>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {(apyHistoryQuery.data ?? []).slice(-6).map((point) => (
              <li key={point.timestamp} className="rounded-xl border border-line bg-[#0b1018]/90 px-3 py-2 text-xs text-muted">
                <p>{new Date(point.timestamp * 1000).toLocaleDateString()}</p>
                <p className="font-semibold text-ink">{(point.apy_bps / 100).toFixed(2)}%</p>
              </li>
            ))}
          </ul>

          <h3 className="mt-6 text-sm uppercase tracking-[0.14em] text-muted">Yield Source Distribution</h3>
          <ul className="mt-3 space-y-2">
            {(sourceDistributionQuery.data ?? []).map((source) => (
              <li key={source.source} className="rounded-xl border border-line bg-[#0b1018]/90 px-3 py-2 text-sm text-muted">
                {source.source}: {(source.weight_bps / 100).toFixed(2)}%
              </li>
            ))}
          </ul>

          <h3 className="mt-6 text-sm uppercase tracking-[0.14em] text-muted">Auto-Hedged LP Snapshot</h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <div className="rounded-xl border border-line bg-[#0b1018]/90 px-3 py-2 text-xs text-muted">
              <p>Total LP Value</p>
              <p className="text-ink">{autoHedgedMetricsQuery.data?.total_lp_value ?? 0}</p>
            </div>
            <div className="rounded-xl border border-line bg-[#0b1018]/90 px-3 py-2 text-xs text-muted">
              <p>Net Delta (bps)</p>
              <p className="text-ink">{autoHedgedMetricsQuery.data?.net_delta_bps ?? 0}</p>
            </div>
            <div className="rounded-xl border border-line bg-[#0b1018]/90 px-3 py-2 text-xs text-muted">
              <p>Fees 24h</p>
              <p className="text-ink">{autoHedgedMetricsQuery.data?.lp_fees_24h ?? 0}</p>
            </div>
            <div className="rounded-xl border border-line bg-[#0b1018]/90 px-3 py-2 text-xs text-muted">
              <p>User Shares</p>
              <p className="text-ink">{autoHedgedUserQuery.data?.shares ?? 0}</p>
            </div>
          </div>
        </article>

        <article className={`${sectionCardClass} p-5`}>
          <h2 className="text-lg font-semibold">Vault Actions</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveAction((prev) => (prev === "deposit" ? null : "deposit"))}
              className="rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20"
            >
              Deposit
            </button>
            <button
              type="button"
              onClick={() => setActiveAction((prev) => (prev === "withdraw" ? null : "withdraw"))}
              className="rounded-xl border border-line bg-[#0b1018] px-4 py-2 text-sm font-semibold text-ink"
            >
              Withdraw
            </button>
          </div>

          {activeAction === "deposit" ? (
            <div className="mt-4 rounded-xl border border-line bg-[#0b1018]/90 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-muted">Deposit Action</p>
              <label className="mt-3 block text-sm text-muted">
                Vault Type
                <select
                  value={selectedVault?.vault_address ?? ""}
                  onChange={(event) => setSelectedVaultAddress(event.target.value)}
                  className={inputClass}
                >
                  {(vaultsQuery.data ?? []).map((vault) => (
                    <option key={vault.vault_address} value={vault.vault_address}>
                      {vault.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="mt-3 block text-sm text-muted">
                Amount to Deposit
                <input
                  value={depositAmount}
                  onChange={(event) => setDepositAmount(event.target.value)}
                  className={inputClass}
                />
              </label>
              <p className="mt-3 text-xs text-muted">Risk score: {selectedVault?.risk_tier ?? "-"}</p>
              <p className="text-xs text-muted">
                APY: {(selectedVault?.apy_bps ?? apyQuery.data?.apy_bps ?? 0) / 100}%
              </p>
              <button
                type="button"
                onClick={() => depositMutation.mutate()}
                disabled={depositMutation.isPending}
                className="mt-4 rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20 disabled:opacity-60"
              >
                {depositMutation.isPending ? "Depositing..." : "Deposit"}
              </button>
            </div>
          ) : null}

          {activeAction === "withdraw" ? (
            <div className="mt-4 rounded-xl border border-line bg-[#0b1018]/90 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-muted">Withdraw Action</p>
              <label className="mt-3 block text-sm text-muted">
                Shares to Withdraw
                <input
                  value={withdrawShares}
                  onChange={(event) => setWithdrawShares(event.target.value)}
                  className={inputClass}
                />
              </label>
              <button
                type="button"
                onClick={() => withdrawMutation.mutate()}
                disabled={withdrawMutation.isPending}
                className="mt-4 rounded-xl border border-line bg-[#0b1018] px-4 py-2 text-sm font-semibold text-ink disabled:opacity-60"
              >
                {withdrawMutation.isPending ? "Withdrawing..." : "Withdraw"}
              </button>
            </div>
          ) : null}

          <div className="mt-5 rounded-xl border border-line bg-[#0b1018]/90 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-muted">Enhanced Yield Mode</p>
            <WiringBadges binding={wiring("yield_enhanced.setVaultMode")} executionMode={wiringMode} />
            <p className="mt-1 text-xs text-muted">Current mode: {currentMode}</p>
            <label className="mt-2 block text-sm text-muted">
              Set mode
              <select value={vaultMode} onChange={(event) => setVaultMode(event.target.value)} className={inputClass}>
                <option value="conservative">conservative</option>
                <option value="balanced">balanced</option>
                <option value="aggressive">aggressive</option>
              </select>
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setModeMutation.mutate()}
                className="rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-3 py-2 text-xs font-semibold text-cyan-100"
              >
                Set Mode
              </button>
              <button
                type="button"
                onClick={() => depositWithModeMutation.mutate()}
                className="rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-xs font-semibold text-ink"
              >
                Deposit With Mode
              </button>
            </div>
            <WiringBadges binding={wiring("yield_enhanced.depositWithMode")} executionMode={wiringMode} />
            {depositWithModeMutation.data ? (
              <p className="mt-2 text-xs text-muted">
                Route {depositWithModeMutation.data.route} | Shares {depositWithModeMutation.data.shares.toFixed(4)}
              </p>
            ) : null}
          </div>

          <div className="mt-4 rounded-xl border border-line bg-[#0b1018]/90 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-muted">Cross-Chain Optimization</p>
            <WiringBadges binding={wiring("yield_enhanced.optimizeCrossChain")} executionMode={wiringMode} />
            <label className="mt-2 block text-sm text-muted">
              Amount
              <input value={optimizeAmount} onChange={(event) => setOptimizeAmount(event.target.value)} className={inputClass} />
            </label>
            <label className="mt-2 block text-sm text-muted">
              Source Chain ID
              <input value={optimizeChainId} onChange={(event) => setOptimizeChainId(event.target.value)} className={inputClass} />
            </label>
            <button
              type="button"
              onClick={() => optimizeMutation.mutate()}
              className="mt-2 rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-xs font-semibold text-ink"
            >
              Optimize
            </button>
            {optimizeMutation.data ? (
              <p className="mt-2 text-xs text-muted">
                Suggested chain {optimizeMutation.data.destination_chain_id} | Net gain {optimizeMutation.data.estimated_net_gain_bps} bps
              </p>
            ) : null}
          </div>

          <div className="mt-4 rounded-xl border border-line bg-[#0b1018]/90 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-muted">Leverage Lending</p>
            <WiringBadges binding={wiring("yield_enhanced.executeLeverageLending")} executionMode={wiringMode} />
            <label className="mt-2 block text-sm text-muted">
              Collateral Amount
              <input
                value={leverageCollateralAmount}
                onChange={(event) => setLeverageCollateralAmount(event.target.value)}
                className={inputClass}
              />
            </label>
            <label className="mt-2 block text-sm text-muted">
              Recursion Level
              <input
                value={leverageRecursionLevel}
                onChange={(event) => setLeverageRecursionLevel(event.target.value)}
                className={inputClass}
              />
            </label>
            <button
              type="button"
              onClick={() => leverageLendingMutation.mutate()}
              className="mt-2 rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-xs font-semibold text-ink"
            >
              Execute Leverage Lending
            </button>
            {leverageLendingMutation.data ? (
              <p className="mt-2 text-xs text-muted">
                Effective APY {leverageLendingMutation.data.effective_apy_bps} bps | Borrowed{" "}
                {leverageLendingMutation.data.borrowed_amount}
              </p>
            ) : null}
          </div>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <article className={`${sectionCardClass} p-5`}>
          <h2 className="text-lg font-semibold">Auto-Hedged LP Vault</h2>
          <WiringBadges binding={wiring("auto_hedged.deposit")} executionMode={wiringMode} />
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <label className="text-sm text-muted">
              Amount0
              <input value={autoHedgeAmount0} onChange={(event) => setAutoHedgeAmount0(event.target.value)} className={inputClass} />
            </label>
            <label className="text-sm text-muted">
              Amount1
              <input value={autoHedgeAmount1} onChange={(event) => setAutoHedgeAmount1(event.target.value)} className={inputClass} />
            </label>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => autoHedgedDepositMutation.mutate()}
              className="rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-3 py-2 text-xs font-semibold text-cyan-100"
            >
              Deposit LP
            </button>
            <button
              type="button"
              onClick={() => autoHedgedRebalanceMutation.mutate()}
              className="rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-xs font-semibold text-ink"
            >
              Rebalance
            </button>
            <button
              type="button"
              onClick={() => autoHedgedFeesMutation.mutate()}
              className="rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-xs font-semibold text-ink"
            >
              Collect Fees
            </button>
          </div>
          <div className="mt-3 rounded-xl border border-line bg-[#0b1018]/70 p-3">
            <WiringBadges binding={wiring("auto_hedged.withdraw")} executionMode={wiringMode} />
            <label className="mt-2 block text-sm text-muted">
              Shares to Withdraw
              <input
                value={autoHedgeWithdrawShares}
                onChange={(event) => setAutoHedgeWithdrawShares(event.target.value)}
                className={inputClass}
              />
            </label>
            <button
              type="button"
              onClick={() => autoHedgedWithdrawMutation.mutate()}
              className="mt-2 rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-xs font-semibold text-ink"
            >
              Withdraw LP
            </button>
          </div>
          <div className="mt-3 rounded-xl border border-line bg-[#0b1018]/70 p-3">
            <WiringBadges binding={wiring("auto_hedged.getPositionInfo")} executionMode={wiringMode} />
            <button
              type="button"
              onClick={() => autoHedgedPositionQuery.refetch()}
              className="rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-xs font-semibold text-ink"
            >
              Refresh Position Info
            </button>
            {autoHedgedPositionQuery.data ? (
              <p className="mt-2 text-xs text-muted">
                Token #{autoHedgedPositionQuery.data.token_id} | Delta{" "}
                {autoHedgedPositionQuery.data.current_delta_bps} bps
              </p>
            ) : null}
          </div>
          {autoHedgedDepositMutation.data ? (
            <p className="mt-2 text-xs text-muted">LP tx: {autoHedgedDepositMutation.data.tx_ref}</p>
          ) : null}
        </article>

        <article className={`${sectionCardClass} p-5`}>
          <h2 className="text-lg font-semibold">Secure ERC4626 Vault</h2>
          <WiringBadges binding={wiring("erc4626.deposit")} executionMode={wiringMode} />
          <label className="mt-3 block text-sm text-muted">
            Assets
            <input value={erc4626Assets} onChange={(event) => setErc4626Assets(event.target.value)} className={inputClass} />
          </label>
          <label className="mt-2 block text-sm text-muted">
            Shares
            <input value={erc4626Shares} onChange={(event) => setErc4626Shares(event.target.value)} className={inputClass} />
          </label>
          <p className="mt-2 text-xs text-muted">
            Preview shares: {erc4626PreviewQuery.data?.shares?.toFixed(6) ?? "0"}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => erc4626DepositMutation.mutate()}
              className="rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-3 py-2 text-xs font-semibold text-cyan-100"
            >
              Deposit ERC4626
            </button>
            <button
              type="button"
              onClick={() => erc4626MintMutation.mutate()}
              className="rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-xs font-semibold text-ink"
            >
              Mint ERC4626
            </button>
            <button
              type="button"
              onClick={() => erc4626WithdrawMutation.mutate()}
              className="rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-xs font-semibold text-ink"
            >
              Withdraw ERC4626
            </button>
            <button
              type="button"
              onClick={() => erc4626RedeemMutation.mutate()}
              className="rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-xs font-semibold text-ink"
            >
              Redeem ERC4626
            </button>
          </div>
          <WiringBadges binding={wiring("erc4626.mint")} executionMode={wiringMode} />
          <WiringBadges binding={wiring("erc4626.withdraw")} executionMode={wiringMode} />
          <WiringBadges binding={wiring("erc4626.redeem")} executionMode={wiringMode} />
          {erc4626DepositMutation.data ? (
            <p className="mt-2 text-xs text-muted">
              Status {erc4626DepositMutation.data.status} | Shares {erc4626DepositMutation.data.shares.toFixed(6)}
            </p>
          ) : null}
          {erc4626MintMutation.data ? (
            <p className="mt-1 text-xs text-muted">
              Mint status {erc4626MintMutation.data.status} | Assets {erc4626MintMutation.data.assets.toFixed(6)}
            </p>
          ) : null}
          {erc4626WithdrawMutation.data ? (
            <p className="mt-1 text-xs text-muted">
              Withdraw status {erc4626WithdrawMutation.data.status} | Shares {erc4626WithdrawMutation.data.shares.toFixed(6)}
            </p>
          ) : null}
          {erc4626RedeemMutation.data ? (
            <p className="mt-1 text-xs text-muted">
              Redeem status {erc4626RedeemMutation.data.status} | Assets {erc4626RedeemMutation.data.assets.toFixed(6)}
            </p>
          ) : null}

          <div className="mt-5 grid gap-2">
            <Link
              href="/liquidity/pools"
              className="rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-sm font-semibold text-ink transition hover:border-cyan-300/35"
            >
              Open Liquidity
            </Link>
            <Link
              href="/vaults/strategy"
              className="rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-sm font-semibold text-ink transition hover:border-cyan-300/35"
            >
              Strategy Details
            </Link>
            <Link
              href="/vaults/rewards"
              className="rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-sm font-semibold text-ink transition hover:border-cyan-300/35"
            >
              Rewards Details
            </Link>
          </div>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <article className={`${sectionCardClass} p-5`}>
          <h2 className="text-lg font-semibold">Yield Token Operations</h2>
          <div className="mt-3 rounded-xl border border-line bg-[#0b1018]/90 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-muted">Swap Exact In</p>
            <WiringBadges binding={wiring("yield.swapExactIn")} executionMode={wiringMode} />
            <label className="mt-2 block text-sm text-muted">
              Token In
              <input value={swapTokenIn} onChange={(event) => setSwapTokenIn(event.target.value)} className={inputClass} />
            </label>
            <label className="mt-2 block text-sm text-muted">
              Token Out
              <input value={swapTokenOut} onChange={(event) => setSwapTokenOut(event.target.value)} className={inputClass} />
            </label>
            <label className="mt-2 block text-sm text-muted">
              Amount In
              <input value={swapAmountIn} onChange={(event) => setSwapAmountIn(event.target.value)} className={inputClass} />
            </label>
            <button
              type="button"
              onClick={() => swapExactInMutation.mutate()}
              className="mt-2 rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-xs font-semibold text-ink"
            >
              Execute Swap
            </button>
            {swapExactInMutation.data ? (
              <p className="mt-2 text-xs text-muted">
                Route {swapExactInMutation.data.route} | Amount out {swapExactInMutation.data.amount_out}
              </p>
            ) : null}
          </div>

          <div className="mt-3 rounded-xl border border-line bg-[#0b1018]/90 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-muted">Wrap / Unwrap</p>
            <WiringBadges binding={wiring("yield.wrapToken")} executionMode={wiringMode} />
            <WiringBadges binding={wiring("yield.unwrapToken")} executionMode={wiringMode} />
            <label className="mt-2 block text-sm text-muted">
              Base Token
              <input value={wrapToken} onChange={(event) => setWrapToken(event.target.value)} className={inputClass} />
            </label>
            <label className="mt-2 block text-sm text-muted">
              Wrap Amount
              <input value={wrapAmount} onChange={(event) => setWrapAmount(event.target.value)} className={inputClass} />
            </label>
            <button
              type="button"
              onClick={() => wrapMutation.mutate()}
              className="mt-2 rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-xs font-semibold text-ink"
            >
              Wrap Token
            </button>
            <label className="mt-2 block text-sm text-muted">
              Vault Token
              <input value={unwrapVaultToken} onChange={(event) => setUnwrapVaultToken(event.target.value)} className={inputClass} />
            </label>
            <label className="mt-2 block text-sm text-muted">
              Unwrap Shares
              <input value={unwrapShares} onChange={(event) => setUnwrapShares(event.target.value)} className={inputClass} />
            </label>
            <button
              type="button"
              onClick={() => unwrapMutation.mutate()}
              className="mt-2 rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-xs font-semibold text-ink"
            >
              Unwrap Token
            </button>
            {wrapMutation.data ? (
              <p className="mt-2 text-xs text-muted">
                Wrapped shares {wrapMutation.data.shares.toFixed(6)} into {wrapMutation.data.vault_token}
              </p>
            ) : null}
            {unwrapMutation.data ? (
              <p className="mt-1 text-xs text-muted">
                Unwrapped amount {unwrapMutation.data.amount.toFixed(6)} from {unwrapMutation.data.vault_token}
              </p>
            ) : null}
          </div>
        </article>

        <article className={`${sectionCardClass} p-5`}>
          <h2 className="text-lg font-semibold">Share Value Lookup</h2>
          <WiringBadges binding={wiring("yield.getShareValue")} executionMode={wiringMode} />
          <label className="mt-3 block text-sm text-muted">
            Base Token
            <input value={shareValueToken} onChange={(event) => setShareValueToken(event.target.value)} className={inputClass} />
          </label>
          <label className="mt-2 block text-sm text-muted">
            Shares
            <input value={shareValueShares} onChange={(event) => setShareValueShares(event.target.value)} className={inputClass} />
          </label>
          <button
            type="button"
            onClick={() => shareValueMutation.mutate()}
            className="mt-3 rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-3 py-2 text-xs font-semibold text-cyan-100"
          >
            Get Share Value
          </button>
          {shareValueMutation.data ? (
            <p className="mt-2 text-xs text-muted">Share value: {shareValueMutation.data.value.toFixed(6)}</p>
          ) : null}
        </article>
      </section>
    </PageFrame>
  );
}
