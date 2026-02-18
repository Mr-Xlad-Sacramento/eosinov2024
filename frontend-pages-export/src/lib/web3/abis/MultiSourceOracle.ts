export const MultiSourceOracleAbi = [
  {
    type: "function",
    name: "getPrice",
    inputs: [{ name: "asset", type: "address", internalType: "address" }],
    outputs: [
      { name: "price", type: "uint256", internalType: "uint256" },
      { name: "confidence", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getPriceWithSource",
    inputs: [{ name: "asset", type: "address", internalType: "address" }],
    outputs: [
      { name: "price", type: "uint256", internalType: "uint256" },
      { name: "confidence", type: "uint256", internalType: "uint256" },
      { name: "source", type: "uint8", internalType: "uint8" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getOracleStats",
    inputs: [{ name: "asset", type: "address", internalType: "address" }],
    outputs: [
      { name: "pythLazerHits", type: "uint256", internalType: "uint256" },
      { name: "pythHits", type: "uint256", internalType: "uint256" },
      { name: "chainlinkHits", type: "uint256", internalType: "uint256" },
      { name: "twapHits", type: "uint256", internalType: "uint256" },
      { name: "totalQueries", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "paused",
    inputs: [],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
] as const;
