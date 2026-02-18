import {
  AchievementDto,
  AdvancedTradingExecuteResponse,
  AdvancedTradingOrderCreatePayload,
  AdvancedTradingOrderListResponse,
  AdvancedTradingOrderResponse,
  AnalyzerHistoryResponse,
  AnalyzerReportResponse,
  AnalyzerTradeExecutionResponse,
  AnalyzerTradeRequestCreatePayload,
  AnalyzerTradeRequestCreateResponse,
  AnalyzerTradeRequestResponse,
  ApyResponse,
  BatchAuctionProofStatus,
  BatchAuctionResult,
  BatchAuctionSubmission,
  BridgeQuoteDto,
  BridgeRouteDto,
  BridgeStatusDto,
  ConvertSharesResponse,
  EstimateLiquidationResponse,
  FundingResponse,
  GamificationProfileDto,
  GovernanceProposalDto,
  TreasuryTransferDto,
  OptionPositionDto,
  OptionQuoteDto,
  OptionSeriesDto,
  PerpsAnalyticsResponse,
  HealthResponse,
  IntentCountResponse,
  IntentDetailResponse,
  IntentDto,
  IntentStatusResponse,
  LiquidityMutationResponse,
  LiquidityPoolDto,
  LiquidityPositionDto,
  AddLiquidityRequest,
  CreateLiquidityPoolRequest,
  RemoveLiquidityRequest,
  TransferLiquidityRequest,
  OverviewResponse,
  PnlResponse,
  PositionDto,
  PositionMutationResponse,
  ProtocolMetricsResponse,
  RiskTierResponse,
  TraderProfileDto,
  TvlResponse,
  VaultDto,
  VaultEligibilityResponse,
  YieldMutationResponse,
  VolumeResponse,
  VoteReceiptDto,
  YieldBalanceResponse,
  ApyHistoryPoint,
  YieldSourceShare,
  VaultModeResult,
  DepositModeResult,
  CrossChainOptimizationResult,
  LeverageLendingResult,
  SwapExactInResult,
  WrapResult,
  ShareValueResponse,
  AutoHedgedMetrics,
  AutoHedgedUserInfo,
  AutoHedgedPositionInfo,
  AutoHedgedMutation,
  Erc4626Preview,
  Erc4626Mutation,
  StrategyDto,
  FollowRelationDto,
  CopyTradeResultDto,
  TraderRegistrationDto,
  SeasonDto,
  SeasonPointsResponse,
  SeasonLeaderboardEntry,
  PointsTriggerResult,
  MempoolDecision,
  PrivateOrderSubmission,
  PrivateOrderExecution,
  MempoolServiceConfig,
  PortfolioSnapshotDto,
  ChainBalanceSnapshot,
  CrossChainPortfolioAggregate3Response,
  TotalValueResponse,
  ChainConfigDto,
  MevCommitRecord,
  MevBidRecord,
  MevWinningBid,
  MevBountyDistribution,
  BasisPositionDto,
  QuoteMatrixResponse,
  PolicyPortableSnapshotDto,
  PolicyPortabilityPayload,
  PolicyImportResultDto,
  ContractAddressesResponse,
  ContractAbiResponse,
  AnomalySignalsResponse,
  EmergencyBundlePreparePayload,
  EmergencyBundlePrepareResponse,
  WiringReport,
} from "@/lib/types/domain";

import { apiGet, apiGetWithFallback, apiPost } from "./client";

export const standrApi = {
  health: () => apiGet<HealthResponse>("/health"),
  metrics: () => apiGet<string>("/metrics"),

  getTvl: () =>
    apiGetWithFallback<TvlResponse>(["/api/v1/analytics/tvl", "/api/analytics/tvl"]),
  getVolume24h: () =>
    apiGetWithFallback<VolumeResponse>([
      "/api/v1/analytics/volume/24h",
      "/api/analytics/volume/24h",
    ]),
  getOverview: () =>
    apiGetWithFallback<OverviewResponse>([
      "/api/v1/analytics/overview",
      "/api/analytics/overview",
    ]),
  getProtocolMetrics: (params?: {
    chain_id?: number;
    asset_class?: string;
    market?: string;
  }) => {
    const query = new URLSearchParams();
    if (params?.chain_id !== undefined) {
      query.set("chain_id", String(params.chain_id));
    }
    if (params?.asset_class) {
      query.set("asset_class", params.asset_class);
    }
    if (params?.market) {
      query.set("market", params.market);
    }
    const suffix = query.toString();
    const path = suffix
      ? `/api/v1/analytics/protocol-metrics?${suffix}`
      : "/api/v1/analytics/protocol-metrics";
    return apiGet<ProtocolMetricsResponse>(path);
  },
  getWiringReport: () =>
    apiGetWithFallback<WiringReport>([
      "/api/v1/analytics/wiring",
      "/api/analytics/wiring",
    ]),

  getPosition: (positionId: string) =>
    apiGetWithFallback<PositionDto>([
      `/api/v1/perps/position/${positionId}`,
      `/api/perps/position/${positionId}`,
    ]),
  getPositions: (address: string) =>
    apiGetWithFallback<PositionDto[]>([
      `/api/v1/perps/positions/${address}`,
      `/api/perps/positions/${address}`,
    ]),
  getPnl: (positionId: string) =>
    apiGetWithFallback<PnlResponse>([
      `/api/v1/perps/pnl/${positionId}`,
      `/api/perps/pnl/${positionId}`,
    ]),
  getFunding: (tokenAddress: string) =>
    apiGetWithFallback<FundingResponse>([
      `/api/v1/perps/funding/${tokenAddress}`,
      `/api/perps/funding/${tokenAddress}`,
    ]),
  estimateLiquidation: (payload: {
    entry_price: number;
    leverage: number;
    side: "LONG" | "SHORT";
    maintenance_margin_bps?: number;
  }) =>
    apiPost<EstimateLiquidationResponse>(
      "/api/v1/perps/estimate-liquidation",
      payload,
    ),
  getRiskTier: (tier: string) =>
    apiGetWithFallback<RiskTierResponse>([
      `/api/v1/perps/risk-tier/${tier}`,
      `/api/perps/risk-tier/${tier}`,
    ]),
  getPerpsAnalytics: (params: { asset: string; window?: string }) => {
    const query = new URLSearchParams();
    query.set("asset", params.asset);
    query.set("window", params.window ?? "24h");
    return apiGet<PerpsAnalyticsResponse>(`/api/v1/perps/analytics?${query.toString()}`);
  },
  openPerpsPosition: (payload: {
    trader: string;
    index_token: string;
    collateral_token: string;
    collateral_amount: string;
    position_size: string;
    side: "LONG" | "SHORT";
    entry_price: number;
  }) => apiPost<PositionMutationResponse>("/api/v1/perps/open", payload),
  closePerpsPosition: (payload: { position_id: string; reduce_bps?: number }) =>
    apiPost<PositionMutationResponse>("/api/v1/perps/close", payload),

  getIntents: (address: string) =>
    apiGetWithFallback<IntentDto[]>([
      `/api/v1/intents/${address}`,
      `/api/intents/${address}`,
    ]),
  getIntentStatus: (intentId: string) =>
    apiGetWithFallback<IntentStatusResponse>([
      `/api/v1/intents/status/${intentId}`,
      `/api/intents/status/${intentId}`,
    ]),
  getIntentDetail: (intentId: string) =>
    apiGetWithFallback<IntentDetailResponse>([
      `/api/v1/intents/detail/${intentId}`,
      `/api/intents/detail/${intentId}`,
    ]),
  getIntentCount: (address: string) =>
    apiGetWithFallback<IntentCountResponse>([
      `/api/v1/intents/count/${address}`,
      `/api/intents/count/${address}`,
    ]),
  createIntent: (payload: {
    trader: string;
    token_in: string;
    token_out: string;
    amount_in: string;
    min_amount_out: string;
    deadline_unix: number;
  }) => apiPost<IntentDto>("/api/v1/intents/create", payload),
  cancelIntent: (payload: { intent_id: string; trader: string }) =>
    apiPost<IntentDto>("/api/v1/intents/cancel", payload),

  getYieldBalance: (address: string) =>
    apiGetWithFallback<YieldBalanceResponse>([
      `/api/v1/yield/balance/${address}`,
      `/api/yield/balance/${address}`,
    ]),
  getApy: () => apiGetWithFallback<ApyResponse>(["/api/v1/yield/apy", "/api/yield/apy"]),
  getVaults: () =>
    apiGetWithFallback<VaultDto[]>(["/api/v1/yield/vaults", "/api/yield/vaults"]),
  convertShares: (shares: number) =>
    apiPost<ConvertSharesResponse>("/api/v1/yield/convert-shares", { shares }),
  getVaultEligibility: () =>
    apiGetWithFallback<VaultEligibilityResponse>([
      "/api/v1/yield/eligibility",
      "/api/yield/eligibility",
    ]),
  depositToYield: (payload: { address: string; vault_address: string; amount: number }) =>
    apiPost<YieldMutationResponse>("/api/v1/yield/deposit", payload),
  withdrawFromYield: (payload: { address: string; shares: number }) =>
    apiPost<YieldMutationResponse>("/api/v1/yield/withdraw", payload),
  getYieldApyHistory: () =>
    apiGetWithFallback<ApyHistoryPoint[]>([
      "/api/v1/yield/analytics/apy-history",
      "/api/yield/analytics/apy-history",
    ]),
  getYieldSourceDistribution: () =>
    apiGetWithFallback<YieldSourceShare[]>([
      "/api/v1/yield/analytics/source-distribution",
      "/api/yield/analytics/source-distribution",
    ]),
  getVaultMode: (address: string) =>
    apiGetWithFallback<{ wallet_address: string; mode: string }>([
      `/api/v1/yield/mode/${address}`,
      `/api/yield/mode/${address}`,
    ]),
  setVaultMode: (payload: { wallet_address: string; mode: string }) =>
    apiPost<VaultModeResult>("/api/v1/yield/mode/set", payload),
  depositWithMode: (payload: { wallet_address: string; amount: number }) =>
    apiPost<DepositModeResult>("/api/v1/yield/deposit-with-mode", payload),
  optimizeCrossChainYield: (payload: {
    wallet_address: string;
    amount: number;
    source_chain_id: number;
  }) => apiPost<CrossChainOptimizationResult>("/api/v1/yield/optimize-cross-chain", payload),
  executeLeverageLending: (payload: {
    wallet_address: string;
    collateral_amount: number;
    recursion_level: number;
  }) => apiPost<LeverageLendingResult>("/api/v1/yield/leverage-lending/execute", payload),
  swapExactInYield: (payload: { token_in: string; token_out: string; amount_in: number }) =>
    apiPost<SwapExactInResult>("/api/v1/yield/swap-exact-in", payload),
  wrapYieldToken: (payload: { wallet_address: string; token: string; amount: number }) =>
    apiPost<WrapResult>("/api/v1/yield/wrap", payload),
  unwrapYieldToken: (payload: { wallet_address: string; vault_token: string; shares: number }) =>
    apiPost<WrapResult>("/api/v1/yield/unwrap", payload),
  getYieldShareValue: (payload: { base_token: string; shares: number }) =>
    apiPost<ShareValueResponse>("/api/v1/yield/share-value", payload),
  getAutoHedgedMetrics: (address: string) =>
    apiGetWithFallback<AutoHedgedMetrics>([
      `/api/v1/yield/auto-hedged/metrics/${address}`,
      `/api/yield/auto-hedged/metrics/${address}`,
    ]),
  getAutoHedgedUserInfo: (address: string) =>
    apiGetWithFallback<AutoHedgedUserInfo>([
      `/api/v1/yield/auto-hedged/user-info/${address}`,
      `/api/yield/auto-hedged/user-info/${address}`,
    ]),
  getAutoHedgedPositionInfo: (address: string) =>
    apiGetWithFallback<AutoHedgedPositionInfo>([
      `/api/v1/yield/auto-hedged/position-info/${address}`,
      `/api/yield/auto-hedged/position-info/${address}`,
    ]),
  autoHedgedDeposit: (payload: { wallet_address: string; amount0: number; amount1: number }) =>
    apiPost<AutoHedgedMutation>("/api/v1/yield/auto-hedged/deposit", payload),
  autoHedgedWithdraw: (payload: { wallet_address: string; shares: number }) =>
    apiPost<AutoHedgedMutation>("/api/v1/yield/auto-hedged/withdraw", payload),
  autoHedgedRebalance: (payload: { wallet_address: string }) =>
    apiPost<AutoHedgedMutation>("/api/v1/yield/auto-hedged/rebalance", payload),
  autoHedgedCollectFees: (payload: { wallet_address: string }) =>
    apiPost<AutoHedgedMutation>("/api/v1/yield/auto-hedged/collect-fees", payload),
  erc4626PreviewDeposit: (payload: { assets: number }) =>
    apiPost<Erc4626Preview>("/api/v1/yield/erc4626/preview-deposit", payload),
  erc4626PreviewMint: (payload: { shares: number }) =>
    apiPost<Erc4626Preview>("/api/v1/yield/erc4626/preview-mint", payload),
  erc4626PreviewWithdraw: (payload: { assets: number }) =>
    apiPost<Erc4626Preview>("/api/v1/yield/erc4626/preview-withdraw", payload),
  erc4626Deposit: (payload: { wallet_address: string; assets: number }) =>
    apiPost<Erc4626Mutation>("/api/v1/yield/erc4626/deposit", payload),
  erc4626Mint: (payload: { wallet_address: string; shares: number }) =>
    apiPost<Erc4626Mutation>("/api/v1/yield/erc4626/mint", payload),
  erc4626Withdraw: (payload: { wallet_address: string; assets: number }) =>
    apiPost<Erc4626Mutation>("/api/v1/yield/erc4626/withdraw", payload),
  erc4626Redeem: (payload: { wallet_address: string; shares: number }) =>
    apiPost<Erc4626Mutation>("/api/v1/yield/erc4626/redeem", payload),
  getLiquidityPools: () =>
    apiGetWithFallback<LiquidityPoolDto[]>([
      "/api/v1/liquidity/pools",
      "/api/liquidity/pools",
    ]),
  getLiquidityPool: (poolId: string) =>
    apiGetWithFallback<LiquidityPoolDto>([
      `/api/v1/liquidity/pools/${poolId}`,
      `/api/liquidity/pools/${poolId}`,
    ]),
  getLiquidityPositions: (address: string) =>
    apiGetWithFallback<LiquidityPositionDto[]>([
      `/api/v1/liquidity/positions/${address}`,
      `/api/liquidity/positions/${address}`,
    ]),
  createLiquidityPool: (payload: CreateLiquidityPoolRequest, idempotencyKey?: string) =>
    apiPost<LiquidityMutationResponse>("/api/v1/liquidity/pools/create", payload, {
      headers: idempotencyKey ? { "x-idempotency-key": idempotencyKey } : undefined,
    }),
  addLiquidity: (payload: AddLiquidityRequest, idempotencyKey?: string) =>
    apiPost<LiquidityMutationResponse>("/api/v1/liquidity/positions/add", payload, {
      headers: idempotencyKey ? { "x-idempotency-key": idempotencyKey } : undefined,
    }),
  removeLiquidity: (payload: RemoveLiquidityRequest, idempotencyKey?: string) =>
    apiPost<LiquidityMutationResponse>("/api/v1/liquidity/positions/remove", payload, {
      headers: idempotencyKey ? { "x-idempotency-key": idempotencyKey } : undefined,
    }),
  transferLiquidity: (payload: TransferLiquidityRequest, idempotencyKey?: string) =>
    apiPost<LiquidityMutationResponse>("/api/v1/liquidity/positions/transfer", payload, {
      headers: idempotencyKey ? { "x-idempotency-key": idempotencyKey } : undefined,
    }),

  getOptionSeries: () =>
    apiGetWithFallback<OptionSeriesDto[]>([
      "/api/v1/options/series",
      "/api/options/series",
    ]),
  getOptionPositions: (address: string) =>
    apiGetWithFallback<OptionPositionDto[]>([
      `/api/v1/options/positions/${address}`,
      `/api/options/positions/${address}`,
    ]),
  getOptionQuote: (payload: { series_id: string; side: "BUY" | "SELL"; size: number }) =>
    apiPost<OptionQuoteDto>("/api/v1/options/quote", payload),
  openOptionPosition: (payload: {
    owner: string;
    series_id: string;
    size: number;
    premium_paid: string;
  }) => apiPost<OptionPositionDto>("/api/v1/options/open", payload),
  closeOptionPosition: (payload: { position_id: string }) =>
    apiPost<OptionPositionDto>("/api/v1/options/close", payload),
  exerciseOptionPosition: (payload: { position_id: string }) =>
    apiPost<OptionPositionDto>("/api/v1/options/exercise", payload),

  getBridgeRoutes: () =>
    apiGetWithFallback<BridgeRouteDto[]>([
      "/api/v1/bridge/routes",
      "/api/bridge/routes",
    ]),
  getBridgeQuote: (payload: {
    source_chain_id: number;
    destination_chain_id: number;
    token_in: string;
    token_out: string;
    amount_in: string;
  }) => apiPost<BridgeQuoteDto>("/api/v1/bridge/quote", payload),
  submitBridgeTransfer: (payload: { route_id: string }) =>
    apiPost<BridgeStatusDto>("/api/v1/bridge/submit", payload),
  getBridgeStatus: (transferId: string) =>
    apiGetWithFallback<BridgeStatusDto>([
      `/api/v1/bridge/status/${transferId}`,
      `/api/bridge/status/${transferId}`,
    ]),
  getBridgeQuoteMatrix: (payload: {
    source_chain_id: number;
    destination_chain_id: number;
    token_in: string;
    token_out: string;
    amount_in: string;
  }) => apiPost<QuoteMatrixResponse>("/api/v1/bridge/quote-matrix", payload),

  getGovernanceProposals: () =>
    apiGetWithFallback<GovernanceProposalDto[]>([
      "/api/v1/governance/proposals",
      "/api/governance/proposals",
    ]),
  getGovernanceProposal: (proposalId: string) =>
    apiGetWithFallback<GovernanceProposalDto>([
      `/api/v1/governance/proposal/${proposalId}`,
      `/api/governance/proposal/${proposalId}`,
    ]),
  createGovernanceProposal: (payload: {
    title: string;
    proposer: string;
    deadline_secs?: number;
  }) => apiPost<GovernanceProposalDto>("/api/v1/governance/proposals/create", payload),
  submitVote: (payload: {
    proposal_id: string;
    voter: string;
    support: boolean;
    vote_power: string;
  }) => apiPost<VoteReceiptDto>("/api/v1/governance/vote", payload),
  getTreasuryTransfers: () =>
    apiGetWithFallback<TreasuryTransferDto[]>([
      "/api/v1/governance/transfers",
      "/api/governance/transfers",
    ]),
  submitBatchAuction: (
    payload: { order_count: number; trader_count: number },
    idempotencyKey?: string,
  ) =>
    apiPost<BatchAuctionSubmission>("/api/v1/batch-auctions/submit", payload, {
      headers: idempotencyKey ? { "x-idempotency-key": idempotencyKey } : undefined,
    }),
  getBatchAuctionResult: (batchId: string) =>
    apiGetWithFallback<BatchAuctionResult>([
      `/api/v1/batch-auctions/result/${batchId}`,
      `/api/batch-auctions/result/${batchId}`,
    ]),
  getBatchAuctionProof: (batchId: string) =>
    apiGetWithFallback<BatchAuctionProofStatus>([
      `/api/v1/batch-auctions/proof/${batchId}`,
      `/api/batch-auctions/proof/${batchId}`,
    ]),

  getSocialLeaderboard: () =>
    apiGetWithFallback<TraderProfileDto[]>([
      "/api/v1/social/leaderboard",
      "/api/social/leaderboard",
    ]),
  getTraderProfile: (address: string) =>
    apiGetWithFallback<TraderProfileDto>([
      `/api/v1/social/profile/${address}`,
      `/api/social/profile/${address}`,
    ]),
  registerTrader: (payload: { trader: string; is_public: boolean }) =>
    apiPost<TraderRegistrationDto>("/api/v1/social/trader/register", payload),
  createStrategy: (payload: {
    trader: string;
    name: string;
    description: string;
    strategy_type: string;
    strategy_data: string;
  }) => apiPost<StrategyDto>("/api/v1/social/strategies/create", payload),
  listStrategies: (trader: string) =>
    apiGetWithFallback<StrategyDto[]>([
      `/api/v1/social/strategies/${trader}`,
      `/api/social/strategies/${trader}`,
    ]),
  followTrader: (payload: {
    follower: string;
    trader: string;
    allocation_bps: number;
    max_allocation: string;
    auto_execute: boolean;
  }) => apiPost<FollowRelationDto>("/api/v1/social/follow", payload),
  unfollowTrader: (payload: { follower: string; trader: string }) =>
    apiPost<FollowRelationDto>("/api/v1/social/unfollow", payload),
  listFollowing: (follower: string) =>
    apiGetWithFallback<FollowRelationDto[]>([
      `/api/v1/social/following/${follower}`,
      `/api/social/following/${follower}`,
    ]),
  copyTrade: (payload: { original_trade_id: string; trader: string; follower: string }) =>
    apiPost<CopyTradeResultDto>("/api/v1/social/copy", payload),
  batchCopyTrade: (payload: {
    original_trade_id: string;
    trader: string;
    followers: string[];
  }) => apiPost<CopyTradeResultDto[]>("/api/v1/social/copy/batch", payload),

  getGamificationProfile: (address: string) =>
    apiGetWithFallback<GamificationProfileDto>([
      `/api/v1/gamification/profile/${address}`,
      `/api/gamification/profile/${address}`,
    ]),
  getAchievements: (address: string) =>
    apiGetWithFallback<AchievementDto[]>([
      `/api/v1/gamification/achievements/${address}`,
      `/api/gamification/achievements/${address}`,
    ]),
  getCurrentSeason: () =>
    apiGetWithFallback<SeasonDto>([
      "/api/v1/gamification/season/current",
      "/api/gamification/season/current",
    ]),
  getSeasonPoints: (address: string) =>
    apiGetWithFallback<SeasonPointsResponse>([
      `/api/v1/gamification/season/points/${address}`,
      `/api/gamification/season/points/${address}`,
    ]),
  getSeasonLeaderboard: (limit?: number) => {
    const suffix = limit ? `?limit=${limit}` : "";
    return apiGetWithFallback<SeasonLeaderboardEntry[]>([
      `/api/v1/gamification/season/leaderboard${suffix}`,
      `/api/gamification/season/leaderboard${suffix}`,
    ]);
  },
  triggerGamificationActivity: (payload: { trader: string; activity: string; weight: number }) =>
    apiPost<PointsTriggerResult>("/api/v1/gamification/trigger", payload),

  setPrivateMempoolOptIn: (payload: {
    user: string;
    opted_in: boolean;
    preferred_type: string;
  }) => apiPost<{ user: string; opted_in: boolean; preferred_type: string }>(
    "/api/v1/cross-chain/private-mempool/opt-in",
    payload,
  ),
  shouldUsePrivateMempool: (payload: { user: string; amount_in: number }) =>
    apiPost<MempoolDecision>("/api/v1/cross-chain/private-mempool/decision", payload),
  submitPrivateOrder: (payload: { user: string; order_id: string; mempool_type: string }) =>
    apiPost<PrivateOrderSubmission>("/api/v1/cross-chain/private-mempool/submit", payload),
  executePrivateOrder: (payload: { private_order_id: string }) =>
    apiPost<PrivateOrderExecution>("/api/v1/cross-chain/private-mempool/execute", payload),
  listPrivateMempoolServices: () =>
    apiGetWithFallback<MempoolServiceConfig[]>([
      "/api/v1/cross-chain/private-mempool/services",
      "/api/cross-chain/private-mempool/services",
    ]),
  setPrivateMempoolService: (payload: {
    mempool_type: string;
    service_address: string;
    enabled: boolean;
  }) =>
    apiPost<MempoolServiceConfig>("/api/v1/cross-chain/private-mempool/services/set", payload),
  createPortfolioSnapshot: (payload: {
    user: string;
    tokens_by_chain: Array<{ chain_id: number; tokens: string[] }>;
  }) => apiPost<PortfolioSnapshotDto>("/api/v1/cross-chain/portfolio/snapshots/create", payload),
  getUserSnapshots: (user: string) =>
    apiGetWithFallback<PortfolioSnapshotDto[]>([
      `/api/v1/cross-chain/portfolio/snapshots/${user}`,
      `/api/cross-chain/portfolio/snapshots/${user}`,
    ]),
  getLatestSnapshot: (user: string) =>
    apiGetWithFallback<PortfolioSnapshotDto>([
      `/api/v1/cross-chain/portfolio/snapshots/latest/${user}`,
      `/api/cross-chain/portfolio/snapshots/latest/${user}`,
    ]),
  getCrossChainBalance: (user: string, chainId: number, token: string) =>
    apiGetWithFallback<ChainBalanceSnapshot>([
      `/api/v1/cross-chain/portfolio/balance/${user}/${chainId}/${token}`,
      `/api/cross-chain/portfolio/balance/${user}/${chainId}/${token}`,
    ]),
  getCrossChainTotalValue: (user: string) =>
    apiGetWithFallback<TotalValueResponse>([
      `/api/v1/cross-chain/portfolio/total-value/${user}`,
      `/api/cross-chain/portfolio/total-value/${user}`,
    ]),
  getCrossChainPortfolioAggregate3: (user: string) => {
    const encodedUser = encodeURIComponent(user);
    return apiGetWithFallback<CrossChainPortfolioAggregate3Response>([
      `/api/v1/cross-chain/portfolio/aggregate3?user=${encodedUser}`,
      `/api/cross-chain/portfolio/aggregate3?user=${encodedUser}`,
    ]);
  },
  listCrossChainChains: () =>
    apiGetWithFallback<ChainConfigDto[]>([
      "/api/v1/cross-chain/chains",
      "/api/cross-chain/chains",
    ]),
  addCrossChainChain: (payload: { chain_id: number; multicall3: string; oracle: string }) =>
    apiPost<ChainConfigDto>("/api/v1/cross-chain/chains/add", payload),

  commitMevBid: (payload: { commitment_hash: string; order_id: string; solver: string }) =>
    apiPost<MevCommitRecord>("/api/v1/mev-bounty/commit-bid", payload),
  revealMevBid: (payload: {
    order_id: string;
    solver: string;
    bid_amount: string;
    estimated_mev: string;
    salt: string;
  }) => apiPost<MevBidRecord>("/api/v1/mev-bounty/reveal-bid", payload),
  getOrderMevBids: (orderId: string) =>
    apiGetWithFallback<MevBidRecord[]>([
      `/api/v1/mev-bounty/bids/${orderId}`,
      `/api/mev-bounty/bids/${orderId}`,
    ]),
  selectMevWinner: (payload: { order_id: string }) =>
    apiPost<MevWinningBid>("/api/v1/mev-bounty/select-winning-bid", payload),
  distributeMevBounty: (payload: { order_id: string; user: string; solver: string }) =>
    apiPost<MevBountyDistribution>("/api/v1/mev-bounty/distribute-bounty", payload),
  createCoinAnalyzerReport: (payload: {
    wallet_address: string;
    symbol_or_pair: string;
    exchange: string;
    trade_type: "spot" | "perps";
    timeframe?: string;
    include_onchain?: boolean;
    include_news?: boolean;
    include_social?: boolean;
  }) => apiPost<AnalyzerReportResponse>("/api/v1/analyzer/coin/report", payload),
  createPredictionAnalyzerReport: (payload: {
    wallet_address: string;
    url: string;
    min_liquidity_usd?: number;
    min_volume_24h_usd?: number;
  }) => apiPost<AnalyzerReportResponse>("/api/v1/analyzer/prediction/report", payload),
  getAnalyzerReport: (analysisId: string) =>
    apiGetWithFallback<AnalyzerReportResponse>([
      `/api/v1/analyzer/reports/${analysisId}`,
      `/api/analyzer/reports/${analysisId}`,
    ]),
  getAnalyzerHistory: (walletAddress: string) =>
    apiGetWithFallback<AnalyzerHistoryResponse>([
      `/api/v1/analyzer/history/${walletAddress}`,
      `/api/analyzer/history/${walletAddress}`,
    ]),
  createAnalyzerTradeRequest: (
    payload: AnalyzerTradeRequestCreatePayload,
    idempotencyKey?: string,
  ) =>
    apiPost<AnalyzerTradeRequestCreateResponse>("/api/v1/analyzer/trade-requests", payload, {
      headers: idempotencyKey ? { "x-idempotency-key": idempotencyKey } : undefined,
    }),
  getAnalyzerTradeRequest: (tradeRequestId: string) =>
    apiGetWithFallback<AnalyzerTradeRequestResponse>([
      `/api/v1/analyzer/trade-requests/${tradeRequestId}`,
      `/api/analyzer/trade-requests/${tradeRequestId}`,
    ]),
  executeAnalyzerTradeRequest: (tradeRequestId: string) =>
    apiPost<AnalyzerTradeExecutionResponse>(
      `/api/v1/analyzer/trade-requests/${tradeRequestId}/execute`,
      {},
    ),
  createAdvancedTradingOrder: (
    payload: AdvancedTradingOrderCreatePayload,
    idempotencyKey?: string,
  ) =>
    apiPost<AdvancedTradingOrderResponse>("/api/v1/trading/advanced/orders", payload, {
      headers: idempotencyKey ? { "x-idempotency-key": idempotencyKey } : undefined,
    }),
  getAdvancedTradingOrder: (orderId: string) =>
    apiGetWithFallback<AdvancedTradingOrderResponse>([
      `/api/v1/trading/advanced/orders/${orderId}`,
      `/api/trading/advanced/orders/${orderId}`,
    ]),
  getAdvancedTradingOrdersForTrader: (trader: string) =>
    apiGetWithFallback<AdvancedTradingOrderListResponse>([
      `/api/v1/trading/advanced/orders/trader/${trader}`,
      `/api/trading/advanced/orders/trader/${trader}`,
    ]),
  executeAdvancedTradingOrder: (orderId: string) =>
    apiPost<AdvancedTradingExecuteResponse>(
      `/api/v1/trading/advanced/orders/${orderId}/execute`,
      {},
    ),
  cancelAdvancedTradingOrder: (orderId: string) =>
    apiPost<AdvancedTradingOrderResponse>(
      `/api/v1/trading/advanced/orders/${orderId}/cancel`,
      {},
    ),

  // Basis strategy
  openBasis: (payload: {
    trader: string;
    spot_token: string;
    perps_token: string;
    amount: string;
    leverage: number;
    idempotency_key: string;
  }) => apiPost<BasisPositionDto>("/api/v1/trading/basis/open", payload),
  closeBasis: (payload: { position_id: string }) =>
    apiPost<BasisPositionDto>("/api/v1/trading/basis/close", payload),
  getBasisPosition: (positionId: string) =>
    apiGet<BasisPositionDto>(`/api/v1/trading/basis/position/${positionId}`),
  getBasisPositions: (address: string) =>
    apiGet<BasisPositionDto[]>(`/api/v1/trading/basis/positions/${address}`),

  // Policy portability
  exportPolicy: (payload: { wallet_address: string; include_controls?: boolean }) =>
    apiPost<PolicyPortableSnapshotDto>("/api/v1/account/policy/export", payload),
  importPolicy: (payload: PolicyPortabilityPayload) =>
    apiPost<PolicyImportResultDto>("/api/v1/account/policy/import", payload),

  // Contracts metadata
  getContractAddresses: () =>
    apiGetWithFallback<ContractAddressesResponse>([
      "/api/v1/contracts/addresses",
      "/api/contracts/addresses",
    ]),
  getContractAbi: (contract: string) =>
    apiGetWithFallback<ContractAbiResponse>([
      `/api/v1/contracts/abi/${encodeURIComponent(contract)}`,
      `/api/contracts/abi/${encodeURIComponent(contract)}`,
    ]),

  // Risk controls
  getRiskAnomalySignals: () =>
    apiGetWithFallback<AnomalySignalsResponse>([
      "/api/v1/risk/anomaly/signals",
      "/api/risk/anomaly/signals",
    ]),
  prepareRiskEmergencyBundle: (payload: EmergencyBundlePreparePayload) =>
    apiPost<EmergencyBundlePrepareResponse>("/api/v1/risk/emergency-bundle/prepare", payload),
};
