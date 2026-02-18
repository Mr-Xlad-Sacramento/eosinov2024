"use client";

import { FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";

import { PageFrame } from "@/components/page-frame";
import { Panel } from "@/components/panel";
import { TradingSurfaceNav } from "@/components/trading/TradingSurfaceNav";
import { standrApi } from "@/lib/api/standr";
import { useTraderAddress } from "@/lib/hooks/use-trader-address";

export default function BasisTradePage() {
  const { traderAddress } = useTraderAddress();
  const queryClient = useQueryClient();

  const [spotToken, setSpotToken] = useState("ETH");
  const [perpsToken, setPerpsToken] = useState("ETH-PERP");
  const [amount, setAmount] = useState("1000");
  const [leverage, setLeverage] = useState(2);
  const [closeId, setCloseId] = useState("");

  const { data: positions, isLoading: loadingPositions } = useQuery({
    queryKey: ["basis-positions", traderAddress],
    queryFn: () => standrApi.getBasisPositions(traderAddress),
  });

  const openMutation = useMutation({
    mutationFn: () =>
      standrApi.openBasis({
        trader: traderAddress,
        spot_token: spotToken,
        perps_token: perpsToken,
        amount,
        leverage,
        idempotency_key: uuidv4(),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["basis-positions", traderAddress] });
    },
  });

  const closeMutation = useMutation({
    mutationFn: (positionId: string) =>
      standrApi.closeBasis({ position_id: positionId }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["basis-positions", traderAddress] });
    },
  });

  const handleOpen = (e: FormEvent) => {
    e.preventDefault();
    openMutation.mutate();
  };

  const handleClose = (positionId: string) => {
    closeMutation.mutate(positionId);
  };

  const openPositions = positions?.filter((p) => p.status === "open") ?? [];
  const closedPositions = positions?.filter((p) => p.status === "closed") ?? [];

  return (
    <PageFrame title="Basis Strategy" description="Spot + perps basis trade execution">
      <TradingSurfaceNav />

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Open Basis Position */}
        <Panel title="Open Basis Position">
          <form onSubmit={handleOpen} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400">Spot Token</label>
              <input
                type="text"
                value={spotToken}
                onChange={(e) => setSpotToken(e.target.value)}
                className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400">Perps Token</label>
              <input
                type="text"
                value={perpsToken}
                onChange={(e) => setPerpsToken(e.target.value)}
                className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400">Amount (USD)</label>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400">Leverage (1-10x)</label>
              <input
                type="range"
                min={1}
                max={10}
                value={leverage}
                onChange={(e) => setLeverage(Number(e.target.value))}
                className="mt-1 w-full"
              />
              <span className="text-sm text-zinc-300">{leverage}x</span>
            </div>
            <button
              type="submit"
              disabled={openMutation.isPending}
              className="w-full rounded bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
            >
              {openMutation.isPending ? "Opening..." : "Open Basis Position"}
            </button>
            {openMutation.isError && (
              <p className="text-sm text-red-400">
                {(openMutation.error as Error).message}
              </p>
            )}
            {openMutation.isSuccess && (
              <p className="text-sm text-emerald-400">
                Opened: {openMutation.data.position_id}
                <span className="ml-2 text-xs text-zinc-500">
                  [{openMutation.data.source_mode}]
                </span>
              </p>
            )}
          </form>
        </Panel>

        {/* Close Basis Position */}
        <Panel title="Close / Unwind Position">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400">Position ID</label>
              <input
                type="text"
                value={closeId}
                onChange={(e) => setCloseId(e.target.value)}
                placeholder="basis-xxxx-xxxx..."
                className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white"
              />
            </div>
            <button
              onClick={() => handleClose(closeId)}
              disabled={closeMutation.isPending || !closeId}
              className="w-full rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-50"
            >
              {closeMutation.isPending ? "Closing..." : "Unwind Position"}
            </button>
            {closeMutation.isError && (
              <p className="text-sm text-red-400">
                {(closeMutation.error as Error).message}
              </p>
            )}
            {closeMutation.isSuccess && (
              <p className="text-sm text-emerald-400">Position closed successfully</p>
            )}
          </div>
        </Panel>
      </div>

      {/* Active Positions */}
      <div className="mt-6">
        <Panel title={`Active Positions (${openPositions.length})`}>
          {loadingPositions ? (
            <p className="text-sm text-zinc-500">Loading...</p>
          ) : openPositions.length === 0 ? (
            <p className="text-sm text-zinc-500">No open basis positions</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-zinc-700 text-zinc-400">
                  <tr>
                    <th className="pb-2 pr-4">ID</th>
                    <th className="pb-2 pr-4">Spot</th>
                    <th className="pb-2 pr-4">Perps</th>
                    <th className="pb-2 pr-4">Size</th>
                    <th className="pb-2 pr-4">Leverage</th>
                    <th className="pb-2 pr-4">Spread</th>
                    <th className="pb-2 pr-4">Mode</th>
                    <th className="pb-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {openPositions.map((pos) => {
                    const spread = (
                      ((Number(pos.perps_entry_price) - Number(pos.spot_entry_price)) /
                        Number(pos.spot_entry_price)) *
                      100
                    ).toFixed(3);
                    return (
                      <tr key={pos.position_id} className="border-b border-zinc-800 text-white">
                        <td className="py-2 pr-4 font-mono text-xs">
                          {pos.position_id.slice(0, 16)}...
                        </td>
                        <td className="py-2 pr-4">{pos.spot_token}</td>
                        <td className="py-2 pr-4">{pos.perps_token}</td>
                        <td className="py-2 pr-4">${pos.spot_size}</td>
                        <td className="py-2 pr-4">{pos.leverage}x</td>
                        <td className="py-2 pr-4">{spread}%</td>
                        <td className="py-2 pr-4">
                          <span
                            className={`rounded px-1.5 py-0.5 text-xs ${
                              pos.source_mode === "onchain"
                                ? "bg-emerald-900 text-emerald-300"
                                : "bg-amber-900 text-amber-300"
                            }`}
                          >
                            {pos.source_mode}
                          </span>
                        </td>
                        <td className="py-2">
                          <button
                            onClick={() => handleClose(pos.position_id)}
                            className="rounded bg-red-700 px-2 py-1 text-xs text-white hover:bg-red-600"
                          >
                            Unwind
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      </div>

      {/* Closed Positions History */}
      {closedPositions.length > 0 && (
        <div className="mt-6">
          <Panel title={`Closed Positions (${closedPositions.length})`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-zinc-700 text-zinc-400">
                  <tr>
                    <th className="pb-2 pr-4">ID</th>
                    <th className="pb-2 pr-4">Spot</th>
                    <th className="pb-2 pr-4">Perps</th>
                    <th className="pb-2 pr-4">Size</th>
                    <th className="pb-2 pr-4">Leverage</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {closedPositions.map((pos) => (
                    <tr key={pos.position_id} className="border-b border-zinc-800 text-zinc-400">
                      <td className="py-2 pr-4 font-mono text-xs">
                        {pos.position_id.slice(0, 16)}...
                      </td>
                      <td className="py-2 pr-4">{pos.spot_token}</td>
                      <td className="py-2 pr-4">{pos.perps_token}</td>
                      <td className="py-2 pr-4">${pos.spot_size}</td>
                      <td className="py-2 pr-4">{pos.leverage}x</td>
                      <td className="py-2">
                        <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-zinc-400">
                          closed
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>
      )}
    </PageFrame>
  );
}
