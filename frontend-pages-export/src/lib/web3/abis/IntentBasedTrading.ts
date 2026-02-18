export const IntentBasedTradingAbi = [
  {
    type: "function",
    name: "createIntent",
    inputs: [
      { name: "tokenIn", type: "address", internalType: "address" },
      { name: "tokenOut", type: "address", internalType: "address" },
      { name: "amountIn", type: "uint256", internalType: "uint256" },
      { name: "minAmountOut", type: "uint256", internalType: "uint256" },
      { name: "deadline", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "intentId", type: "bytes32", internalType: "bytes32" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "cancelIntent",
    inputs: [{ name: "intentId", type: "bytes32", internalType: "bytes32" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getIntent",
    inputs: [{ name: "intentId", type: "bytes32", internalType: "bytes32" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct IntentBasedTrading.Intent",
        components: [
          { name: "trader", type: "address", internalType: "address" },
          { name: "tokenIn", type: "address", internalType: "address" },
          { name: "tokenOut", type: "address", internalType: "address" },
          { name: "amountIn", type: "uint256", internalType: "uint256" },
          { name: "minAmountOut", type: "uint256", internalType: "uint256" },
          { name: "deadline", type: "uint256", internalType: "uint256" },
          { name: "status", type: "uint8", internalType: "enum IntentBasedTrading.IntentStatus" },
          { name: "amountOut", type: "uint256", internalType: "uint256" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getExecutableIntents",
    inputs: [],
    outputs: [{ name: "", type: "bytes32[]", internalType: "bytes32[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "checkConditions",
    inputs: [{ name: "intentId", type: "bytes32", internalType: "bytes32" }],
    outputs: [{ name: "allMet", type: "bool", internalType: "bool" }],
    stateMutability: "nonpayable",
  },
] as const;
