"use client";
import { useReadContract, useChainId } from "wagmi";
import { GamificationSystemAbi } from "@/lib/web3/abis";
import { getContractAddresses } from "@/lib/web3/contracts";

export function useGamification() {
  const chainId = useChainId();
  const { gamificationSystem: address } = getContractAddresses(chainId);

  return { address, chainId };
}

export function useUserPoints(user?: `0x${string}`) {
  const chainId = useChainId();
  const { gamificationSystem: address } = getContractAddresses(chainId);

  return useReadContract({
    address,
    abi: GamificationSystemAbi,
    functionName: "getUserStats",
    args: user ? [user] : undefined,
    query: {
      enabled: !!user,
    },
  });
}

export function useLeaderboard(topN: number = 10) {
  const chainId = useChainId();
  const { gamificationSystem: address } = getContractAddresses(chainId);

  return useReadContract({
    address,
    abi: GamificationSystemAbi,
    functionName: "getGlobalLeaderboard",
    args: [BigInt(topN)],
  });
}

export function useSeasonalLeaderboard(topN: number = 10) {
  const chainId = useChainId();
  const { gamificationSystem: address } = getContractAddresses(chainId);

  return useReadContract({
    address,
    abi: GamificationSystemAbi,
    functionName: "getSeasonalLeaderboard",
    args: [BigInt(topN)],
  });
}

export function useSeasonInfo() {
  const chainId = useChainId();
  const { gamificationSystem: address } = getContractAddresses(chainId);

  const currentSeason = useReadContract({
    address,
    abi: GamificationSystemAbi,
    functionName: "currentSeason",
  });

  const seasonStartTime = useReadContract({
    address,
    abi: GamificationSystemAbi,
    functionName: "seasonStartTime",
  });

  const seasonDuration = useReadContract({
    address,
    abi: GamificationSystemAbi,
    functionName: "seasonDuration",
  });

  return {
    currentSeason: currentSeason.data,
    seasonStartTime: seasonStartTime.data,
    seasonDuration: seasonDuration.data,
    isLoading:
      currentSeason.isLoading ||
      seasonStartTime.isLoading ||
      seasonDuration.isLoading,
  };
}
