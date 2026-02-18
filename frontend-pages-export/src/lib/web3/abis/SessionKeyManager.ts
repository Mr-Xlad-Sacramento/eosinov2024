export const SessionKeyManagerAbi = [
  {
    inputs: [
      { name: "sessionAddress", type: "address" },
      { name: "validUntil", type: "uint256" },
      {
        components: [
          { name: "canSwap", type: "bool" },
          { name: "canAddLiquidity", type: "bool" },
          { name: "canRemoveLiquidity", type: "bool" },
          { name: "canBorrow", type: "bool" },
          { name: "canRepay", type: "bool" },
          { name: "maxAmountPerTx", type: "uint256" },
          { name: "maxDailyAmount", type: "uint256" },
          { name: "allowedTokens", type: "address[]" },
          { name: "allowedContracts", type: "address[]" },
        ],
        name: "permissions",
        type: "tuple",
      },
    ],
    name: "createSessionKey",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "sessionAddress", type: "address" },
      { name: "durationSeconds", type: "uint256" },
      { name: "maxAmountPerTx", type: "uint256" },
    ],
    name: "createQuickSession",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "sessionAddress", type: "address" }],
    name: "revokeSessionKey",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "sessionAddress", type: "address" },
      { name: "newExpiry", type: "uint256" },
    ],
    name: "extendSession",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "owner", type: "address" },
      { name: "sessionAddress", type: "address" },
    ],
    name: "getSessionKey",
    outputs: [
      {
        components: [
          { name: "sessionAddress", type: "address" },
          { name: "owner", type: "address" },
          { name: "validUntil", type: "uint256" },
          { name: "isActive", type: "bool" },
          {
            components: [
              { name: "canSwap", type: "bool" },
              { name: "canAddLiquidity", type: "bool" },
              { name: "canRemoveLiquidity", type: "bool" },
              { name: "canBorrow", type: "bool" },
              { name: "canRepay", type: "bool" },
              { name: "maxAmountPerTx", type: "uint256" },
              { name: "maxDailyAmount", type: "uint256" },
              { name: "allowedTokens", type: "address[]" },
              { name: "allowedContracts", type: "address[]" },
            ],
            name: "permissions",
            type: "tuple",
          },
          {
            components: [
              { name: "transactionCount", type: "uint256" },
              { name: "totalVolume", type: "uint256" },
              { name: "dailyVolume", type: "uint256" },
              { name: "lastResetTime", type: "uint256" },
              { name: "lastUsedTime", type: "uint256" },
            ],
            name: "stats",
            type: "tuple",
          },
        ],
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "owner", type: "address" }],
    name: "getOwnerSessions",
    outputs: [{ name: "", type: "address[]" }],
    stateMutability: "view",
    type: "function",
  },
] as const;
