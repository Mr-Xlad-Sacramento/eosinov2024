export const MEVBountyMarketplaceAbi = [
  {
    inputs: [
      { name: "commitmentHash", type: "bytes32" },
      { name: "orderId", type: "bytes32" },
    ],
    name: "commitBid",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "orderId", type: "bytes32" },
      { name: "bidAmount", type: "uint256" },
      { name: "estimatedMEV", type: "uint256" },
      { name: "salt", type: "bytes32" },
      { name: "executionProof", type: "bytes" },
    ],
    name: "revealBid",
    outputs: [{ name: "bidId", type: "bytes32" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ name: "orderId", type: "bytes32" }],
    name: "selectWinningBid",
    outputs: [
      { name: "winningSolver", type: "address" },
      { name: "bidAmount", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "orderId", type: "bytes32" },
      { name: "user", type: "address" },
      { name: "solver", type: "address" },
    ],
    name: "distributeMEVBounty",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "depositSolverCollateral",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ name: "orderId", type: "bytes32" }],
    name: "getOrderBids",
    outputs: [
      {
        components: [
          { name: "bidId", type: "bytes32" },
          { name: "orderId", type: "bytes32" },
          { name: "solver", type: "address" },
          { name: "bidAmount", type: "uint256" },
          { name: "estimatedMEV", type: "uint256" },
          { name: "userSharePct", type: "uint256" },
          { name: "timestamp", type: "uint256" },
          { name: "expiry", type: "uint256" },
          { name: "status", type: "uint8" },
          { name: "executionProof", type: "bytes" },
        ],
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "solver", type: "address" }],
    name: "getSolverStats",
    outputs: [
      {
        components: [
          { name: "solver", type: "address" },
          { name: "totalBids", type: "uint256" },
          { name: "bidsWon", type: "uint256" },
          { name: "totalMEVPaid", type: "uint256" },
          { name: "totalMEVCaptured", type: "uint256" },
          { name: "reputationScore", type: "uint256" },
          { name: "isActive", type: "bool" },
          { name: "isBlacklisted", type: "bool" },
        ],
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
