"use client";
import { useReadContract, useWriteContract, useChainId } from "wagmi";
import { AutoHedgedLPVaultAbi } from "@/lib/web3/abis";
import { getContractAddresses } from "@/lib/web3/contracts";

export function useAutoHedgedVault() {
  const chainId = useChainId();
  const { autoHedgedLPVault: address } = getContractAddresses(chainId);

  const { writeContract, isPending, error } = useWriteContract();

  const deposit = (amount0: bigint, amount1: bigint) => {
    writeContract({
      address,
      abi: AutoHedgedLPVaultAbi,
      functionName: "deposit",
      args: [amount0, amount1],
    });
  };

  const withdraw = (shares: bigint) => {
    writeContract({
      address,
      abi: AutoHedgedLPVaultAbi,
      functionName: "withdraw",
      args: [shares],
    });
  };

  const rebalance = () => {
    writeContract({
      address,
      abi: AutoHedgedLPVaultAbi,
      functionName: "rebalance",
    });
  };

  const collectFees = () => {
    writeContract({
      address,
      abi: AutoHedgedLPVaultAbi,
      functionName: "collectFees",
    });
  };

  return {
    deposit,
    withdraw,
    rebalance,
    collectFees,
    isPending,
    error,
  };
}

export function useVaultMetrics() {
  const chainId = useChainId();
  const { autoHedgedLPVault: address } = getContractAddresses(chainId);

  return useReadContract({
    address,
    abi: AutoHedgedLPVaultAbi,
    functionName: "getMetrics",
  });
}

export function useVaultUserInfo(user?: `0x${string}`) {
  const chainId = useChainId();
  const { autoHedgedLPVault: address } = getContractAddresses(chainId);

  return useReadContract({
    address,
    abi: AutoHedgedLPVaultAbi,
    functionName: "getUserInfo",
    args: user ? [user] : undefined,
    query: {
      enabled: !!user,
    },
  });
}
