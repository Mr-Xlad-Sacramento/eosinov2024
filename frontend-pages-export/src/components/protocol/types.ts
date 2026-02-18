export interface AccountTieringDto {
  wallet_address: string;
  tier: number;
  max_notional_usd: number;
  fee_discount_bps: number;
  updated_at: number;
}

export interface PolicySnapshotDto {
  wallet_address: string;
  max_slippage_bps: number;
  daily_notional_limit_usd: number;
  allowed_modes: string[];
  updated_at: number;
}

export interface UpdateAccountTieringRequest {
  wallet_address: string;
  tier: number;
}

export interface UpdatePolicySnapshotRequest {
  wallet_address: string;
  max_slippage_bps: number;
  daily_notional_limit_usd: number;
  allowed_modes?: string[];
}

export interface SessionKeyDto {
  session_key: string;
  permissions: string[];
  expires_at: number;
  active: boolean;
}

export interface SmartWalletDto {
  owner: string;
  smart_wallet: string;
  gas_sponsored_count: number;
  batch_intent_count: number;
  open_session_keys: number;
  last_intent_at: number | null;
}

export interface GaslessIntentResponse {
  intent_id: string;
  sponsored_by: string;
  gas_fee_usd: number;
  status: string;
}

export interface BatchIntentResponse {
  batch_id: string;
  sponsored_by: string;
  created_intent_ids: string[];
  gas_saved_usd: number;
  status: string;
}

export interface TierActionResponse {
  wallet_address: string;
  action: string;
  tier: number;
  max_notional_usd: number;
  fee_discount_bps: number;
  staked_amount_standr: number;
  subscription_paid_until: number | null;
  updated_at: number;
}

export interface AccountCapabilitiesDto {
  wallet_address: string;
  tier: number;
  can_place_order: boolean;
  can_place_batch: boolean;
  has_sequencer_access: boolean;
  source_mode?: string;
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

export interface QuickSessionDto {
  session: SessionKeyDto;
  deep_link: string;
  qr_payload: string;
}

export interface IntentAccountDto {
  owner: string;
  intent_account: string;
  session_key_manager: string | null;
  intent_trading_contract: string | null;
  deployed_at: number;
}

export interface IntentAccountPredictionDto {
  owner: string;
  predicted_intent_account: string;
}

export interface IntentAccountOwnerDto {
  intent_account: string;
  owner: string;
}

export interface IntentAccountExecutionResult {
  execution_id: string;
  owner: string;
  intent_account: string;
  kind: string;
  status: string;
  created_intent_ids: string[];
  tx_ref: string;
}

export interface ArbitragePoolDto {
  pool_id: string;
  token_symbol: string;
  apr_bps: number;
  tvl_usd: number;
  active: boolean;
}

export interface ArbitragePositionDto {
  wallet_address: string;
  pool_id: string;
  shares: number;
  deposited_usd: number;
  estimated_pnl_usd: number;
  updated_at: number;
}

export interface AutomationJobDto {
  job_id: string;
  name: string;
  status: string;
  last_run_unix: number;
  next_run_unix: number;
  success_rate_bps: number;
}

export interface BondMarketDto {
  market_id: string;
  payout_token: string;
  price_usd: number;
  discount_bps: number;
  capacity_usd: number;
  active: boolean;
}

export interface BondPositionDto {
  position_id: string;
  wallet_address: string;
  market_id: string;
  amount_in_usd: number;
  payout_amount: number;
  vesting_end_unix: number;
  created_at: number;
}

export interface PolVaultPositionDto {
  wallet_address: string;
  deposited_pol: number;
  shares: number;
  pending_rewards_pol: number;
  lock_end_unix: number;
  updated_at: number;
}

export interface HookConfigDto {
  hook_id: string;
  name: string;
  scope: string;
  enabled: boolean;
  description: string;
}

export interface LiquidityProviderProfileDto {
  wallet_address: string;
  reputation_score: number;
  total_value_locked_usd: number;
  preferred_pairs: string[];
  fee_rebate_bps: number;
  updated_at: number;
}

export interface RentalOfferDto {
  offer_id: string;
  pool_id: string;
  lender: string;
  available_shares: number;
  rate_bps_per_day: number;
  min_duration_days: number;
  active: boolean;
}

export interface RentalAgreementDto {
  agreement_id: string;
  offer_id: string;
  renter: string;
  shares: number;
  start_unix: number;
  end_unix: number;
  rate_bps_per_day: number;
  status: string;
}
