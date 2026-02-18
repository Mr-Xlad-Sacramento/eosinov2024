"use client";
import { useReadContract, useWriteContract, useChainId } from "wagmi";
import { PrivateMempoolIntegrationAbi } from "@/lib/web3/abis";
import { getContractAddresses } from "@/lib/web3/contracts";

export function usePrivateMempool() {
  const chainId = useChainId();
  const { privateMempoolIntegration: address } = getContractAddresses(chainId);

  const { writeContract, isPending, error } = useWriteContract();

  const submitToPrivateMempool = (
    orderId: `0x${string}`,
    mempoolType: number
  ) => {
    writeContract({
      address,
      abi: PrivateMempoolIntegrationAbi,
      functionName: "submitToPrivateMempool",
      args: [orderId, mempoolType],
    });
  };

  const executePrivateOrder = (privateOrderId: `0x${string}`) => {
    writeContract({
      address,
      abi: PrivateMempoolIntegrationAbi,
      functionName: "executePrivateOrder",
      args: [privateOrderId],
    });
  };

  return {
    submitToPrivateMempool,
    executePrivateOrder,
    isPending,
    error,
  };
}

export function useShouldUsePrivateMempool(user?: `0x${string}`, amountIn?: bigint) {
  const chainId = useChainId();
  const { privateMempoolIntegration: address } = getContractAddresses(chainId);

  return useReadContract({
    address,
    abi: PrivateMempoolIntegrationAbi,
    functionName: "shouldUsePrivateMempool",
    args: user && amountIn ? [user, amountIn] : undefined,
    query: {
      enabled: !!user && !!amountIn,
    },
  });
}

export function usePrivateOrder(privateOrderId?: `0x${string}`) {
  const chainId = useChainId();
  const { privateMempoolIntegration: address } = getContractAddresses(chainId);

  return useReadContract({
    address,
    abi: PrivateMempoolIntegrationAbi,
    functionName: "getPrivateOrder",
    args: privateOrderId ? [privateOrderId] : undefined,
    query: {
      enabled: !!privateOrderId,
    },
  });
}
