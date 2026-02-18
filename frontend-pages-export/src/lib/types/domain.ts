export interface PositionDto {
  position_id: string;
  trader: string;
  index_token: string;
  collateral_token: string;
  collateral_amount: string;
  position_size: string;
  side: string;
  status: string;
}

export interface PositionMutationResponse extends PositionDto {
  tx_hash?: string | null;
  mined?: boolean | null;
  source_mode?: "simulation" | "onchain";
}

export interface IntentDto {
  intent_id: string;
  trader: string;
  token_in: string;
  token_out: string;
  amount_in: string;
  min_amount_out: string;
  status: string;
}

export interface VaultDto {
  name: string;
  vault_address: string;
  strategy: string;
  apy_bps: number;
  risk_tier: number;
}

export interface LiquidityPoolDto {
  pool_id: string;
  name: string;
  token0_symbol: string;
  token1_symbol: string;
  token0_address: string;
  token1_address: string;
  apr_bps: number;
  tvl_usd: number;
  volume_24h_usd: number;
  active: boolean;
  source: string;
  created_at: number;
  updated_at: number;
  total_shares: number;
}

export interface LiquidityPositionDto {
  position_id: string;
  wallet_address: string;
  pool_id: string;
  shares: number;
  deposited_usd: number;
  current_value_usd: number;
  fees_earned_usd: number;
  created_at: number;
  updated_at: number;
}

export interface CreateLiquidityPoolRequest {
  wallet_address: string;
  token0_symbol: string;
  token1_symbol: string;
  token0_address: string;
  token1_address: string;
  apr_bps?: number;
}

export interface AddLiquidityRequest {
  wallet_address: string;
  pool_id: string;
  amount_usd: number;
}

export interface RemoveLiquidityRequest {
  wallet_address: string;
  pool_id: string;
  shares: number;
}

export interface TransferLiquidityRequest {
  from_wallet_address: string;
  to_wallet_address: string;
  pool_id: string;
  shares: number;
}

export interface LiquidityMutationResponse {
  pool: LiquidityPoolDto;
  position: LiquidityPositionDto;
  idempotent: boolean;
  message: string;
}

export interface RewardDto {
  reward_token: string;
  pending_amount: string;
}

export interface BridgeTransferDto {
  transfer_id: string;
  source_chain_id: number;
  destination_chain_id: number;
  status: string;
}

export interface BridgeRouteDto {
  route_id: string;
  bridge: string;
  priority: number;
  healthy: boolean;
}

export interface BridgeQuoteDto {
  route_id: string;
  source_chain_id: number;
  destination_chain_id: number;
  token_in: string;
  token_out: string;
  amount_in: string;
  estimated_amount_out: string;
  bridge: string;
  eta_seconds: number;
}

export interface BridgeStatusDto {
  transfer_id: string;
  status: string;
  source_tx: string;
  destination_tx: string | null;
  confirmations_required: number;
  confirmations_current: number;
  source_mode?: string;
}

export interface ContractAddressEntry {
  name: string;
  address: string | null;
  configured: boolean;
}

export interface ContractAddressesResponse {
  contracts: ContractAddressEntry[];
  configured_count: number;
  total_count: number;
  source_mode: string;
}

export interface ContractAbiResponse {
  contract: string;
  abi: unknown;
  source_mode: string;
}

export interface QuoteMatrixRoute {
  route_id: string;
  provider: string;
  estimated_amount_out: string;
  cost_estimate_usd: string;
  eta_seconds: number;
  priority: number;
  healthy: boolean;
}

export interface QuoteMatrixResponse {
  source_chain_id: number;
  destination_chain_id: number;
  token_in: string;
  token_out: string;
  amount_in: string;
  routes: QuoteMatrixRoute[];
  best_route_id: string | null;
}

export interface GovernanceActionDto {
  action_id: string;
  kind: string;
  status: string;
}

export interface GovernanceProposalDto {
  proposal_id: string;
  title: string;
  state: string;
  for_votes: string;
  against_votes: string;
  deadline_unix: number;
}

export interface VoteReceiptDto {
  proposal_id: string;
  voter: string;
  support: boolean;
  vote_power: string;
  tx_hash: string;
}

export interface TreasuryTransferDto {
  transfer_id: string;
  token: string;
  to: string;
  amount: string;
  status: string;
  execute_after_unix: number;
}

export interface OptionSeriesDto {
  series_id: string;
  underlying: string;
  option_type: string;
  strike_price: string;
  expiry_unix: number;
  status: string;
}

export interface OptionPositionDto {
  position_id: string;
  owner: string;
  series_id: string;
  size: string;
  premium_paid: string;
  state: string;
}

export interface OptionQuoteDto {
  series_id: string;
  side: string;
  size: string;
  premium_bps: number;
  estimated_cost: string;
}

export interface TraderProfileDto {
  trader: string;
  pnl_30d: string;
  win_rate_bps: number;
  volume_30d: string;
}

export interface GamificationProfileDto {
  trader: string;
  level: number;
  xp: number;
  streak_days: number;
}

export interface AchievementDto {
  code: string;
  title: string;
  unlocked: boolean;
}

export interface RiskAlertDto {
  level: string;
  message: string;
  created_at: string;
}

export interface VaultEligibility {
  strategy: string;
  tier: number;
  perps_margin_allowed: boolean;
  capped_margin_bps: number;
  notes: string;
}

export interface GatewayStatus {
  requests_total: number;
  requests_per_minute: number;
  started_at: string;
  uptime_secs?: number;
  request_count?: number;
}

export interface HealthResponse {
  status: string;
  chain_id: number;
  rpc_url: string;
  artifact_contracts_loaded: number;
  configured_contract_addresses?: number;
  wiring_verified_count?: number;
  wiring_missing_count?: number;
  gateway: GatewayStatus;
}

export interface IntentStatusResponse {
  status: string;
  executable: boolean;
}

export interface IntentDetailResponse {
  intent: IntentDto | null;
  preview: {
    executable: boolean;
    route_hops: string[];
    estimated_output: string;
    gas_units: number;
  };
}

export interface IntentCountResponse {
  count: number;
}

export interface PnlResponse {
  pnl: string;
  pnl_percentage: number;
  source_mode?: "simulation" | "onchain";
}

export interface ApiSourceMeta {
  source_mode: "simulation" | "onchain";
  chain_id?: number;
  as_of?: number;
}

export interface FundingResponse {
  current_rate_bps_per_hour: number;
  normalized_rate_bps_per_hour?: number;
  long_oi: string;
  short_oi: string;
  raw?: {
    index_token: string;
    current_rate: string;
    previous_rate: string;
    last_update_time: number;
    last_significant_update: number;
  } | null;
  source_mode?: "simulation" | "onchain";
}

export interface EstimateLiquidationResponse {
  liquidation_price: number;
  inputs?: {
    entry_price: number;
    leverage: number;
    leverage_bps: number;
    maintenance_margin_bps: number;
    initial_margin_ratio: number;
    maintenance_margin_ratio: number;
    liquidation_threshold_ratio: number;
  };
  source_mode?: "simulation" | "onchain";
}

export interface RiskTierResponse {
  tier: string;
  max_leverage: number;
  maintenance_margin_bps: number;
  source_mode?: "simulation" | "onchain";
}

export interface YieldBalanceResponse {
  balance: string;
  rewards: RewardDto[];
}

export interface ApyResponse {
  apy_bps: number;
}

export interface ConvertSharesResponse {
  value: number;
}

export interface VaultEligibilityResponse {
  policies: VaultEligibility[];
  default_margin_vault: VaultEligibility | null;
}

export interface YieldMutationResponse {
  balance: string;
  shares: number;
  value: number;
  vault_address: string | null;
}

export interface TvlResponse {
  tvl: string;
  currency: string;
  cached: boolean;
  breakdown?: {
    perps_tvl: string;
    yield_tvl: string;
    total_tvl: string;
  };
  source_mode?: "simulation" | "onchain";
}

export interface VolumeResponse {
  volume: string;
  currency: string;
  period: string;
  cached: boolean;
  methodology?: {
    description: string;
    source: string;
  };
  source_mode?: "simulation" | "onchain";
}

export interface ProtocolMetricsResponse extends ApiSourceMeta {
  tvl: string;
  daily_volume: string;
  open_interest: string;
  funding_rates: Array<{
    market: string;
    current_rate_bps_per_hour: number;
  }>;
  fee_stats: {
    maker_fees_24h_usd: string | null;
    taker_fees_24h_usd: string | null;
    unavailable_reason: string | null;
  };
  filters: {
    chain_id: number | null;
    asset_class: string | null;
    market: string | null;
  };
}

export interface PerpsAnalyticsResponse extends ApiSourceMeta {
  asset: string;
  window: string;
  avg_leverage_x: number;
  funding_rate_bps_per_hour: number;
  long_oi: string;
  short_oi: string;
  total_notional_24h: string;
  aggregated_pnl: {
    value: string | null;
    unavailable_reason: string | null;
  };
}

export interface OverviewResponse {
  network: {
    chain_id: number;
    latest_block: number;
    connected_peers: number;
    synced: boolean;
    gas_price_gwei: string;
    timestamp: number;
  };
  oracle: {
    healthy: boolean;
    stale_feeds: number;
    stale_threshold_secs: number;
    checked_at: string;
  };
  proof: BatchAuctionProofStatus;
  known_contracts: string[];
  bridge_transfers: BridgeTransferDto[];
  governance_actions: GovernanceActionDto[];
  risk_alerts: RiskAlertDto[];
}

export interface BatchAuctionSubmission {
  batch_id: string;
  status: string;
  order_count: number;
  trader_count: number;
  submitted_at: number;
  idempotency_key: string | null;
}

export interface BatchAuctionResult {
  batch_id: string;
  status: string;
  clearing_price: string;
  matched_orders: number;
  total_input: string;
  total_output: string;
  updated_at: number;
}

export interface BatchAuctionProofStatus {
  batch_id: string;
  proof_ready: boolean;
  prover_online: boolean;
  proof_hash: string | null;
  state: string;
  updated_at: number;
}

export interface AnalyzerModelOutput {
  model: string;
  recommendation: string;
  confidence: number;
  risk_level: string;
  summary: string;
  key_factors: string[];
  sources: string[];
}

export interface AnalyzerProviderExecution {
  provider: string;
  success: boolean;
  output: AnalyzerModelOutput | null;
  error: string | null;
}

export interface AnalyzerReportPayload {
  analysis_id: string;
  kind: "coin" | "prediction";
  status: string;
  symbol_or_pair?: string;
  exchange?: string;
  trade_type?: "spot" | "perps";
  platform?: string;
  market_title?: string;
  market_status?: string;
  liquidity_usd?: number;
  volume_24h_usd?: number;
  source_url?: string;
  summary: string;
  recommendation: string;
  confidence: number;
  risk_level: string;
  key_factors: string[];
  used_fallback: boolean;
  warnings: string[];
  models: AnalyzerProviderExecution[];
  created_at: number;
}

export interface AnalyzerReportResponse {
  analysis_id: string;
  status: string;
  report: AnalyzerReportPayload;
  store_backend?: string;
}

export interface AnalyzerHistoryItem {
  analysis_id: string;
  kind: "coin" | "prediction";
  platform: string | null;
  symbol_or_pair: string | null;
  trade_type: "spot" | "perps" | null;
  source_url: string | null;
  status: string;
  created_at: number;
  updated_at: number;
}

export interface AnalyzerHistoryResponse {
  wallet_address: string;
  count: number;
  reports: AnalyzerHistoryItem[];
}

export interface AnalyzerTradeRequestCreatePayload {
  analysis_id: string;
  wallet_address: string;
  trade_type: "spot" | "perps";
  collateral_source: "wallet" | "vault";
  selected_vault_strategy: string | null;
  risk_disclaimer_accepted: boolean;
  execution_payload: Record<string, unknown>;
}

export interface AnalyzerTradeRequestCreateResponse {
  trade_request_id: string;
  status: string;
  analysis_id: string;
  expires_at: number;
  idempotent: boolean;
}

export interface AnalyzerTradeRequestResponse {
  trade_request_id: string;
  analysis_id: string;
  wallet_address: string;
  trade_type: "spot" | "perps";
  status: string;
  collateral_source: "wallet" | "vault";
  selected_vault_strategy: string | null;
  execution: Record<string, unknown> | null;
  expires_at: number;
  created_at: number;
  updated_at: number;
}

export interface AnalyzerTradeExecutionResponse {
  trade_request_id: string;
  status: string;
  execution?: Record<string, unknown>;
  idempotent: boolean;
  message?: string;
}

export type AdvancedTradingMode = "limit" | "dca" | "multi";

export interface AdvancedTradingOrderCreatePayload {
  trader: string;
  mode: AdvancedTradingMode;
  summary?: string;
  payload: Record<string, unknown>;
}

export interface AdvancedTradingOrderResponse {
  order_id: string;
  trader: string;
  mode: AdvancedTradingMode;
  status: string;
  summary: string;
  payload: Record<string, unknown>;
  execution: Record<string, unknown> | null;
  warnings: string[];
  created_at: number;
  updated_at: number;
  idempotent: boolean;
}

export interface AdvancedTradingOrderListResponse {
  trader: string;
  count: number;
  orders: AdvancedTradingOrderResponse[];
}

export interface AdvancedTradingExecuteResponse {
  order_id: string;
  status: string;
  mode: AdvancedTradingMode;
  execution: Record<string, unknown> | null;
  warnings: string[];
  idempotent: boolean;
}

export interface GovernanceProposalsResponse {
  proposals: GovernanceProposalDto[];
}

export interface GovernanceTransfersResponse {
  transfers: TreasuryTransferDto[];
}

export interface ApyHistoryPoint {
  timestamp: number;
  apy_bps: number;
}

export interface YieldSourceShare {
  source: string;
  weight_bps: number;
}

export interface VaultModeResult {
  wallet_address: string;
  mode: string;
  updated_at: number;
}

export interface DepositModeResult {
  wallet_address: string;
  mode: string;
  amount: number;
  shares: number;
  route: string;
}

export interface CrossChainOptimizationResult {
  wallet_address: string;
  amount: number;
  source_chain_id: number;
  destination_chain_id: number;
  estimated_net_gain_bps: number;
}

export interface LeverageLendingResult {
  wallet_address: string;
  collateral_amount: number;
  recursion_level: number;
  effective_apy_bps: number;
  borrowed_amount: number;
}

export interface SwapExactInResult {
  token_in: string;
  token_out: string;
  amount_in: number;
  amount_out: number;
  route: string;
}

export interface WrapResult {
  wallet_address: string;
  base_token: string;
  vault_token: string;
  amount: number;
  shares: number;
}

export interface ShareValueResponse {
  value: number;
}

export interface AutoHedgedMetrics {
  total_lp_value: number;
  total_hedge_value: number;
  net_delta_bps: number;
  apy_bps: number;
  lp_fees_24h: number;
  hedge_pnl: number;
}

export interface AutoHedgedUserInfo {
  wallet_address: string;
  shares: number;
  token0_amount: number;
  token1_amount: number;
  value_in_token1: number;
}

export interface AutoHedgedPositionInfo {
  token_id: number;
  liquidity: number;
  tick_lower: number;
  tick_upper: number;
  hedge_size: number;
  current_delta_bps: number;
}

export interface AutoHedgedMutation {
  wallet_address: string;
  shares: number;
  amount0: number;
  amount1: number;
  tx_ref: string;
  status: string;
}

export interface Erc4626Preview {
  assets: number;
  shares: number;
}

export interface Erc4626Mutation {
  wallet_address: string;
  assets: number;
  shares: number;
  status: string;
}

export interface StrategyDto {
  strategy_id: string;
  creator: string;
  name: string;
  description: string;
  strategy_type: string;
  strategy_data: string;
  total_executions: number;
  successful_executions: number;
  total_volume: string;
  is_active: boolean;
  created_at: number;
}

export interface FollowRelationDto {
  follower: string;
  trader: string;
  allocation_bps: number;
  max_allocation: string;
  auto_execute: boolean;
  is_active: boolean;
  followed_at: number;
}

export interface CopyTradeResultDto {
  copied_trade_id: string;
  original_trade_id: string;
  trader: string;
  follower: string;
  copied_amount: string;
  status: string;
  created_at: number;
}

export interface TraderRegistrationDto {
  trader: string;
  is_public: boolean;
  followers: number;
  performance_score: number;
}

export interface SeasonDto {
  season_id: string;
  name: string;
  start_unix: number;
  end_unix: number;
  active: boolean;
}

export interface SeasonPointsResponse {
  trader: string;
  season_points: number;
}

export interface SeasonLeaderboardEntry {
  trader: string;
  points: number;
  rank: number;
  streak_days: number;
}

export interface PointsTriggerResult {
  trader: string;
  activity: string;
  points_awarded: number;
  season_points: number;
  total_xp: number;
}

export interface MempoolDecision {
  should_use: boolean;
  recommended_type: string;
}

export interface PrivateOrderSubmission {
  private_order_id: string;
  order_id: string;
  trader: string;
  mempool_type: string;
  status: string;
  created_at: number;
}

export interface PrivateOrderExecution {
  private_order_id: string;
  status: string;
  executed_amount_out: string;
  executed_at: number;
}

export interface MempoolServiceConfig {
  mempool_type: string;
  service_address: string;
  enabled: boolean;
}

export interface ChainBalanceSnapshot {
  chain_id: number;
  token: string;
  balance: string;
  value_usd: string;
}

export interface PortfolioSnapshotDto {
  snapshot_id: string;
  user: string;
  timestamp: number;
  total_value_usd: string;
  balances: ChainBalanceSnapshot[];
}

export interface TotalValueResponse {
  user: string;
  total_value_usd: string;
}

export interface ChainConfigDto {
  chain_id: number;
  multicall3: string;
  oracle: string;
}

export interface CrossChainPortfolioAggregate3Call {
  target: string;
  success: boolean;
  return_data: string;
}

export interface CrossChainPortfolioAggregate3Response {
  user: string;
  snapshot_id: string | null;
  total_value_usd: string;
  calls: CrossChainPortfolioAggregate3Call[];
  generated_at: number;
}

export interface PrivateMempoolSettingsState {
  user: string;
  opted_in: boolean;
  preferred_type: string;
}

export interface PolicyPortabilityPayload {
  wallet_address: string;
  snapshot: PolicyPortableSnapshotDto;
  merge_controls?: boolean;
}

export interface OracleHealthSnapshot {
  healthy: boolean;
  stale_feeds: number;
  stale_threshold_secs: number;
  checked_at: string;
}

export interface MevCommitRecord {
  commitment_hash: string;
  order_id: string;
  solver: string;
  committed_at: number;
}

export interface MevBidRecord {
  bid_id: string;
  order_id: string;
  solver: string;
  bid_amount: string;
  estimated_mev: string;
  status: string;
  created_at: number;
}

export interface MevWinningBid {
  order_id: string;
  bid_id: string;
  solver: string;
  bid_amount: string;
  selected_at: number;
}

export interface MevBountyDistribution {
  order_id: string;
  user: string;
  solver: string;
  user_payment: string;
  protocol_fee: string;
  status: string;
  distributed_at: number;
}

export interface BasisPositionDto {
  position_id: string;
  trader: string;
  spot_token: string;
  perps_token: string;
  spot_size: string;
  perps_size: string;
  spot_entry_price: string;
  perps_entry_price: string;
  leverage: number;
  status: string;
  source_mode: string;
  idempotency_key: string;
  created_at: number;
}

export interface WsEnvelope {
  type: string;
  channel: "prices" | "orders" | "fills" | "liquidations" | "funding" | "blocks";
  data: unknown;
  timestamp: number;
}

export type WiringValidationStatus =
  | "verified"
  | "missing_contract_artifact"
  | "missing_function_signature"
  | "route_missing"
  | "route_present_simulation";

export interface WiringValidation {
  status: WiringValidationStatus;
  route_exists: boolean;
  contract_artifact_exists: boolean;
  function_signature_exists: boolean;
}

export interface WiringBinding {
  feature_key: string;
  domain: string;
  backend_route: string;
  backend_method: string;
  contract_name: string;
  function_signature: string;
  required_for_demo: boolean;
  supports_onchain_execution: boolean;
  validation: WiringValidation;
}

export interface WiringReport {
  generated_at: number;
  execution_mode: "simulation" | "onchain" | string;
  verified_count: number;
  missing_count: number;
  bindings: WiringBinding[];
}

export interface PolicySnapshotDto {
  wallet_address: string;
  max_slippage_bps: number;
  daily_notional_limit_usd: number;
  allowed_modes: string[];
  updated_at: number;
}

export interface AppPermissionDto {
  app: string;
  allowed: boolean;
  max_notional_usd: number;
}

export interface PolicyManagerSnapshotDto {
  wallet_address: string;
  time_window_start_hour: number;
  time_window_end_hour: number;
  app_permissions: AppPermissionDto[];
  emergency_paused: boolean;
  updated_at: number;
}

export interface PolicyPortableSnapshotDto {
  schema_version: string;
  exported_at: number;
  wallet_address: string;
  policy: PolicySnapshotDto;
  policy_manager: PolicyManagerSnapshotDto | null;
  source_mode: string;
}

export interface PolicyImportResultDto {
  wallet_address: string;
  policy: PolicySnapshotDto;
  policy_manager: PolicyManagerSnapshotDto;
  imported_at: number;
  source_mode: string;
}

export interface AnomalySignalDto {
  signal_id: string;
  level: string;
  component: string;
  message: string;
  detected_at: number;
}

export interface AnomalySignalsResponse {
  signals: AnomalySignalDto[];
  source_mode: string;
}

export interface EmergencyBundlePreparePayload {
  trigger: string;
  severity?: string;
  include_components?: string[];
}

export interface EmergencyBundlePrepareResponse {
  bundle_id: string;
  trigger: string;
  severity: string;
  prepared_actions: string[];
  included_components: string[];
  requires_multisig: boolean;
  prepared_at: number;
  source_mode: string;
}
