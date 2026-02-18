import { protocolGet, protocolPost } from "./http";
import {
  AccountTieringDto,
  AccountCapabilitiesDto,
  ArbitragePoolDto,
  ArbitragePositionDto,
  AutomationJobDto,
  BatchIntentResponse,
  BondMarketDto,
  BondPositionDto,
  GaslessIntentResponse,
  IntentAccountDto,
  IntentAccountExecutionResult,
  IntentAccountOwnerDto,
  IntentAccountPredictionDto,
  HookConfigDto,
  LiquidityProviderProfileDto,
  PolicyManagerSnapshotDto,
  PolicySnapshotDto,
  PolVaultPositionDto,
  QuickSessionDto,
  RentalAgreementDto,
  RentalOfferDto,
  SessionKeyDto,
  SmartWalletDto,
  TierActionResponse,
  UpdateAccountTieringRequest,
  UpdatePolicySnapshotRequest,
} from "./types";

export const protocolApi = {
  getWallet: (address: string) => protocolGet<SmartWalletDto>(`/api/v1/account/wallet/${address}`),
  getTiering: (address: string) =>
    protocolGet<AccountTieringDto>(`/api/v1/account/tiering/${address}`),
  updateTiering: (payload: UpdateAccountTieringRequest) =>
    protocolPost<AccountTieringDto>("/api/v1/account/tiering/update", payload),
  getPolicy: (address: string) =>
    protocolGet<PolicySnapshotDto>(`/api/v1/account/policy/${address}`),
  updatePolicy: (payload: UpdatePolicySnapshotRequest) =>
    protocolPost<PolicySnapshotDto>("/api/v1/account/policy/update", payload),
  listSessionKeys: (address: string) =>
    protocolGet<SessionKeyDto[]>(`/api/v1/account/session-keys/${address}`),
  createSessionKey: (payload: {
    wallet_address: string;
    permissions: string[];
    ttl_seconds?: number;
  }) => protocolPost<SessionKeyDto>("/api/v1/account/session-keys/create", payload),
  createQuickSession: (payload: {
    wallet_address: string;
    permissions: string[];
    ttl_seconds?: number;
    app?: string;
  }) => protocolPost<QuickSessionDto>("/api/v1/account/session-keys/quick", payload),
  extendSessionKey: (payload: {
    wallet_address: string;
    session_key: string;
    additional_ttl_seconds: number;
  }) => protocolPost<SessionKeyDto>("/api/v1/account/session-keys/extend", payload),
  revokeSessionKey: (payload: { wallet_address: string; session_key: string }) =>
    protocolPost<SessionKeyDto>("/api/v1/account/session-keys/revoke", payload),
  stakeForTier: (payload: { wallet_address: string; amount_standr: number }) =>
    protocolPost<TierActionResponse>("/api/v1/account/tiering/stake", payload),
  unstakeForTier: (payload: { wallet_address: string; amount_standr: number }) =>
    protocolPost<TierActionResponse>("/api/v1/account/tiering/unstake", payload),
  paySubscription: (payload: {
    wallet_address: string;
    payment_token: string;
    amount: number;
    duration_days?: number;
  }) => protocolPost<TierActionResponse>("/api/v1/account/tiering/pay-subscription", payload),
  getCapabilities: (address: string) =>
    protocolGet<AccountCapabilitiesDto>(`/api/v1/account/capabilities/${address}`),
  getPolicyManager: (address: string) =>
    protocolGet<PolicyManagerSnapshotDto>(`/api/v1/account/policy-manager/${address}`),
  createPolicyManager: (payload: { wallet_address: string }) =>
    protocolPost<PolicyManagerSnapshotDto>("/api/v1/account/policy/create", payload),
  setPolicyTimeWindow: (payload: {
    wallet_address: string;
    start_hour: number;
    end_hour: number;
  }) => protocolPost<PolicyManagerSnapshotDto>("/api/v1/account/policy/time-window", payload),
  setPolicyAppPermission: (payload: {
    wallet_address: string;
    app: string;
    allowed: boolean;
    max_notional_usd: number;
  }) =>
    protocolPost<PolicyManagerSnapshotDto>("/api/v1/account/policy/app-permission", payload),
  setPolicyEmergencyPause: (payload: { wallet_address: string; paused: boolean }) =>
    protocolPost<PolicyManagerSnapshotDto>("/api/v1/account/policy/emergency-pause", payload),
  deployIntentAccount: (payload: { owner: string }) =>
    protocolPost<IntentAccountDto>("/api/v1/account/intent-accounts/deploy", payload),
  batchDeployIntentAccounts: (payload: { owners: string[] }) =>
    protocolPost<IntentAccountDto[]>("/api/v1/account/intent-accounts/batch-deploy", payload),
  predictIntentAccountAddress: (owner: string) =>
    protocolGet<IntentAccountPredictionDto>(`/api/v1/account/intent-accounts/predict/${owner}`),
  getIntentAccountOwner: (intentAccount: string) =>
    protocolGet<IntentAccountOwnerDto>(
      `/api/v1/account/intent-accounts/owner/${intentAccount}`,
    ),
  setIntentSessionKeyManager: (payload: {
    owner: string;
    intent_account: string;
    session_key_manager: string;
  }) =>
    protocolPost<IntentAccountDto>(
      "/api/v1/account/intent-accounts/set-session-key-manager",
      payload,
    ),
  setIntentTradingContract: (payload: {
    owner: string;
    intent_account: string;
    intent_trading_contract: string;
  }) =>
    protocolPost<IntentAccountDto>(
      "/api/v1/account/intent-accounts/set-intent-trading",
      payload,
    ),
  executeSwapDirect: (payload: {
    owner: string;
    intent_account: string;
    token_in: string;
    token_out: string;
    amount_in: string;
    min_amount_out: string;
  }) =>
    protocolPost<IntentAccountExecutionResult>(
      "/api/v1/account/intent-accounts/execute-swap-direct",
      payload,
    ),
  executeIntent: (payload: {
    owner: string;
    intent_account: string;
    token_in: string;
    token_out: string;
    amount_in: string;
    min_amount_out: string;
    deadline_unix: number;
  }) =>
    protocolPost<IntentAccountExecutionResult>(
      "/api/v1/account/intent-accounts/execute-intent",
      payload,
    ),
  executeBatchIntent: (payload: {
    owner: string;
    intent_account: string;
    intents: Array<{
      token_in: string;
      token_out: string;
      amount_in: string;
      min_amount_out: string;
      deadline_unix: number;
    }>;
  }) =>
    protocolPost<IntentAccountExecutionResult>(
      "/api/v1/account/intent-accounts/execute-batch-intent",
      payload,
    ),
  submitGaslessIntent: (payload: {
    trader: string;
    token_in: string;
    token_out: string;
    amount_in: string;
    min_amount_out: string;
    deadline_unix: number;
    sponsor?: string;
  }) => protocolPost<GaslessIntentResponse>("/api/v1/account/intents/gasless", payload),
  submitBatchIntents: (payload: {
    trader: string;
    sponsor?: string;
    intents: Array<{
      token_in: string;
      token_out: string;
      amount_in: string;
      min_amount_out: string;
      deadline_unix: number;
    }>;
  }) => protocolPost<BatchIntentResponse>("/api/v1/account/intents/batch", payload),

  listArbitragePools: () => protocolGet<ArbitragePoolDto[]>("/api/v1/modules/arbitrage/pools"),
  listArbitragePositions: (address: string) =>
    protocolGet<ArbitragePositionDto[]>(`/api/v1/modules/arbitrage/positions/${address}`),
  joinArbitragePool: (payload: { wallet_address: string; pool_id: string; amount_usd: number }) =>
    protocolPost<ArbitragePositionDto>("/api/v1/modules/arbitrage/join", payload),
  exitArbitragePool: (payload: { wallet_address: string; pool_id: string }) =>
    protocolPost<ArbitragePositionDto>("/api/v1/modules/arbitrage/exit", payload),

  listAutomationJobs: () => protocolGet<AutomationJobDto[]>("/api/v1/modules/automation/jobs"),
  runAutomationJob: (jobId: string) =>
    protocolPost<AutomationJobDto>(`/api/v1/modules/automation/jobs/${jobId}/run`, {}),

  listBondMarkets: () => protocolGet<BondMarketDto[]>("/api/v1/modules/bonding/markets"),
  listBondPositions: (address: string) =>
    protocolGet<BondPositionDto[]>(`/api/v1/modules/bonding/positions/${address}`),
  buyBond: (payload: { wallet_address: string; market_id: string; amount_usd: number }) =>
    protocolPost<BondPositionDto>("/api/v1/modules/bonding/buy", payload),

  getPolVault: (address: string) =>
    protocolGet<PolVaultPositionDto>(`/api/v1/modules/pol-vault/${address}`),
  depositPolVault: (payload: { wallet_address: string; amount_pol: number }) =>
    protocolPost<PolVaultPositionDto>("/api/v1/modules/pol-vault/deposit", payload),
  withdrawPolVault: (payload: { wallet_address: string; shares: number }) =>
    protocolPost<PolVaultPositionDto>("/api/v1/modules/pol-vault/withdraw", payload),

  listHooks: () => protocolGet<HookConfigDto[]>("/api/v1/modules/hooks/registry"),
  toggleHook: (payload: { hook_id: string; enabled: boolean }) =>
    protocolPost<HookConfigDto>("/api/v1/modules/hooks/registry/toggle", payload),

  getLpProfile: (address: string) =>
    protocolGet<LiquidityProviderProfileDto>(`/api/v1/modules/lp-profiles/${address}`),
  updateLpProfile: (payload: {
    wallet_address: string;
    preferred_pairs: string[];
    fee_rebate_bps: number;
  }) => protocolPost<LiquidityProviderProfileDto>("/api/v1/modules/lp-profiles/update", payload),

  listRentalOffers: () => protocolGet<RentalOfferDto[]>("/api/v1/modules/rental/offers"),
  listRentalAgreements: (address: string) =>
    protocolGet<RentalAgreementDto[]>(`/api/v1/modules/rental/agreements/${address}`),
  rentLiquidity: (payload: {
    wallet_address: string;
    offer_id: string;
    shares: number;
    duration_days: number;
  }) => protocolPost<RentalAgreementDto>("/api/v1/modules/rental/rent", payload),
  returnRental: (payload: { wallet_address: string; agreement_id: string }) =>
    protocolPost<RentalAgreementDto>("/api/v1/modules/rental/return", payload),
};
