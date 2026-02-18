"use client";
import { useReadContract, useWriteContract, useChainId } from "wagmi";
import { SessionKeyManagerAbi } from "@/lib/web3/abis";
import { getContractAddresses } from "@/lib/web3/contracts";

export function useSessionKeys() {
  const chainId = useChainId();
  const { sessionKeyManager: address } = getContractAddresses(chainId);

  const { writeContract, isPending, error } = useWriteContract();

  const createSessionKey = (
    sessionAddress: `0x${string}`,
    validUntil: bigint,
    permissions: {
      canSwap: boolean;
      canAddLiquidity: boolean;
      canRemoveLiquidity: boolean;
      canBorrow: boolean;
      canRepay: boolean;
      maxAmountPerTx: bigint;
      maxDailyAmount: bigint;
      allowedTokens: `0x${string}`[];
      allowedContracts: `0x${string}`[];
    }
  ) => {
    writeContract({
      address,
      abi: SessionKeyManagerAbi,
      functionName: "createSessionKey",
      args: [sessionAddress, validUntil, permissions],
    });
  };

  const createQuickSession = (
    sessionAddress: `0x${string}`,
    durationSeconds: bigint,
    maxAmountPerTx: bigint
  ) => {
    writeContract({
      address,
      abi: SessionKeyManagerAbi,
      functionName: "createQuickSession",
      args: [sessionAddress, durationSeconds, maxAmountPerTx],
    });
  };

  const revokeSessionKey = (sessionAddress: `0x${string}`) => {
    writeContract({
      address,
      abi: SessionKeyManagerAbi,
      functionName: "revokeSessionKey",
      args: [sessionAddress],
    });
  };

  const extendSession = (sessionAddress: `0x${string}`, newExpiry: bigint) => {
    writeContract({
      address,
      abi: SessionKeyManagerAbi,
      functionName: "extendSession",
      args: [sessionAddress, newExpiry],
    });
  };

  return {
    createSessionKey,
    createQuickSession,
    revokeSessionKey,
    extendSession,
    isPending,
    error,
  };
}

export function useSessionKey(owner?: `0x${string}`, sessionAddress?: `0x${string}`) {
  const chainId = useChainId();
  const { sessionKeyManager: address } = getContractAddresses(chainId);

  return useReadContract({
    address,
    abi: SessionKeyManagerAbi,
    functionName: "getSessionKey",
    args: owner && sessionAddress ? [owner, sessionAddress] : undefined,
    query: {
      enabled: !!owner && !!sessionAddress,
    },
  });
}

export function useOwnerSessions(owner?: `0x${string}`) {
  const chainId = useChainId();
  const { sessionKeyManager: address } = getContractAddresses(chainId);

  return useReadContract({
    address,
    abi: SessionKeyManagerAbi,
    functionName: "getOwnerSessions",
    args: owner ? [owner] : undefined,
    query: {
      enabled: !!owner,
    },
  });
}
