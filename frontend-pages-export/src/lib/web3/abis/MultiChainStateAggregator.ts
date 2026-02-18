export const MultiChainStateAggregatorAbi = [
  {
    inputs: [
      {
        components: [
          { name: "target", type: "address" },
          { name: "allowFailure", type: "bool" },
          { name: "callData", type: "bytes" },
        ],
        name: "calls",
        type: "tuple[]",
      },
    ],
    name: "aggregate3",
    outputs: [
      {
        components: [
          { name: "success", type: "bool" },
          { name: "returnData", type: "bytes" },
        ],
        name: "returnData",
        type: "tuple[]",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { name: "user", type: "address" },
      { name: "tokens", type: "address[][]" },
      { name: "protocols", type: "address[]" },
    ],
    name: "createSnapshot",
    outputs: [
      {
        components: [
          { name: "timestamp", type: "uint256" },
          { name: "totalValueUSD", type: "uint256" },
          {
            components: [
              { name: "chainId", type: "uint256" },
              { name: "token", type: "address" },
              { name: "balance", type: "uint256" },
              { name: "valueUSD", type: "uint256" },
              { name: "symbol", type: "string" },
              { name: "decimals", type: "uint8" },
            ],
            name: "balances",
            type: "tuple[]",
          },
          {
            components: [
              { name: "positionType", type: "uint8" },
              { name: "chainId", type: "uint256" },
              { name: "protocol", type: "address" },
              { name: "tokens", type: "address[]" },
              { name: "amounts", type: "uint256[]" },
              { name: "valueUSD", type: "uint256" },
              { name: "healthFactor", type: "uint256" },
              { name: "apy", type: "uint256" },
            ],
            name: "positions",
            type: "tuple[]",
          },
          { name: "blockNumber", type: "uint256" },
        ],
        name: "snapshot",
        type: "tuple",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "user", type: "address" }],
    name: "getUserSnapshots",
    outputs: [
      {
        components: [
          { name: "timestamp", type: "uint256" },
          { name: "totalValueUSD", type: "uint256" },
          {
            components: [
              { name: "chainId", type: "uint256" },
              { name: "token", type: "address" },
              { name: "balance", type: "uint256" },
              { name: "valueUSD", type: "uint256" },
              { name: "symbol", type: "string" },
              { name: "decimals", type: "uint8" },
            ],
            name: "balances",
            type: "tuple[]",
          },
          {
            components: [
              { name: "positionType", type: "uint8" },
              { name: "chainId", type: "uint256" },
              { name: "protocol", type: "address" },
              { name: "tokens", type: "address[]" },
              { name: "amounts", type: "uint256[]" },
              { name: "valueUSD", type: "uint256" },
              { name: "healthFactor", type: "uint256" },
              { name: "apy", type: "uint256" },
            ],
            name: "positions",
            type: "tuple[]",
          },
          { name: "blockNumber", type: "uint256" },
        ],
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "user", type: "address" }],
    name: "getLatestSnapshot",
    outputs: [
      {
        components: [
          { name: "timestamp", type: "uint256" },
          { name: "totalValueUSD", type: "uint256" },
          {
            components: [
              { name: "chainId", type: "uint256" },
              { name: "token", type: "address" },
              { name: "balance", type: "uint256" },
              { name: "valueUSD", type: "uint256" },
              { name: "symbol", type: "string" },
              { name: "decimals", type: "uint8" },
            ],
            name: "balances",
            type: "tuple[]",
          },
          {
            components: [
              { name: "positionType", type: "uint8" },
              { name: "chainId", type: "uint256" },
              { name: "protocol", type: "address" },
              { name: "tokens", type: "address[]" },
              { name: "amounts", type: "uint256[]" },
              { name: "valueUSD", type: "uint256" },
              { name: "healthFactor", type: "uint256" },
              { name: "apy", type: "uint256" },
            ],
            name: "positions",
            type: "tuple[]",
          },
          { name: "blockNumber", type: "uint256" },
        ],
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "user", type: "address" },
      { name: "chainId", type: "uint256" },
      { name: "token", type: "address" },
    ],
    name: "getBalance",
    outputs: [
      { name: "balance", type: "uint256" },
      { name: "valueUSD", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "user", type: "address" }],
    name: "getTotalValue",
    outputs: [{ name: "totalUSD", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;
