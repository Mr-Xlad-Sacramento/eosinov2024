"use client";

import { useReadContract, useWriteContract, useChainId } from "wagmi";

import { YieldAggregatorAbi } from "@/lib/web3/abis";
import { getContractAddresses } from "@/lib/web3/contracts";

export function useYieldAggregator() {
  const chainId = useChainId();
  const { yieldAggregator: address } = getContractAddresses(chainId);

  const apyQuery = useReadContract({
    address,
    abi: YieldAggregatorAbi,
    functionName: "getCurrentAPY",
  });

  const vaultsQuery = useReadContract({
    address,
    abi: YieldAggregatorAbi,
    functionName: "getAllVaults",
  });

  const ownerQuery = useReadContract({
    address,
    abi: YieldAggregatorAbi,
    functionName: "owner",
  });

  const { writeContract, isPending: isWritePending, error: writeError } = useWriteContract();

  const deposit = (amount: bigint) => {
    writeContract({
      address,
      abi: YieldAggregatorAbi,
      functionName: "deposit",
      args: [amount],
    });
  };

  const withdraw = (shares: bigint) => {
    writeContract({
      address,
      abi: YieldAggregatorAbi,
      functionName: "withdraw",
      args: [shares],
    });
  };

  return {
    currentAPY: apyQuery.data,
    vaults: vaultsQuery.data,
    owner: ownerQuery.data,
    isLoading: apyQuery.isLoading || vaultsQuery.isLoading,
    isError: apyQuery.isError || vaultsQuery.isError,
    error: apyQuery.error ?? vaultsQuery.error,
    deposit,
    withdraw,
    isWritePending,
    writeError,
    refetch: async () => {
      await Promise.all([apyQuery.refetch(), vaultsQuery.refetch()]);
    },
  };
}

export function useYieldConvertToAssets(shares: bigint | undefined) {
  const chainId = useChainId();
  const { yieldAggregator: address } = getContractAddresses(chainId);

  const query = useReadContract({
    address,
    abi: YieldAggregatorAbi,
    functionName: "convertToAssets",
    args: shares !== undefined ? [shares] : undefined,
    query: { enabled: shares !== undefined },
  });

  return {
    assets: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
