"use client";
import { useReadContract, useWriteContract, useChainId } from "wagmi";
import { SocialTradingModuleAbi } from "@/lib/web3/abis";
import { getContractAddresses } from "@/lib/web3/contracts";

export function useSocialTrading() {
  const chainId = useChainId();
  const { socialTradingModule: address } = getContractAddresses(chainId);

  const { writeContract, isPending, error } = useWriteContract();

  const registerAsTrader = (isPublic: boolean) => {
    writeContract({
      address,
      abi: SocialTradingModuleAbi,
      functionName: "registerAsTrader",
      args: [isPublic],
    });
  };

  const followTrader = (
    trader: `0x${string}`,
    allocationBps: bigint,
    maxAllocation: bigint,
    autoExecute: boolean
  ) => {
    writeContract({
      address,
      abi: SocialTradingModuleAbi,
      functionName: "followTrader",
      args: [trader, allocationBps, maxAllocation, autoExecute],
    });
  };

  const copyTrade = (
    originalTradeId: `0x${string}`,
    trader: `0x${string}`,
    follower: `0x${string}`
  ) => {
    writeContract({
      address,
      abi: SocialTradingModuleAbi,
      functionName: "copyTrade",
      args: [originalTradeId, trader, follower],
    });
  };

  return {
    registerAsTrader,
    followTrader,
    copyTrade,
    isPending,
    error,
  };
}

export function useTraderProfile(trader?: `0x${string}`) {
  const chainId = useChainId();
  const { socialTradingModule: address } = getContractAddresses(chainId);

  return useReadContract({
    address,
    abi: SocialTradingModuleAbi,
    functionName: "getTraderProfile",
    args: trader ? [trader] : undefined,
    query: {
      enabled: !!trader,
    },
  });
}

export function useTraderFollowers(trader?: `0x${string}`) {
  const chainId = useChainId();
  const { socialTradingModule: address } = getContractAddresses(chainId);

  return useReadContract({
    address,
    abi: SocialTradingModuleAbi,
    functionName: "getFollowers",
    args: trader ? [trader] : undefined,
    query: {
      enabled: !!trader,
    },
  });
}
