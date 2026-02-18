"use client";
import { useReadContract, useWriteContract, useChainId } from "wagmi";
import { SecureERC4626VaultAbi } from "@/lib/web3/abis";
import { getContractAddresses } from "@/lib/web3/contracts";

export function useSecureVault() {
  const chainId = useChainId();
  const { secureERC4626Vault: address } = getContractAddresses(chainId);

  const { writeContract, isPending, error } = useWriteContract();

  const deposit = (assets: bigint, receiver: `0x${string}`) => {
    writeContract({
      address,
      abi: SecureERC4626VaultAbi,
      functionName: "deposit",
      args: [assets, receiver],
    });
  };

  const withdraw = (
    assets: bigint,
    receiver: `0x${string}`,
    owner: `0x${string}`
  ) => {
    writeContract({
      address,
      abi: SecureERC4626VaultAbi,
      functionName: "withdraw",
      args: [assets, receiver, owner],
    });
  };

  const redeem = (
    shares: bigint,
    receiver: `0x${string}`,
    owner: `0x${string}`
  ) => {
    writeContract({
      address,
      abi: SecureERC4626VaultAbi,
      functionName: "redeem",
      args: [shares, receiver, owner],
    });
  };

  return {
    deposit,
    withdraw,
    redeem,
    isPending,
    error,
  };
}

export function usePreviewDeposit(assets: bigint) {
  const chainId = useChainId();
  const { secureERC4626Vault: address } = getContractAddresses(chainId);

  return useReadContract({
    address,
    abi: SecureERC4626VaultAbi,
    functionName: "previewDeposit",
    args: [assets],
    query: {
      enabled: assets > BigInt(0),
    },
  });
}

export function usePreviewWithdraw(assets: bigint) {
  const chainId = useChainId();
  const { secureERC4626Vault: address } = getContractAddresses(chainId);

  return useReadContract({
    address,
    abi: SecureERC4626VaultAbi,
    functionName: "previewWithdraw",
    args: [assets],
    query: {
      enabled: assets > BigInt(0),
    },
  });
}

export function useVaultBalance(owner?: `0x${string}`) {
  const chainId = useChainId();
  const { secureERC4626Vault: address } = getContractAddresses(chainId);

  return useReadContract({
    address,
    abi: SecureERC4626VaultAbi,
    functionName: "balanceOf",
    args: owner ? [owner] : undefined,
    query: {
      enabled: !!owner,
    },
  });
}
