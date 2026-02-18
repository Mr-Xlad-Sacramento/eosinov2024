export const PrivateMempoolIntegrationAbi = [
  {
    inputs: [
      { name: "orderId", type: "bytes32" },
      { name: "mempoolType", type: "uint8" },
    ],
    name: "submitToPrivateMempool",
    outputs: [{ name: "privateOrderId", type: "bytes32" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "privateOrderId", type: "bytes32" }],
    name: "executePrivateOrder",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "user", type: "address" },
      { name: "amountIn", type: "uint256" },
    ],
    name: "shouldUsePrivateMempool",
    outputs: [
      { name: "shouldUse", type: "bool" },
      { name: "recommendedType", type: "uint8" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "privateOrderId", type: "bytes32" }],
    name: "getPrivateOrder",
    outputs: [
      {
        components: [
          { name: "orderId", type: "bytes32" },
          { name: "trader", type: "address" },
          { name: "tokenIn", type: "address" },
          { name: "tokenOut", type: "address" },
          { name: "amountIn", type: "uint256" },
          { name: "minAmountOut", type: "uint256" },
          { name: "commitHash", type: "bytes32" },
          { name: "createdAt", type: "uint256" },
          { name: "mempoolType", type: "uint8" },
          { name: "executed", type: "bool" },
        ],
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
