export const AutoHedgedLPVaultAbi = [
  {
    inputs: [
      { name: "amount0", type: "uint256" },
      { name: "amount1", type: "uint256" },
    ],
    name: "deposit",
    outputs: [{ name: "shares", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "shares", type: "uint256" }],
    name: "withdraw",
    outputs: [
      { name: "amount0", type: "uint256" },
      { name: "amount1", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "rebalance",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "collectFees",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getMetrics",
    outputs: [
      {
        components: [
          { name: "totalLPValue", type: "uint256" },
          { name: "totalHedgeValue", type: "uint256" },
          { name: "netDelta", type: "int256" },
          { name: "apy", type: "uint256" },
          { name: "lpFees24h", type: "uint256" },
          { name: "hedgePnL", type: "int256" },
          { name: "il", type: "uint256" },
        ],
        name: "metrics",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "user", type: "address" }],
    name: "getUserInfo",
    outputs: [
      { name: "shares", type: "uint256" },
      { name: "token0Amount", type: "uint256" },
      { name: "token1Amount", type: "uint256" },
      { name: "valueInToken1", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getPositionInfo",
    outputs: [
      { name: "tokenId", type: "uint256" },
      { name: "liquidity", type: "uint128" },
      { name: "tickLower", type: "int24" },
      { name: "tickUpper", type: "int24" },
      { name: "hedgeSize", type: "int256" },
      { name: "currentDelta", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
