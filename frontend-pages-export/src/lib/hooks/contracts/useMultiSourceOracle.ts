"use client";

import { useReadContract, useChainId } from "wagmi";

import { MultiSourceOracleAbi } from "@/lib/web3/abis";
import { getContractAddresses } from "@/lib/web3/contracts";

const ORACLE_SOURCES = ["Pyth Lazer", "Pyth", "Chainlink", "TWAP"] as const;

export function useMultiSourceOracle() {
  const chainId = useChainId();
  const { multiSourceOracle: address } = getContractAddresses(chainId);

  const pausedQuery = useReadContract({
    address,
    abi: MultiSourceOracleAbi,
    functionName: "paused",
  });

  return {
    paused: pausedQuery.data,
    isLoading: pausedQuery.isLoading,
    isError: pausedQuery.isError,
    error: pausedQuery.error,
    refetch: pausedQuery.refetch,
  };
}

export function useOraclePrice(asset: `0x${string}` | undefined) {
  const chainId = useChainId();
  const { multiSourceOracle: address } = getContractAddresses(chainId);

  const query = useReadContract({
    address,
    abi: MultiSourceOracleAbi,
    functionName: "getPriceWithSource",
    args: asset ? [asset] : undefined,
    query: { enabled: !!asset },
  });

  return {
    price: query.data?.[0],
    confidence: query.data?.[1],
    source: query.data?.[2] !== undefined ? ORACLE_SOURCES[query.data[2]] : undefined,
    sourceIndex: query.data?.[2],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useOracleStats(asset: `0x${string}` | undefined) {
  const chainId = useChainId();
  const { multiSourceOracle: address } = getContractAddresses(chainId);

  const query = useReadContract({
    address,
    abi: MultiSourceOracleAbi,
    functionName: "getOracleStats",
    args: asset ? [asset] : undefined,
    query: { enabled: !!asset },
  });

  return {
    stats: query.data
      ? {
          pythLazerHits: query.data[0],
          pythHits: query.data[1],
          chainlinkHits: query.data[2],
          twapHits: query.data[3],
          totalQueries: query.data[4],
        }
      : undefined,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
