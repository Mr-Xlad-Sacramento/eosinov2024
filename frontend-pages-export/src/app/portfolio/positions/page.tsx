"use client";

import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { formatUnits } from "viem";

import { PageFrame } from "@/components/page-frame";
import { Panel } from "@/components/panel";
import { DEMO_POSITION_ID } from "@/lib/constants";
import { standrApi } from "@/lib/api/standr";
import { useTraderAddress } from "@/lib/hooks/use-trader-address";
import { usePerpsCore, usePerpsUserPositions } from "@/lib/hooks/contracts";

export default function PortfolioPositionsPage() {
  const { traderAddress } = useTraderAddress();
  const { address } = useAccount();

  const { data: positions } = useQuery({
    queryKey: ["portfolio-positions", traderAddress],
    queryFn: () => standrApi.getPositions(traderAddress),
  });

  const { data: pnl } = useQuery({
    queryKey: ["portfolio-pnl", DEMO_POSITION_ID],
    queryFn: () => standrApi.getPnl(DEMO_POSITION_ID),
  });

  const perps = usePerpsCore();
  const userPositions = usePerpsUserPositions(address);

  return (
    <PageFrame
      title="Positions"
      description="Perps positions and PnL telemetry from canonical perps endpoints."
    >
      <section className="grid gap-4 lg:grid-cols-3">
        <Panel title="Open Positions" subtitle={`Trader ${traderAddress}`}>
          <ul className="space-y-2">
            {positions?.map((position) => (
              <li key={position.position_id} className="rounded-xl border border-line bg-canvas px-3 py-2 text-sm">
                {position.side} {position.position_size} | collateral {position.collateral_amount} | {position.status}
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="PnL" subtitle="Current sample position">
          <p className="text-sm text-muted">PnL: {pnl?.pnl ?? "loading"}</p>
          <p className="text-sm text-muted">PnL %: {pnl?.pnl_percentage ?? 0}%</p>
        </Panel>
        <Panel title="On-Chain Perps" subtitle="Contract reads">
          <div className="space-y-2 text-sm text-muted">
            <p>TVL: <span className="text-ink">{perps.tvl !== undefined ? formatUnits(perps.tvl, 18) : "..."}</span></p>
            <p>Insurance fund: <span className="text-ink">{perps.insuranceFund !== undefined ? formatUnits(perps.insuranceFund, 18) : "..."}</span></p>
            <p>Your on-chain positions: <span className="text-ink">{userPositions.positionIds?.length ?? "..."}</span></p>
            {userPositions.positionIds && userPositions.positionIds.length > 0 ? (
              <ul className="mt-1 space-y-1">
                {userPositions.positionIds.slice(0, 5).map((id) => (
                  <li key={id} className="truncate font-mono text-xs text-ink">{id}</li>
                ))}
                {userPositions.positionIds.length > 5 && (
                  <li className="text-xs">...and {userPositions.positionIds.length - 5} more</li>
                )}
              </ul>
            ) : null}
            {(perps.isError || userPositions.isError) && (
              <p className="text-red-400">Contract read error (wallet may not be connected)</p>
            )}
          </div>
        </Panel>
      </section>
    </PageFrame>
  );
}
