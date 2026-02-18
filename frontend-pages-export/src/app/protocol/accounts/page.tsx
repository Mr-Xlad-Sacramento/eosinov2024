"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { PageFrame } from "@/components/page-frame";
import { WiringBadges } from "@/components/wiring-badges";
import { protocolApi } from "@/components/protocol/api";
import { standrApi } from "@/lib/api/standr";
import { PolicyPortableSnapshotDto } from "@/lib/types/domain";
import { useTraderAddress } from "@/lib/hooks/use-trader-address";

type HistoryRow = {
  id: string;
  status: string;
  type: "Swap" | "Limit" | "DCA" | "Multi" | "Perps";
  amountLabel: string;
  gasless: boolean;
  batched: boolean;
};

function normalizeStatus(status: string): string {
  return status.trim().toUpperCase();
}

function isPartialStatus(status: string): boolean {
  return normalizeStatus(status).includes("PARTIAL");
}

function isFilledStatus(status: string): boolean {
  const normalized = normalizeStatus(status);
  return (
    normalized.includes("EXECUT") ||
    normalized.includes("FILL") ||
    normalized.includes("SUCCESS") ||
    normalized.includes("COMPLETE") ||
    normalized.includes("CLOSE")
  );
}

function isFailedStatus(status: string): boolean {
  const normalized = normalizeStatus(status);
  return (
    normalized.includes("FAIL") ||
    normalized.includes("REJECT") ||
    normalized.includes("REVERT") ||
    normalized.includes("EXPIRE")
  );
}

function parsePositiveNumber(input: string): number | null {
  const parsed = Number(input);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
}

export default function ProtocolAccountsPage() {
  const { traderAddress } = useTraderAddress();
  const queryClient = useQueryClient();
  const [tierOverride, setTierOverride] = useState("");
  const [maxSlippagePct, setMaxSlippagePct] = useState("");
  const [dailyLimitUsd, setDailyLimitUsd] = useState("");
  const [settingsFeedback, setSettingsFeedback] = useState<string | null>(null);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [stakeAmount, setStakeAmount] = useState("25000");
  const [subscriptionAmount, setSubscriptionAmount] = useState("100");
  const [subscriptionToken, setSubscriptionToken] = useState("USDC");
  const [sessionTtl, setSessionTtl] = useState("3600");
  const [sessionToExtend, setSessionToExtend] = useState("");
  const [sessionToRevoke, setSessionToRevoke] = useState("");
  const [newSessionAddress, setNewSessionAddress] = useState(
    "0x0000000000000000000000000000000000001100",
  );
  const [newSessionPermissions, setNewSessionPermissions] = useState("swap,intent");
  const [intentAccountAddress, setIntentAccountAddress] = useState("");
  const [batchOwners, setBatchOwners] = useState(
    "0x0000000000000000000000000000000000001010;0x0000000000000000000000000000000000002020",
  );
  const [intentAccountLookup, setIntentAccountLookup] = useState("");
  const [policyWindowStart, setPolicyWindowStart] = useState("0");
  const [policyWindowEnd, setPolicyWindowEnd] = useState("23");
  const [policyAppAddress, setPolicyAppAddress] = useState(
    "0x0000000000000000000000000000000000002200",
  );
  const [policyAppAllowed, setPolicyAppAllowed] = useState(true);
  const [policyAppLimit, setPolicyAppLimit] = useState("10000");
  const [emergencyPaused, setEmergencyPaused] = useState(false);
  const [sessionManagerAddress, setSessionManagerAddress] = useState(
    "0x0000000000000000000000000000000000001001",
  );
  const [intentTradingAddress, setIntentTradingAddress] = useState(
    "0x0000000000000000000000000000000000001002",
  );
  const [intentAmountIn, setIntentAmountIn] = useState("1000000");
  const [intentMinAmountOut, setIntentMinAmountOut] = useState("990000");
  const [batchSecondAmountIn, setBatchSecondAmountIn] = useState("500000");
  const [batchSecondMinOut, setBatchSecondMinOut] = useState("490000");
  const [intentTokenIn, setIntentTokenIn] = useState("0x0000000000000000000000000000000000000001");
  const [intentTokenOut, setIntentTokenOut] = useState("0x0000000000000000000000000000000000000002");
  const [importJson, setImportJson] = useState("");
  const [exportFeedback, setExportFeedback] = useState<string | null>(null);
  const [importFeedback, setImportFeedback] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const walletQuery = useQuery({
    queryKey: ["protocol-account-wallet", traderAddress],
    queryFn: () => protocolApi.getWallet(traderAddress),
  });
  const tieringQuery = useQuery({
    queryKey: ["protocol-account-tiering", traderAddress],
    queryFn: () => protocolApi.getTiering(traderAddress),
  });
  const policyQuery = useQuery({
    queryKey: ["protocol-account-policy", traderAddress],
    queryFn: () => protocolApi.getPolicy(traderAddress),
  });
  const capabilitiesQuery = useQuery({
    queryKey: ["protocol-account-capabilities", traderAddress],
    queryFn: () => protocolApi.getCapabilities(traderAddress),
  });
  const policyManagerQuery = useQuery({
    queryKey: ["protocol-account-policy-manager", traderAddress],
    queryFn: () => protocolApi.getPolicyManager(traderAddress),
  });
  const sessionKeysQuery = useQuery({
    queryKey: ["protocol-account-session-keys", traderAddress],
    queryFn: () => protocolApi.listSessionKeys(traderAddress),
  });
  const predictedIntentAccountQuery = useQuery({
    queryKey: ["protocol-account-predict-intent", traderAddress],
    queryFn: () => protocolApi.predictIntentAccountAddress(traderAddress),
  });
  const wiringQuery = useQuery({
    queryKey: ["wiring-report"],
    queryFn: standrApi.getWiringReport,
  });

  const intentsQuery = useQuery({
    queryKey: ["protocol-account-intents", traderAddress],
    queryFn: () => standrApi.getIntents(traderAddress),
  });
  const advancedOrdersQuery = useQuery({
    queryKey: ["protocol-account-advanced-orders", traderAddress],
    queryFn: () => standrApi.getAdvancedTradingOrdersForTrader(traderAddress),
  });
  const perpsPositionsQuery = useQuery({
    queryKey: ["protocol-account-perps", traderAddress],
    queryFn: () => standrApi.getPositions(traderAddress),
  });

  const saveSettingsMutation = useMutation({
    mutationFn: async (payload: {
      tier: number;
      maxSlippageBps: number;
      dailyNotionalLimitUsd: number;
      allowedModes: string[];
    }) => {
      const [tiering, policy] = await Promise.all([
        protocolApi.updateTiering({
          wallet_address: traderAddress,
          tier: payload.tier,
        }),
        protocolApi.updatePolicy({
          wallet_address: traderAddress,
          max_slippage_bps: payload.maxSlippageBps,
          daily_notional_limit_usd: payload.dailyNotionalLimitUsd,
          allowed_modes: payload.allowedModes,
        }),
      ]);
      return { tiering, policy };
    },
    onSuccess: async (result) => {
      setTierOverride(String(result.tiering.tier));
      setMaxSlippagePct((result.policy.max_slippage_bps / 100).toFixed(2));
      setDailyLimitUsd(String(result.policy.daily_notional_limit_usd));
      setSettingsError(null);
      setSettingsFeedback("Policy settings saved to backend.");
      await queryClient.invalidateQueries({ queryKey: ["protocol-account-tiering", traderAddress] });
      await queryClient.invalidateQueries({ queryKey: ["protocol-account-policy", traderAddress] });
      await queryClient.invalidateQueries({ queryKey: ["protocol-account-capabilities", traderAddress] });
    },
    onError: (mutationError) => {
      setSettingsFeedback(null);
      setSettingsError(
        mutationError instanceof Error ? mutationError.message : "Failed to save account settings.",
      );
    },
  });

  const stakeMutation = useMutation({
    mutationFn: () =>
      protocolApi.stakeForTier({
        wallet_address: traderAddress,
        amount_standr: Number(stakeAmount) || 0,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["protocol-account-tiering", traderAddress] });
      await queryClient.invalidateQueries({ queryKey: ["protocol-account-capabilities", traderAddress] });
    },
  });
  const unstakeMutation = useMutation({
    mutationFn: () =>
      protocolApi.unstakeForTier({
        wallet_address: traderAddress,
        amount_standr: Number(stakeAmount) || 0,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["protocol-account-tiering", traderAddress] });
      await queryClient.invalidateQueries({ queryKey: ["protocol-account-capabilities", traderAddress] });
    },
  });
  const subscriptionMutation = useMutation({
    mutationFn: () =>
      protocolApi.paySubscription({
        wallet_address: traderAddress,
        payment_token: subscriptionToken,
        amount: Number(subscriptionAmount) || 0,
        duration_days: 30,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["protocol-account-tiering", traderAddress] });
      await queryClient.invalidateQueries({ queryKey: ["protocol-account-capabilities", traderAddress] });
    },
  });
  const quickSessionMutation = useMutation({
    mutationFn: () =>
      protocolApi.createQuickSession({
        wallet_address: traderAddress,
        permissions: ["swap", "limit", "intent"],
        ttl_seconds: Number(sessionTtl) || 3600,
        app: "standr-bot",
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["protocol-account-session-keys", traderAddress] });
    },
  });
  const extendSessionMutation = useMutation({
    mutationFn: () =>
      protocolApi.extendSessionKey({
        wallet_address: traderAddress,
        session_key: sessionToExtend,
        additional_ttl_seconds: Number(sessionTtl) || 3600,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["protocol-account-session-keys", traderAddress] });
    },
  });
  const createSessionKeyMutation = useMutation({
    mutationFn: () =>
      protocolApi.createSessionKey({
        wallet_address: traderAddress,
        permissions: newSessionPermissions
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean),
        ttl_seconds: Number(sessionTtl) || 3600,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["protocol-account-session-keys", traderAddress] });
    },
  });
  const revokeSessionKeyMutation = useMutation({
    mutationFn: () =>
      protocolApi.revokeSessionKey({
        wallet_address: traderAddress,
        session_key: sessionToRevoke,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["protocol-account-session-keys", traderAddress] });
    },
  });
  const createPolicyManagerMutation = useMutation({
    mutationFn: () => protocolApi.createPolicyManager({ wallet_address: traderAddress }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["protocol-account-policy-manager", traderAddress] });
    },
  });
  const setPolicyTimeWindowMutation = useMutation({
    mutationFn: () =>
      protocolApi.setPolicyTimeWindow({
        wallet_address: traderAddress,
        start_hour: Number(policyWindowStart) || 0,
        end_hour: Number(policyWindowEnd) || 23,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["protocol-account-policy-manager", traderAddress] });
    },
  });
  const setPolicyAppPermissionMutation = useMutation({
    mutationFn: () =>
      protocolApi.setPolicyAppPermission({
        wallet_address: traderAddress,
        app: policyAppAddress,
        allowed: policyAppAllowed,
        max_notional_usd: Number(policyAppLimit) || 0,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["protocol-account-policy-manager", traderAddress] });
    },
  });
  const setPolicyEmergencyPauseMutation = useMutation({
    mutationFn: () =>
      protocolApi.setPolicyEmergencyPause({
        wallet_address: traderAddress,
        paused: emergencyPaused,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["protocol-account-policy-manager", traderAddress] });
    },
  });
  const exportPolicyMutation = useMutation({
    mutationFn: () =>
      standrApi.exportPolicy({
        wallet_address: traderAddress,
        include_controls: true,
      }),
    onSuccess: (snapshot) => {
      setImportJson(JSON.stringify(snapshot, null, 2));
      setExportFeedback(
        `Policy snapshot exported at ${new Date(snapshot.exported_at * 1000).toLocaleString()}.`,
      );
      setImportError(null);
    },
    onError: (mutationError) => {
      setExportFeedback(
        mutationError instanceof Error ? mutationError.message : "Policy export failed.",
      );
    },
  });
  const importPolicyMutation = useMutation({
    mutationFn: async () => {
      let parsedSnapshot: PolicyPortableSnapshotDto;
      try {
        parsedSnapshot = JSON.parse(importJson) as PolicyPortableSnapshotDto;
      } catch (parseError) {
        throw new Error(
          parseError instanceof Error ? parseError.message : "Invalid JSON payload",
        );
      }

      return standrApi.importPolicy({
        wallet_address: traderAddress,
        snapshot: parsedSnapshot,
        merge_controls: true,
      });
    },
    onSuccess: async (result) => {
      setImportFeedback(
        `Policy imported from ${result.source_mode} at ${new Date(
          result.imported_at * 1000,
        ).toLocaleString()}.`,
      );
      setImportError(null);
      await queryClient.invalidateQueries({ queryKey: ["protocol-account-policy", traderAddress] });
      await queryClient.invalidateQueries({
        queryKey: ["protocol-account-policy-manager", traderAddress],
      });
      await queryClient.invalidateQueries({
        queryKey: ["protocol-account-capabilities", traderAddress],
      });
    },
    onError: (mutationError) => {
      setImportFeedback(null);
      setImportError(
        mutationError instanceof Error ? mutationError.message : "Policy import failed.",
      );
    },
  });
  const deployIntentAccountMutation = useMutation({
    mutationFn: () => protocolApi.deployIntentAccount({ owner: traderAddress }),
    onSuccess: (result) => setIntentAccountAddress(result.intent_account),
  });
  const batchDeployIntentAccountsMutation = useMutation({
    mutationFn: () =>
      protocolApi.batchDeployIntentAccounts({
        owners: batchOwners
          .split(";")
          .map((value) => value.trim())
          .filter(Boolean),
      }),
  });
  const getIntentOwnerMutation = useMutation({
    mutationFn: () => protocolApi.getIntentAccountOwner(intentAccountLookup),
  });
  const setSessionManagerMutation = useMutation({
    mutationFn: () =>
      protocolApi.setIntentSessionKeyManager({
        owner: traderAddress,
        intent_account:
          intentAccountAddress || predictedIntentAccountQuery.data?.predicted_intent_account || "",
        session_key_manager: sessionManagerAddress,
      }),
  });
  const setIntentTradingMutation = useMutation({
    mutationFn: () =>
      protocolApi.setIntentTradingContract({
        owner: traderAddress,
        intent_account:
          intentAccountAddress || predictedIntentAccountQuery.data?.predicted_intent_account || "",
        intent_trading_contract: intentTradingAddress,
      }),
  });
  const executeSwapDirectMutation = useMutation({
    mutationFn: () =>
      protocolApi.executeSwapDirect({
        owner: traderAddress,
        intent_account:
          intentAccountAddress || predictedIntentAccountQuery.data?.predicted_intent_account || "",
        token_in: intentTokenIn,
        token_out: intentTokenOut,
        amount_in: intentAmountIn,
        min_amount_out: intentMinAmountOut,
      }),
  });
  const executeIntentMutation = useMutation({
    mutationFn: () =>
      protocolApi.executeIntent({
        owner: traderAddress,
        intent_account:
          intentAccountAddress || predictedIntentAccountQuery.data?.predicted_intent_account || "",
        token_in: intentTokenIn,
        token_out: intentTokenOut,
        amount_in: intentAmountIn,
        min_amount_out: intentMinAmountOut,
        deadline_unix: Math.floor(Date.now() / 1000) + 3600,
      }),
  });
  const executeBatchIntentMutation = useMutation({
    mutationFn: () =>
      protocolApi.executeBatchIntent({
        owner: traderAddress,
        intent_account:
          intentAccountAddress || predictedIntentAccountQuery.data?.predicted_intent_account || "",
        intents: [
          {
            token_in: intentTokenIn,
            token_out: intentTokenOut,
            amount_in: intentAmountIn,
            min_amount_out: intentMinAmountOut,
            deadline_unix: Math.floor(Date.now() / 1000) + 3600,
          },
          {
            token_in: intentTokenIn,
            token_out: intentTokenOut,
            amount_in: batchSecondAmountIn,
            min_amount_out: batchSecondMinOut,
            deadline_unix: Math.floor(Date.now() / 1000) + 3600,
          },
        ],
      }),
  });

  const historyRows = useMemo<HistoryRow[]>(() => {
    const intents = intentsQuery.data ?? [];
    const advancedOrders = advancedOrdersQuery.data?.orders ?? [];
    const positions = perpsPositionsQuery.data ?? [];
    const gaslessBudget = walletQuery.data?.gas_sponsored_count ?? 0;
    const batchedBudget = walletQuery.data?.batch_intent_count ?? 0;
    const swapRows: HistoryRow[] = intents.map((intent, index) => {
      const gasless = index < gaslessBudget;
      const batched = index < batchedBudget;
      return {
        id: intent.intent_id,
        status: intent.status,
        type: "Swap",
        amountLabel: intent.amount_in,
        gasless,
        batched,
      };
    });

    const advancedRows: HistoryRow[] = advancedOrders.map((order) => ({
      id: order.order_id,
      status: order.status,
      type: order.mode === "limit" ? "Limit" : order.mode === "dca" ? "DCA" : "Multi",
      amountLabel:
        typeof order.payload.amount_in === "string"
          ? order.payload.amount_in
          : typeof order.payload.amount_per_order === "string"
            ? order.payload.amount_per_order
            : "n/a",
      gasless: false,
      batched: false,
    }));

    const perpsRows: HistoryRow[] = positions.map((position) => ({
      id: position.position_id,
      status: position.status,
      type: "Perps",
      amountLabel: position.position_size,
      gasless: false,
      batched: false,
    }));

    return [...swapRows, ...advancedRows, ...perpsRows];
  }, [
    advancedOrdersQuery.data?.orders,
    intentsQuery.data,
    perpsPositionsQuery.data,
    walletQuery.data?.batch_intent_count,
    walletQuery.data?.gas_sponsored_count,
  ]);

  const metrics = useMemo(() => {
    const initiated = historyRows.length;
    const partial = historyRows.filter((row) => isPartialStatus(row.status)).length;
    const filled = historyRows.filter((row) => isFilledStatus(row.status)).length;
    const failed = historyRows.filter((row) => isFailedStatus(row.status)).length;
    const gasless = walletQuery.data?.gas_sponsored_count ?? historyRows.filter((row) => row.gasless).length;
    const batched = walletQuery.data?.batch_intent_count ?? historyRows.filter((row) => row.batched).length;
    const byType = {
      Swap: historyRows.filter((row) => row.type === "Swap").length,
      Limit: historyRows.filter((row) => row.type === "Limit").length,
      DCA: historyRows.filter((row) => row.type === "DCA").length,
      Multi: historyRows.filter((row) => row.type === "Multi").length,
      Perps: historyRows.filter((row) => row.type === "Perps").length,
    };
    return {
      initiated,
      partial,
      filled,
      failed,
      gasless,
      batched,
      byType,
    };
  }, [historyRows, walletQuery.data?.batch_intent_count, walletQuery.data?.gas_sponsored_count]);
  const wiringByKey = useMemo(
    () => new Map((wiringQuery.data?.bindings ?? []).map((binding) => [binding.feature_key, binding])),
    [wiringQuery.data?.bindings],
  );
  const wiringMode = wiringQuery.data?.execution_mode ?? "simulation";
  const wiring = (featureKey: string) => wiringByKey.get(featureKey) ?? null;

  const tierInputValue = tierOverride || (tieringQuery.data ? String(tieringQuery.data.tier) : "1");
  const slippageInputValue =
    maxSlippagePct || (policyQuery.data ? (policyQuery.data.max_slippage_bps / 100).toFixed(2) : "1.00");
  const dailyLimitInputValue =
    dailyLimitUsd || (policyQuery.data ? String(policyQuery.data.daily_notional_limit_usd) : "10000");

  function onSavePolicySettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSettingsFeedback(null);
    setSettingsError(null);

    const tierParsed = Number.parseInt(tierInputValue.trim(), 10);
    const slippagePctParsed = parsePositiveNumber(slippageInputValue.trim());
    const dailyLimitParsed = parsePositiveNumber(dailyLimitInputValue.trim());

    if (
      !Number.isFinite(tierParsed) ||
      tierParsed < 1 ||
      tierParsed > 3 ||
      slippagePctParsed === null ||
      dailyLimitParsed === null
    ) {
      setSettingsError("Tier, max slippage, and daily limit are required.");
      return;
    }
    const maxSlippageBps = Math.max(1, Math.round(slippagePctParsed * 100));
    const allowedModes = policyQuery.data?.allowed_modes ?? ["swap", "limit", "dca", "multi", "intent"];
    saveSettingsMutation.mutate({
      tier: tierParsed,
      maxSlippageBps,
      dailyNotionalLimitUsd: dailyLimitParsed,
      allowedModes,
    });
  }

  return (
    <PageFrame
      title="User Intent Account"
      description="Tiering, policy/session controls, intent account factory flow, and execution telemetry."
    >
      <section className="grid gap-4 lg:grid-cols-4">
        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Tier</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{tieringQuery.data?.tier ?? "-"}</p>
          <p className="mt-1 text-xs text-muted">
            Max notional ${tieringQuery.data?.max_notional_usd.toLocaleString() ?? "-"}
          </p>
        </article>
        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Order Capability</p>
          <p className="mt-2 text-2xl font-semibold text-ink">
            {capabilitiesQuery.data?.can_place_order ? "ON" : "OFF"}
          </p>
          <p className="mt-1 text-xs text-muted">Batch: {capabilitiesQuery.data?.can_place_batch ? "ON" : "OFF"}</p>
        </article>
        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Sequencer Access</p>
          <p className="mt-2 text-2xl font-semibold text-ink">
            {capabilitiesQuery.data?.has_sequencer_access ? "YES" : "NO"}
          </p>
          <p className="mt-1 text-xs text-muted">From tier/subscription gates</p>
        </article>
        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Open Session Keys</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{walletQuery.data?.open_session_keys ?? 0}</p>
          <p className="mt-1 text-xs text-muted">Delegated active keys</p>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <article className="overflow-x-auto rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017]">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <h2 className="text-lg font-semibold">Intent History</h2>
            <p className="text-xs text-muted">Account: {traderAddress}</p>
          </div>
          <table className="min-w-full text-sm">
            <thead className="border-b border-line text-left text-xs uppercase tracking-[0.12em] text-muted">
              <tr>
                <th className="px-3 py-3">Intent</th>
                <th className="px-3 py-3">Type</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Amount</th>
                <th className="px-3 py-3">Gasless</th>
                <th className="px-3 py-3">Batch</th>
              </tr>
            </thead>
            <tbody>
              {historyRows.map((row) => (
                <tr key={row.id} className="border-b border-line/60 last:border-b-0">
                  <td className="px-3 py-3 font-mono text-xs text-ink">
                    {row.id.slice(0, 10)}...{row.id.slice(-6)}
                  </td>
                  <td className="px-3 py-3 text-muted">{row.type}</td>
                  <td className="px-3 py-3 text-muted">{row.status}</td>
                  <td className="px-3 py-3 text-muted">{row.amountLabel}</td>
                  <td className="px-3 py-3 text-muted">{row.gasless ? "Yes" : "No"}</td>
                  <td className="px-3 py-3 text-muted">{row.batched ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {historyRows.length === 0 ? (
            <p className="px-4 py-4 text-sm text-muted">No intent history available yet.</p>
          ) : null}
        </article>

        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-5">
          <h2 className="text-lg font-semibold">Policy + Tier Controls</h2>
          <p className="mt-1 text-sm text-muted">Tiering and policy manager actions.</p>
          <form className="mt-4 space-y-3" onSubmit={onSavePolicySettings}>
            <label className="block space-y-1 text-sm text-muted">
              Tier
              <select
                value={tierInputValue}
                onChange={(event) => setTierOverride(event.target.value)}
                className="w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
              >
                <option value="1">Tier 1</option>
                <option value="2">Tier 2</option>
                <option value="3">Tier 3</option>
              </select>
            </label>
            <label className="block space-y-1 text-sm text-muted">
              Max Slippage %
              <input
                value={slippageInputValue}
                onChange={(event) => setMaxSlippagePct(event.target.value)}
                className="w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
              />
            </label>
            <label className="block space-y-1 text-sm text-muted">
              Daily Limit (USD)
              <input
                value={dailyLimitInputValue}
                onChange={(event) => setDailyLimitUsd(event.target.value)}
                className="w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
              />
            </label>
            <button
              type="submit"
              disabled={saveSettingsMutation.isPending}
              className="rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20"
            >
              {saveSettingsMutation.isPending ? "Saving..." : "Save settings"}
            </button>
          </form>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <input
              value={stakeAmount}
              onChange={(event) => setStakeAmount(event.target.value)}
              className="rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-sm text-ink"
              placeholder="STANDR amount"
            />
            <div className="flex gap-2">
              <button type="button" onClick={() => stakeMutation.mutate()} className="rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-xs text-ink">Stake</button>
              <button type="button" onClick={() => unstakeMutation.mutate()} className="rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-xs text-ink">Unstake</button>
            </div>
            <input
              value={subscriptionToken}
              onChange={(event) => setSubscriptionToken(event.target.value)}
              className="rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-sm text-ink"
              placeholder="Payment token"
            />
            <div className="flex gap-2">
              <input
                value={subscriptionAmount}
                onChange={(event) => setSubscriptionAmount(event.target.value)}
                className="w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-sm text-ink"
                placeholder="Amount"
              />
              <button type="button" onClick={() => subscriptionMutation.mutate()} className="rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-xs text-ink">
                Subscribe
              </button>
            </div>
          </div>
          {settingsFeedback ? <p className="mt-3 text-sm text-success">{settingsFeedback}</p> : null}
          {settingsError ? <p className="mt-3 text-sm text-danger">{settingsError}</p> : null}
          <p className="mt-3 text-xs text-muted">
            Policy manager window: {policyManagerQuery.data?.time_window_start_hour ?? 0}-
            {policyManagerQuery.data?.time_window_end_hour ?? 24}h | Emergency pause:{" "}
            {policyManagerQuery.data?.emergency_paused ? "ON" : "OFF"}
          </p>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-5">
          <h2 className="text-lg font-semibold">Session Key Manager</h2>
          <p className="mt-1 text-sm text-muted">Quick session creation and extension for delegated access.</p>
          <div className="mt-3 flex gap-2">
            <input
              value={sessionTtl}
              onChange={(event) => setSessionTtl(event.target.value)}
              className="w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-sm text-ink"
              placeholder="TTL seconds"
            />
            <button
              type="button"
              onClick={() => quickSessionMutation.mutate()}
              className="rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-3 py-2 text-xs text-cyan-100"
            >
              Quick Session
            </button>
          </div>
          {quickSessionMutation.data ? (
            <div className="mt-3 rounded-xl border border-line bg-[#0b1018]/90 p-3 text-xs text-muted">
              <p>Session: {quickSessionMutation.data.session.session_key}</p>
              <p className="break-all">Deep link: {quickSessionMutation.data.deep_link}</p>
            </div>
          ) : null}
          <div className="mt-3 flex gap-2">
            <input
              value={sessionToExtend}
              onChange={(event) => setSessionToExtend(event.target.value)}
              className="w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-sm text-ink"
              placeholder="Session key to extend"
            />
            <button
              type="button"
              onClick={() => extendSessionMutation.mutate()}
              className="rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-xs text-ink"
            >
              Extend
            </button>
          </div>
          <ul className="mt-3 space-y-1 text-xs text-muted">
            {(sessionKeysQuery.data ?? []).map((key) => (
              <li key={key.session_key} className="rounded-lg border border-line bg-[#0b1018]/90 px-2 py-1">
                {key.session_key.slice(0, 12)}... active={key.active ? "yes" : "no"}
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-5">
          <h2 className="text-lg font-semibold">Intent Account Factory</h2>
          <p className="mt-1 text-sm text-muted">Deploy/predict account and set managers for direct execution.</p>
          <button
            type="button"
            onClick={() => deployIntentAccountMutation.mutate()}
            className="mt-3 rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-cyan-100"
          >
            Deploy Intent Account
          </button>
          <p className="mt-2 text-xs text-muted">
            Predicted: {predictedIntentAccountQuery.data?.predicted_intent_account ?? "n/a"}
          </p>
          <input
            value={intentAccountAddress}
            onChange={(event) => setIntentAccountAddress(event.target.value)}
            className="mt-2 w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-sm text-ink"
            placeholder="Intent account address"
          />
          <input
            value={sessionManagerAddress}
            onChange={(event) => setSessionManagerAddress(event.target.value)}
            className="mt-2 w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-sm text-ink"
            placeholder="SessionKeyManager address"
          />
          <button
            type="button"
            onClick={() => setSessionManagerMutation.mutate()}
            className="mt-2 rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-xs text-ink"
          >
            Set SessionKeyManager
          </button>
          <input
            value={intentTradingAddress}
            onChange={(event) => setIntentTradingAddress(event.target.value)}
            className="mt-2 w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-sm text-ink"
            placeholder="Intent trading contract address"
          />
          <button
            type="button"
            onClick={() => setIntentTradingMutation.mutate()}
            className="mt-2 rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-xs text-ink"
          >
            Set Intent Trading Contract
          </button>
          <button
            type="button"
            onClick={() => executeSwapDirectMutation.mutate()}
            className="mt-3 rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-xs text-ink"
          >
            Execute Swap Direct
          </button>
          {executeSwapDirectMutation.data ? (
            <p className="mt-2 text-xs text-muted">
              Execution {executeSwapDirectMutation.data.execution_id} | {executeSwapDirectMutation.data.status}
            </p>
          ) : null}
          <div className="mt-4 rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-xs text-muted">
            Type mix: Swap {metrics.byType.Swap}, Limit {metrics.byType.Limit}, DCA {metrics.byType.DCA}, Multi{" "}
            {metrics.byType.Multi}, Perps {metrics.byType.Perps}. Initiated {metrics.initiated}, filled{" "}
            {metrics.filled}, partial {metrics.partial}, failed {metrics.failed}.
          </div>
          <p className="mt-3 text-sm text-muted">
            New intents are created from{" "}
            <Link href="/trade/spot" className="text-blue-300 underline underline-offset-2">
              Swap/Spot
            </Link>
            .
          </p>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-5">
          <h2 className="text-lg font-semibold">Session + Policy Advanced Actions</h2>

          <div className="mt-3 rounded-xl border border-line bg-[#0b1018]/90 p-3">
            <p className="text-xs uppercase tracking-[0.12em] text-muted">Create Session Key</p>
            <WiringBadges binding={wiring("account.createSessionKey")} executionMode={wiringMode} />
            <input
              value={newSessionAddress}
              onChange={(event) => setNewSessionAddress(event.target.value)}
              className="mt-2 w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-xs text-ink"
              placeholder="Reference session key (local label only)"
            />
            <input
              value={newSessionPermissions}
              onChange={(event) => setNewSessionPermissions(event.target.value)}
              className="mt-2 w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-xs text-ink"
              placeholder="permissions csv: swap,intent"
            />
            <button
              type="button"
              onClick={() => createSessionKeyMutation.mutate()}
              className="mt-2 rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-xs text-ink"
            >
              Create Session Key
            </button>
            {createSessionKeyMutation.data ? (
              <p className="mt-2 text-xs text-muted">
                Created: {createSessionKeyMutation.data.session_key.slice(0, 18)}...
              </p>
            ) : null}
          </div>

          <div className="mt-3 rounded-xl border border-line bg-[#0b1018]/90 p-3">
            <p className="text-xs uppercase tracking-[0.12em] text-muted">Revoke Session Key</p>
            <WiringBadges binding={wiring("account.revokeSessionKey")} executionMode={wiringMode} />
            <input
              value={sessionToRevoke}
              onChange={(event) => setSessionToRevoke(event.target.value)}
              className="mt-2 w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-xs text-ink"
              placeholder="session key"
            />
            <button
              type="button"
              onClick={() => revokeSessionKeyMutation.mutate()}
              className="mt-2 rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-xs text-ink"
            >
              Revoke Session Key
            </button>
          </div>

          <div className="mt-3 rounded-xl border border-line bg-[#0b1018]/90 p-3">
            <p className="text-xs uppercase tracking-[0.12em] text-muted">Policy Manager Controls</p>
            <WiringBadges binding={wiring("account.createPolicy")} executionMode={wiringMode} />
            <WiringBadges binding={wiring("account.setTimeWindow")} executionMode={wiringMode} />
            <WiringBadges binding={wiring("account.setAppPermission")} executionMode={wiringMode} />
            <WiringBadges binding={wiring("account.emergencyPause")} executionMode={wiringMode} />
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => createPolicyManagerMutation.mutate()}
                className="rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-xs text-ink"
              >
                Create Policy Manager
              </button>
              <button
                type="button"
                onClick={() => setPolicyEmergencyPauseMutation.mutate()}
                className="rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-xs text-ink"
              >
                Set Emergency Pause
              </button>
            </div>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <input
                value={policyWindowStart}
                onChange={(event) => setPolicyWindowStart(event.target.value)}
                className="rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-xs text-ink"
                placeholder="window start hour"
              />
              <input
                value={policyWindowEnd}
                onChange={(event) => setPolicyWindowEnd(event.target.value)}
                className="rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-xs text-ink"
                placeholder="window end hour"
              />
            </div>
            <button
              type="button"
              onClick={() => setPolicyTimeWindowMutation.mutate()}
              className="mt-2 rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-xs text-ink"
            >
              Set Time Window
            </button>
            <input
              value={policyAppAddress}
              onChange={(event) => setPolicyAppAddress(event.target.value)}
              className="mt-2 w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-xs text-ink"
              placeholder="app address"
            />
            <input
              value={policyAppLimit}
              onChange={(event) => setPolicyAppLimit(event.target.value)}
              className="mt-2 w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-xs text-ink"
              placeholder="app max notional"
            />
            <label className="mt-2 flex items-center gap-2 text-xs text-muted">
              <input
                type="checkbox"
                checked={policyAppAllowed}
                onChange={(event) => setPolicyAppAllowed(event.target.checked)}
              />
              App Allowed
            </label>
            <label className="mt-1 flex items-center gap-2 text-xs text-muted">
              <input
                type="checkbox"
                checked={emergencyPaused}
                onChange={(event) => setEmergencyPaused(event.target.checked)}
              />
              Emergency Paused
            </label>
            <button
              type="button"
              onClick={() => setPolicyAppPermissionMutation.mutate()}
              className="mt-2 rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-xs text-ink"
            >
              Set App Permission
            </button>
          </div>

          <div className="mt-3 rounded-xl border border-line bg-[#0b1018]/90 p-3">
            <p className="text-xs uppercase tracking-[0.12em] text-muted">Policy Portability</p>
            <WiringBadges binding={wiring("account.policyExport")} executionMode={wiringMode} />
            <WiringBadges binding={wiring("account.policyImport")} executionMode={wiringMode} />
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => exportPolicyMutation.mutate()}
                className="rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-xs text-ink"
              >
                Export Policy JSON
              </button>
              <button
                type="button"
                onClick={() => importPolicyMutation.mutate()}
                className="rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-3 py-2 text-xs font-semibold text-cyan-100"
              >
                Import Policy JSON
              </button>
            </div>
            <textarea
              value={importJson}
              onChange={(event) => setImportJson(event.target.value)}
              className="mt-2 h-28 w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 font-mono text-xs text-ink"
              placeholder="Paste policy portability payload"
            />
            {exportFeedback ? <p className="mt-2 text-xs text-muted">{exportFeedback}</p> : null}
            {importFeedback ? <p className="mt-1 text-xs text-success">{importFeedback}</p> : null}
            {importError ? <p className="mt-1 text-xs text-danger">{importError}</p> : null}
          </div>
        </article>

        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-5">
          <h2 className="text-lg font-semibold">Intent Account Advanced Actions</h2>

          <div className="mt-3 rounded-xl border border-line bg-[#0b1018]/90 p-3">
            <p className="text-xs uppercase tracking-[0.12em] text-muted">Batch Deploy + Owner Lookup</p>
            <WiringBadges binding={wiring("account.batchDeployIntentAccounts")} executionMode={wiringMode} />
            <WiringBadges binding={wiring("account.getIntentAccountOwner")} executionMode={wiringMode} />
            <textarea
              value={batchOwners}
              onChange={(event) => setBatchOwners(event.target.value)}
              className="mt-2 h-20 w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-xs text-ink"
              placeholder="owners separated by ;"
            />
            <button
              type="button"
              onClick={() => batchDeployIntentAccountsMutation.mutate()}
              className="mt-2 rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-xs text-ink"
            >
              Batch Deploy Intent Accounts
            </button>
            <input
              value={intentAccountLookup}
              onChange={(event) => setIntentAccountLookup(event.target.value)}
              className="mt-2 w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-xs text-ink"
              placeholder="intent account for owner lookup"
            />
            <button
              type="button"
              onClick={() => getIntentOwnerMutation.mutate()}
              className="mt-2 rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-xs text-ink"
            >
              Get Intent Account Owner
            </button>
            {getIntentOwnerMutation.data ? (
              <p className="mt-2 text-xs text-muted">
                Owner: {getIntentOwnerMutation.data.owner}
              </p>
            ) : null}
          </div>

          <div className="mt-3 rounded-xl border border-line bg-[#0b1018]/90 p-3">
            <p className="text-xs uppercase tracking-[0.12em] text-muted">Execute Intent / Batch Intent</p>
            <WiringBadges binding={wiring("account.executeIntent")} executionMode={wiringMode} />
            <WiringBadges binding={wiring("account.executeBatchIntent")} executionMode={wiringMode} />
            <input
              value={intentTokenIn}
              onChange={(event) => setIntentTokenIn(event.target.value)}
              className="mt-2 w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-xs text-ink"
              placeholder="token in"
            />
            <input
              value={intentTokenOut}
              onChange={(event) => setIntentTokenOut(event.target.value)}
              className="mt-2 w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-xs text-ink"
              placeholder="token out"
            />
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <input
                value={intentAmountIn}
                onChange={(event) => setIntentAmountIn(event.target.value)}
                className="rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-xs text-ink"
                placeholder="amount in"
              />
              <input
                value={intentMinAmountOut}
                onChange={(event) => setIntentMinAmountOut(event.target.value)}
                className="rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-xs text-ink"
                placeholder="min amount out"
              />
            </div>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <input
                value={batchSecondAmountIn}
                onChange={(event) => setBatchSecondAmountIn(event.target.value)}
                className="rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-xs text-ink"
                placeholder="batch leg2 amount in"
              />
              <input
                value={batchSecondMinOut}
                onChange={(event) => setBatchSecondMinOut(event.target.value)}
                className="rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-xs text-ink"
                placeholder="batch leg2 min out"
              />
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => executeIntentMutation.mutate()}
                className="rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-xs text-ink"
              >
                Execute Intent
              </button>
              <button
                type="button"
                onClick={() => executeBatchIntentMutation.mutate()}
                className="rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-xs text-ink"
              >
                Execute Batch Intent
              </button>
            </div>
            {executeIntentMutation.data ? (
              <p className="mt-2 text-xs text-muted">
                Intent exec {executeIntentMutation.data.execution_id} | {executeIntentMutation.data.status}
              </p>
            ) : null}
            {executeBatchIntentMutation.data ? (
              <p className="mt-1 text-xs text-muted">
                Batch exec {executeBatchIntentMutation.data.execution_id} | {executeBatchIntentMutation.data.status}
              </p>
            ) : null}
          </div>
        </article>
      </section>
    </PageFrame>
  );
}
