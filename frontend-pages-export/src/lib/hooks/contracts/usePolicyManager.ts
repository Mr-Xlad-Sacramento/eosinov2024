"use client";
import { useReadContract, useWriteContract, useChainId } from "wagmi";
import { PolicyManagerAbi } from "@/lib/web3/abis";
import { getContractAddresses } from "@/lib/web3/contracts";

export function usePolicyManager() {
  const chainId = useChainId();
  const { policyManager: address } = getContractAddresses(chainId);

  const { writeContract, isPending, error } = useWriteContract();

  const createPolicy = (
    name: string,
    dailyLimit: bigint,
    weeklyLimit: bigint,
    monthlyLimit: bigint,
    perTxLimit: bigint
  ) => {
    writeContract({
      address,
      abi: PolicyManagerAbi,
      functionName: "createPolicy",
      args: [name, dailyLimit, weeklyLimit, monthlyLimit, perTxLimit],
    });
  };

  const setTimeWindow = (
    startHour: bigint,
    endHour: bigint,
    allowedDays: boolean[]
  ) => {
    writeContract({
      address,
      abi: PolicyManagerAbi,
      functionName: "setTimeWindow",
      args: [startHour, endHour, allowedDays],
    });
  };

  const setAppPermission = (
    app: `0x${string}`,
    canTransfer: boolean,
    canApprove: boolean,
    maxAmount: bigint,
    allowedTokens: `0x${string}`[]
  ) => {
    writeContract({
      address,
      abi: PolicyManagerAbi,
      functionName: "setAppPermission",
      args: [app, canTransfer, canApprove, maxAmount, allowedTokens],
    });
  };

  const emergencyPause = () => {
    writeContract({
      address,
      abi: PolicyManagerAbi,
      functionName: "emergencyPause",
    });
  };

  return {
    createPolicy,
    setTimeWindow,
    setAppPermission,
    emergencyPause,
    isPending,
    error,
  };
}

export function usePolicy(account?: `0x${string}`) {
  const chainId = useChainId();
  const { policyManager: address } = getContractAddresses(chainId);

  return useReadContract({
    address,
    abi: PolicyManagerAbi,
    functionName: "getPolicy",
    args: account ? [account] : undefined,
    query: {
      enabled: !!account,
    },
  });
}

export function useSpendingStats(account?: `0x${string}`) {
  const chainId = useChainId();
  const { policyManager: address } = getContractAddresses(chainId);

  return useReadContract({
    address,
    abi: PolicyManagerAbi,
    functionName: "getSpendingStats",
    args: account ? [account] : undefined,
    query: {
      enabled: !!account,
    },
  });
}
