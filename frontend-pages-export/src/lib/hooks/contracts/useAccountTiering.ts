"use client";
import { useReadContract, useWriteContract, useChainId } from "wagmi";
import { AccountTieringAbi } from "@/lib/web3/abis";
import { getContractAddresses } from "@/lib/web3/contracts";

export function useAccountTiering() {
  const chainId = useChainId();
  const { accountTiering: address } = getContractAddresses(chainId);

  const { writeContract, isPending, error } = useWriteContract();

  const stakeForTier = (amount: bigint) => {
    writeContract({
      address,
      abi: AccountTieringAbi,
      functionName: "stakeForTier",
      args: [amount],
    });
  };

  const unstake = (amount: bigint) => {
    writeContract({
      address,
      abi: AccountTieringAbi,
      functionName: "unstake",
      args: [amount],
    });
  };

  const paySubscription = (tier: number, months: bigint) => {
    writeContract({
      address,
      abi: AccountTieringAbi,
      functionName: "paySubscription",
      args: [tier, months],
    });
  };

  return {
    stakeForTier,
    unstake,
    paySubscription,
    isPending,
    error,
  };
}

export function useCanPlaceOrder(account?: `0x${string}`) {
  const chainId = useChainId();
  const { accountTiering: address } = getContractAddresses(chainId);

  return useReadContract({
    address,
    abi: AccountTieringAbi,
    functionName: "canPlaceOrder",
    args: account ? [account] : undefined,
    query: {
      enabled: !!account,
    },
  });
}

export function useTierInfo(tier: number) {
  const chainId = useChainId();
  const { accountTiering: address } = getContractAddresses(chainId);

  return useReadContract({
    address,
    abi: AccountTieringAbi,
    functionName: "getTierConfig",
    args: [tier],
  });
}

export function useAccountInfo(account?: `0x${string}`) {
  const chainId = useChainId();
  const { accountTiering: address } = getContractAddresses(chainId);

  return useReadContract({
    address,
    abi: AccountTieringAbi,
    functionName: "getAccount",
    args: account ? [account] : undefined,
    query: {
      enabled: !!account,
    },
  });
}
