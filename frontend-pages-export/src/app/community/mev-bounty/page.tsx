"use client";

import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { PageFrame } from "@/components/page-frame";
import { standrApi } from "@/lib/api/standr";
import { useTraderAddress } from "@/lib/hooks/use-trader-address";

export default function CommunityMevBountyPage() {
  const { traderAddress } = useTraderAddress();
  const [orderId, setOrderId] = useState("order_001");
  const [commitmentHash, setCommitmentHash] = useState(
    "0x1111111111111111111111111111111111111111111111111111111111111111",
  );
  const [bidAmount, setBidAmount] = useState("1000");
  const [estimatedMev, setEstimatedMev] = useState("1500");
  const [salt, setSalt] = useState("salt_001");

  const commitMutation = useMutation({
    mutationFn: () =>
      standrApi.commitMevBid({
        commitment_hash: commitmentHash,
        order_id: orderId,
        solver: traderAddress,
      }),
  });

  const revealMutation = useMutation({
    mutationFn: () =>
      standrApi.revealMevBid({
        order_id: orderId,
        solver: traderAddress,
        bid_amount: bidAmount,
        estimated_mev: estimatedMev,
        salt,
      }),
  });

  const listBidsMutation = useMutation({
    mutationFn: () => standrApi.getOrderMevBids(orderId),
  });

  const selectWinnerMutation = useMutation({
    mutationFn: () => standrApi.selectMevWinner({ order_id: orderId }),
  });

  const distributeMutation = useMutation({
    mutationFn: () =>
      standrApi.distributeMevBounty({
        order_id: orderId,
        user: traderAddress,
        solver: selectWinnerMutation.data?.solver ?? traderAddress,
      }),
  });

  function onListBids(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    listBidsMutation.mutate();
  }

  return (
    <PageFrame
      title="MEV Bounty Marketplace"
      description="Commit-reveal bid flow, winner selection, and bounty distribution."
    >
      <section className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-5">
          <h2 className="text-lg font-semibold">Commit-Reveal</h2>
          <label className="mt-3 block text-sm text-muted">
            Order ID
            <input
              value={orderId}
              onChange={(event) => setOrderId(event.target.value)}
              className="mt-1 w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
            />
          </label>
          <label className="mt-3 block text-sm text-muted">
            Commitment Hash (bytes32)
            <input
              value={commitmentHash}
              onChange={(event) => setCommitmentHash(event.target.value)}
              className="mt-1 w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
            />
          </label>
          <button
            type="button"
            onClick={() => commitMutation.mutate()}
            className="mt-3 rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-cyan-100"
          >
            Commit Bid
          </button>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <label className="text-sm text-muted">
              Bid Amount
              <input
                value={bidAmount}
                onChange={(event) => setBidAmount(event.target.value)}
                className="mt-1 w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
              />
            </label>
            <label className="text-sm text-muted">
              Estimated MEV
              <input
                value={estimatedMev}
                onChange={(event) => setEstimatedMev(event.target.value)}
                className="mt-1 w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
              />
            </label>
          </div>
          <label className="mt-3 block text-sm text-muted">
            Salt
            <input
              value={salt}
              onChange={(event) => setSalt(event.target.value)}
              className="mt-1 w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
            />
          </label>
          <button
            type="button"
            onClick={() => revealMutation.mutate()}
            className="mt-3 rounded-xl border border-line bg-[#0b1018] px-4 py-2 text-sm font-semibold text-ink"
          >
            Reveal Bid
          </button>
        </article>

        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-5">
          <h2 className="text-lg font-semibold">Settlement</h2>
          <form onSubmit={onListBids} className="space-y-3">
            <button
              type="submit"
              className="w-full rounded-xl border border-line bg-[#0b1018] px-4 py-2 text-sm font-semibold text-ink"
            >
              List Bids for Order
            </button>
            <button
              type="button"
              onClick={() => selectWinnerMutation.mutate()}
              className="w-full rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-cyan-100"
            >
              Select Winning Bid
            </button>
            <button
              type="button"
              onClick={() => distributeMutation.mutate()}
              className="w-full rounded-xl border border-line bg-[#0b1018] px-4 py-2 text-sm font-semibold text-ink"
            >
              Distribute Bounty
            </button>
          </form>
          <div className="mt-4 space-y-3 text-xs text-muted">
            {listBidsMutation.data ? (
              <p>Bids loaded: {listBidsMutation.data.length}</p>
            ) : null}
            {selectWinnerMutation.data ? (
              <p>
                Winner: {selectWinnerMutation.data.solver} ({selectWinnerMutation.data.bid_amount})
              </p>
            ) : null}
            {distributeMutation.data ? (
              <p>
                Distribution: user {distributeMutation.data.user_payment}, protocol{" "}
                {distributeMutation.data.protocol_fee}
              </p>
            ) : null}
          </div>
        </article>
      </section>
    </PageFrame>
  );
}

