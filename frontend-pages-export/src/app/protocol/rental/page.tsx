"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { PageFrame } from "@/components/page-frame";
import { protocolApi } from "@/components/protocol/api";
import { useTraderAddress } from "@/lib/hooks/use-trader-address";

function unixToDate(unix: number): string {
  return new Date(unix * 1000).toLocaleString();
}

export default function ProtocolRentalPage() {
  const { traderAddress } = useTraderAddress();
  const queryClient = useQueryClient();
  const [offerId, setOfferId] = useState("rent_offer_1");
  const [shares, setShares] = useState("250");
  const [durationDays, setDurationDays] = useState("5");

  const offersQuery = useQuery({
    queryKey: ["protocol-rental-offers"],
    queryFn: protocolApi.listRentalOffers,
  });
  const agreementsQuery = useQuery({
    queryKey: ["protocol-rental-agreements", traderAddress],
    queryFn: () => protocolApi.listRentalAgreements(traderAddress),
  });

  const rentMutation = useMutation({
    mutationFn: () =>
      protocolApi.rentLiquidity({
        wallet_address: traderAddress,
        offer_id: offerId,
        shares: Number(shares),
        duration_days: Number(durationDays),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["protocol-rental-offers"] });
      await queryClient.invalidateQueries({ queryKey: ["protocol-rental-agreements", traderAddress] });
    },
  });

  const returnMutation = useMutation({
    mutationFn: (agreementId: string) =>
      protocolApi.returnRental({
        wallet_address: traderAddress,
        agreement_id: agreementId,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["protocol-rental-offers"] });
      await queryClient.invalidateQueries({ queryKey: ["protocol-rental-agreements", traderAddress] });
    },
  });

  return (
    <PageFrame
      title="Liquidity Rental Market"
      description="Browse active rental offers and manage rental agreements."
    >
      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-5">
          <h2 className="text-lg font-semibold">Rent Liquidity</h2>
          <div className="mt-3 space-y-3">
            <select
              value={offerId}
              onChange={(event) => setOfferId(event.target.value)}
              className="w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
            >
              {(offersQuery.data ?? []).map((offer) => (
                <option key={offer.offer_id} value={offer.offer_id}>
                  {offer.offer_id} | pool {offer.pool_id} | available {offer.available_shares.toFixed(2)}
                </option>
              ))}
            </select>
            <input
              type="number"
              min={1}
              value={shares}
              onChange={(event) => setShares(event.target.value)}
              className="w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
            />
            <input
              type="number"
              min={1}
              value={durationDays}
              onChange={(event) => setDurationDays(event.target.value)}
              className="w-full rounded-xl border border-line bg-[#0b1018] px-3 py-2 text-ink outline-none transition focus:border-cyan-300/45"
            />
            <button
              type="button"
              onClick={() => rentMutation.mutate()}
              disabled={rentMutation.isPending}
              className="rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20 disabled:opacity-60"
            >
              {rentMutation.isPending ? "Renting..." : "Rent liquidity"}
            </button>
          </div>
        </article>

        <article className="rounded-3xl border border-line bg-gradient-to-br from-[#101523] via-[#10141d] to-[#0c1017] p-5">
          <h2 className="text-lg font-semibold">My Agreements</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {(agreementsQuery.data ?? []).map((agreement) => (
              <li key={agreement.agreement_id} className="rounded-xl border border-line bg-canvas/60 p-3">
                <p className="font-semibold text-ink">{agreement.agreement_id}</p>
                <p className="text-xs text-muted">
                  Offer {agreement.offer_id} | Shares {agreement.shares.toFixed(2)} | {agreement.status}
                </p>
                <p className="text-xs text-muted">
                  {unixToDate(agreement.start_unix)} {"->"} {unixToDate(agreement.end_unix)}
                </p>
                {agreement.status === "active" ? (
                  <button
                    type="button"
                    onClick={() => returnMutation.mutate(agreement.agreement_id)}
                    className="mt-2 rounded-lg border border-line bg-panel-strong px-3 py-1 text-xs font-semibold text-ink"
                  >
                    Return rental
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        </article>
      </section>
    </PageFrame>
  );
}
