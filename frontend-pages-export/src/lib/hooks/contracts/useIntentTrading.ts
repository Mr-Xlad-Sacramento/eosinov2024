"use client";

import { useReadContract, useWriteContract, useChainId } from "wagmi";

import { IntentBasedTradingAbi } from "@/lib/web3/abis";
import { getContractAddresses } from "@/lib/web3/contracts";

export function useIntentTrading() {
  const chainId = useChainId();
  const { intentBasedTrading: address } = getContractAddresses(chainId);

  const executableQuery = useReadContract({
    address,
    abi: IntentBasedTradingAbi,
    functionName: "getExecutableIntents",
  });

  const { writeContract, isPending: isWritePending, error: writeError } = useWriteContract();

  const createIntent = (
    tokenIn: `0x${string}`,
    tokenOut: `0x${string}`,
    amountIn: bigint,
    minAmountOut: bigint,
    deadline: bigint,
  ) => {
    writeContract({
      address,
      abi: IntentBasedTradingAbi,
      functionName: "createIntent",
      args: [tokenIn, tokenOut, amountIn, minAmountOut, deadline],
    });
  };

  const cancelIntent = (intentId: `0x${string}`) => {
    writeContract({
      address,
      abi: IntentBasedTradingAbi,
      functionName: "cancelIntent",
      args: [intentId],
    });
  };

  return {
    executableIntents: executableQuery.data,
    isLoading: executableQuery.isLoading,
    isError: executableQuery.isError,
    error: executableQuery.error,
    createIntent,
    cancelIntent,
    isWritePending,
    writeError,
    refetch: executableQuery.refetch,
  };
}

export function useIntentDetail(intentId: `0x${string}` | undefined) {
  const chainId = useChainId();
  const { intentBasedTrading: address } = getContractAddresses(chainId);

  const query = useReadContract({
    address,
    abi: IntentBasedTradingAbi,
    functionName: "getIntent",
    args: intentId ? [intentId] : undefined,
    query: { enabled: !!intentId },
  });

  return {
    intent: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
