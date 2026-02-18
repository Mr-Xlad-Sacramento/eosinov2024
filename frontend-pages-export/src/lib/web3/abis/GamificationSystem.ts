export const GamificationSystemAbi = [
  {
    inputs: [{ name: "user", type: "address" }],
    name: "getUserStats",
    outputs: [
      {
        components: [
          { name: "totalPoints", type: "uint256" },
          { name: "seasonPoints", type: "uint256" },
          { name: "level", type: "uint256" },
          { name: "streak", type: "uint256" },
          { name: "lastActiveDay", type: "uint256" },
          { name: "referralCount", type: "uint256" },
          { name: "referrer", type: "address" },
        ],
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "topN", type: "uint256" }],
    name: "getGlobalLeaderboard",
    outputs: [
      {
        components: [
          { name: "user", type: "address" },
          { name: "points", type: "uint256" },
          { name: "rank", type: "uint256" },
        ],
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "topN", type: "uint256" }],
    name: "getSeasonalLeaderboard",
    outputs: [
      {
        components: [
          { name: "user", type: "address" },
          { name: "points", type: "uint256" },
          { name: "rank", type: "uint256" },
        ],
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "currentSeason",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "seasonStartTime",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "seasonDuration",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;
