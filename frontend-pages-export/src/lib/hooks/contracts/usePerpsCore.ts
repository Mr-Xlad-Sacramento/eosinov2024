"use client";

import { useReadContract, useWriteContract, useChainId } from "wagmi";

import { StandRPerpsCoreAbi } from "@/lib/web3/abis";
import { getContractAddresses } from "@/lib/web3/contracts";

export function usePerpsCore() {
  const chainId = useChainId();
  const { standRPerpsCore: address } = getContractAddresses(chainId);

  const tvlQuery = useReadContract({
    address,
    abi: StandRPerpsCoreAbi,
    functionName: "getTVL",
  });

  const insuranceFundQuery = useReadContract({
    address,
    abi: StandRPerpsCoreAbi,
    functionName: "getInsuranceFund",
  });

  const insuranceFundHealthQuery = useReadContract({
    address,
    abi: StandRPerpsCoreAbi,
    functionName: "getInsuranceFundHealth",
  });

  const { writeContract, isPending: isWritePending, error: writeError } = useWriteContract();

  const closePosition = (positionId: `0x${string}`) => {
    writeContract({
      address,
      abi: StandRPerpsCoreAbi,
      functionName: "closePosition",
      args: [positionId],
    });
  };

  return {
    tvl: tvlQuery.data,
    insuranceFund: insuranceFundQuery.data,
    insuranceFundHealth: insuranceFundHealthQuery.data
      ? {
          balance: insuranceFundHealthQuery.data[0],
          totalOpenInterest: insuranceFundHealthQuery.data[1],
          healthRatio: insuranceFundHealthQuery.data[2],
        }
      : undefined,
    isLoading:
      tvlQuery.isLoading || insuranceFundQuery.isLoading || insuranceFundHealthQuery.isLoading,
    isError: tvlQuery.isError || insuranceFundQuery.isError || insuranceFundHealthQuery.isError,
    error: tvlQuery.error ?? insuranceFundQuery.error ?? insuranceFundHealthQuery.error,
    closePosition,
    isWritePending,
    writeError,
    refetch: async () => {
      await Promise.all([
        tvlQuery.refetch(),
        insuranceFundQuery.refetch(),
        insuranceFundHealthQuery.refetch(),
      ]);
    },
  };
}

export function usePerpsPosition(positionId: `0x${string}` | undefined) {
  const chainId = useChainId();
  const { standRPerpsCore: address } = getContractAddresses(chainId);

  const query = useReadContract({
    address,
    abi: StandRPerpsCoreAbi,
    functionName: "getPosition",
    args: positionId ? [positionId] : undefined,
    query: { enabled: !!positionId },
  });

  return {
    position: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

export function usePerpsUserPositions(user: `0x${string}` | undefined) {
  const chainId = useChainId();
  const { standRPerpsCore: address } = getContractAddresses(chainId);

  const query = useReadContract({
    address,
    abi: StandRPerpsCoreAbi,
    functionName: "getUserPositions",
    args: user ? [user] : undefined,
    query: { enabled: !!user },
  });

  return {
    positionIds: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function usePerpsFundingRate(indexToken: `0x${string}` | undefined) {
  const chainId = useChainId();
  const { standRPerpsCore: address } = getContractAddresses(chainId);

  const query = useReadContract({
    address,
    abi: StandRPerpsCoreAbi,
    functionName: "getFundingRate",
    args: indexToken ? [indexToken] : undefined,
    query: { enabled: !!indexToken },
  });

  return {
    fundingRate: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
