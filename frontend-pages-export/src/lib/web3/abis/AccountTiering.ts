export const AccountTieringAbi = [
  {
    inputs: [{ name: "amount", type: "uint256" }],
    name: "stakeForTier",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "amount", type: "uint256" }],
    name: "unstake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "tier", type: "uint8" },
      { name: "months", type: "uint256" },
    ],
    name: "paySubscription",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "account", type: "address" }],
    name: "canPlaceOrder",
    outputs: [{ name: "canPlace", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "account", type: "address" },
      { name: "batchSize", type: "uint256" },
    ],
    name: "canPlaceBatch",
    outputs: [{ name: "allowed", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "tier", type: "uint8" }],
    name: "getTierConfig",
    outputs: [
      {
        components: [
          { name: "monthlyFeeUSD", type: "uint256" },
          { name: "stakeRequirement", type: "uint256" },
          { name: "feeDiscountBps", type: "uint16" },
          { name: "rateLimit", type: "uint32" },
          { name: "batchLimit", type: "uint32" },
          { name: "latencyPriorityMs", type: "uint16" },
          { name: "allowsDirectSequencer", type: "bool" },
          { name: "allowsColocation", type: "bool" },
        ],
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "account", type: "address" }],
    name: "getAccount",
    outputs: [
      {
        components: [
          { name: "tier", type: "uint8" },
          { name: "stakedAmount", type: "uint256" },
          { name: "subscriptionExpiry", type: "uint256" },
          { name: "totalVolume", type: "uint256" },
          { name: "totalFeesPaid", type: "uint256" },
          { name: "orderCount", type: "uint32" },
          { name: "lastOrderTimestamp", type: "uint32" },
          { name: "isWhitelisted", type: "bool" },
          { name: "isBanned", type: "bool" },
        ],
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
