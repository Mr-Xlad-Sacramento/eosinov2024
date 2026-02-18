"use client";

import { useReadContract } from "wagmi";
import { useChainId } from "wagmi";

import { StandRCoreAbi } from "@/lib/web3/abis";
import { getContractAddresses } from "@/lib/web3/contracts";

export function useStandRCore() {
  const chainId = useChainId();
  const { standRCore: address } = getContractAddresses(chainId);

  const ownerQuery = useReadContract({
    address,
    abi: StandRCoreAbi,
    functionName: "owner",
  });

  const limitOrderQueueQuery = useReadContract({
    address,
    abi: StandRCoreAbi,
    functionName: "getLimitOrderQueue",
  });

  return {
    owner: ownerQuery.data,
    limitOrderQueue: limitOrderQueueQuery.data,
    isLoading: ownerQuery.isLoading || limitOrderQueueQuery.isLoading,
    isError: ownerQuery.isError || limitOrderQueueQuery.isError,
    error: ownerQuery.error ?? limitOrderQueueQuery.error,
    refetch: async () => {
      await Promise.all([ownerQuery.refetch(), limitOrderQueueQuery.refetch()]);
    },
  };
}

export function useStandRCoreBestYieldSource(token: `0x${string}` | undefined) {
  const chainId = useChainId();
  const { standRCore: address } = getContractAddresses(chainId);

  const query = useReadContract({
    address,
    abi: StandRCoreAbi,
    functionName: "getBestYieldSource",
    args: token ? [token] : undefined,
    query: { enabled: !!token },
  });

  return {
    sourceKey: query.data?.[0],
    adapter: query.data?.[1],
    apy: query.data?.[2],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
