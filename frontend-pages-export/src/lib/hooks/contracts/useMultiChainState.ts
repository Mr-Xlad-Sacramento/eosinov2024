"use client";
import { useReadContract, useWriteContract, useChainId } from "wagmi";
import { MultiChainStateAggregatorAbi } from "@/lib/web3/abis";
import { getContractAddresses } from "@/lib/web3/contracts";

export function useMultiChainState() {
  const chainId = useChainId();
  const { multiChainStateAggregator: address } = getContractAddresses(chainId);

  const { writeContract, isPending, error } = useWriteContract();

  const createSnapshot = (
    user: `0x${string}`,
    tokens: `0x${string}`[][],
    protocols: `0x${string}`[]
  ) => {
    writeContract({
      address,
      abi: MultiChainStateAggregatorAbi,
      functionName: "createSnapshot",
      args: [user, tokens, protocols],
    });
  };

  return {
    createSnapshot,
    isPending,
    error,
  };
}

export function useLatestSnapshot(user?: `0x${string}`) {
  const chainId = useChainId();
  const { multiChainStateAggregator: address } = getContractAddresses(chainId);

  return useReadContract({
    address,
    abi: MultiChainStateAggregatorAbi,
    functionName: "getLatestSnapshot",
    args: user ? [user] : undefined,
    query: {
      enabled: !!user,
    },
  });
}

export function useTotalValue(user?: `0x${string}`) {
  const chainId = useChainId();
  const { multiChainStateAggregator: address } = getContractAddresses(chainId);

  return useReadContract({
    address,
    abi: MultiChainStateAggregatorAbi,
    functionName: "getTotalValue",
    args: user ? [user] : undefined,
    query: {
      enabled: !!user,
    },
  });
}

export function useBalance(
  user?: `0x${string}`,
  chainId?: bigint,
  token?: `0x${string}`
) {
  const currentChainId = useChainId();
  const { multiChainStateAggregator: address } = getContractAddresses(currentChainId);

  return useReadContract({
    address,
    abi: MultiChainStateAggregatorAbi,
    functionName: "getBalance",
    args: user && chainId && token ? [user, chainId, token] : undefined,
    query: {
      enabled: !!user && !!chainId && !!token,
    },
  });
}
