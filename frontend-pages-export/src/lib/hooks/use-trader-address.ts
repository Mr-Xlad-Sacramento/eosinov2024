"use client";

import { useAccount } from "wagmi";

import { DEMO_ADDRESS } from "@/lib/constants";

export function useTraderAddress() {
  const { address, isConnected } = useAccount();
  return {
    traderAddress: address ?? DEMO_ADDRESS,
    isConnected,
  };
}
