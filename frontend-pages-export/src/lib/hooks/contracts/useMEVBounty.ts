"use client";
import { useReadContract, useWriteContract, useChainId } from "wagmi";
import { MEVBountyMarketplaceAbi } from "@/lib/web3/abis";
import { getContractAddresses } from "@/lib/web3/contracts";

export function useMEVBounty() {
  const chainId = useChainId();
  const { mevBountyMarketplace: address } = getContractAddresses(chainId);

  const { writeContract, isPending, error } = useWriteContract();

  const commitBid = (commitmentHash: `0x${string}`, orderId: `0x${string}`) => {
    writeContract({
      address,
      abi: MEVBountyMarketplaceAbi,
      functionName: "commitBid",
      args: [commitmentHash, orderId],
    });
  };

  const revealBid = (
    orderId: `0x${string}`,
    bidAmount: bigint,
    estimatedMEV: bigint,
    salt: `0x${string}`,
    executionProof: `0x${string}`
  ) => {
    writeContract({
      address,
      abi: MEVBountyMarketplaceAbi,
      functionName: "revealBid",
      args: [orderId, bidAmount, estimatedMEV, salt, executionProof],
    });
  };

  const depositCollateral = (value: bigint) => {
    writeContract({
      address,
      abi: MEVBountyMarketplaceAbi,
      functionName: "depositSolverCollateral",
      value,
    });
  };

  return {
    commitBid,
    revealBid,
    depositCollateral,
    isPending,
    error,
  };
}

export function useOrderBids(orderId?: `0x${string}`) {
  const chainId = useChainId();
  const { mevBountyMarketplace: address } = getContractAddresses(chainId);

  return useReadContract({
    address,
    abi: MEVBountyMarketplaceAbi,
    functionName: "getOrderBids",
    args: orderId ? [orderId] : undefined,
    query: {
      enabled: !!orderId,
    },
  });
}

export function useSolverStats(solver?: `0x${string}`) {
  const chainId = useChainId();
  const { mevBountyMarketplace: address } = getContractAddresses(chainId);

  return useReadContract({
    address,
    abi: MEVBountyMarketplaceAbi,
    functionName: "getSolverStats",
    args: solver ? [solver] : undefined,
    query: {
      enabled: !!solver,
    },
  });
}
