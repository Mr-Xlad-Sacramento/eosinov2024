import { type Address } from "viem";
import { arbitrum, polygon } from "wagmi/chains";

type ContractAddresses = {
  standRCore: Address;
  intentBasedTrading: Address;
  standRPerpsCore: Address;
  yieldAggregator: Address;
  multiSourceOracle: Address;
  accountTiering: Address;
  sessionKeyManager: Address;
  policyManager: Address;
  socialTradingModule: Address;
  mevBountyMarketplace: Address;
  gamificationSystem: Address;
  multiChainStateAggregator: Address;
  autoHedgedLPVault: Address;
  secureERC4626Vault: Address;
  privateMempoolIntegration: Address;
};

/**
 * Contract addresses per chain. Placeholders until deployment.
 * Override with NEXT_PUBLIC_<CONTRACT>_ADDRESS env vars if set.
 */
const addressesByChain: Record<number, ContractAddresses> = {
  [polygon.id]: {
    standRCore: "0x0000000000000000000000000000000000000001",
    intentBasedTrading: "0x0000000000000000000000000000000000000002",
    standRPerpsCore: "0x0000000000000000000000000000000000000003",
    yieldAggregator: "0x0000000000000000000000000000000000000004",
    multiSourceOracle: "0x0000000000000000000000000000000000000005",
    accountTiering: "0x0000000000000000000000000000000000000006",
    sessionKeyManager: "0x0000000000000000000000000000000000000007",
    policyManager: "0x0000000000000000000000000000000000000008",
    socialTradingModule: "0x0000000000000000000000000000000000000009",
    mevBountyMarketplace: "0x000000000000000000000000000000000000000A",
    gamificationSystem: "0x000000000000000000000000000000000000000B",
    multiChainStateAggregator: "0x000000000000000000000000000000000000000C",
    autoHedgedLPVault: "0x000000000000000000000000000000000000000D",
    secureERC4626Vault: "0x000000000000000000000000000000000000000E",
    privateMempoolIntegration: "0x000000000000000000000000000000000000000F",
  },
  [arbitrum.id]: {
    standRCore: "0x0000000000000000000000000000000000000001",
    intentBasedTrading: "0x0000000000000000000000000000000000000002",
    standRPerpsCore: "0x0000000000000000000000000000000000000003",
    yieldAggregator: "0x0000000000000000000000000000000000000004",
    multiSourceOracle: "0x0000000000000000000000000000000000000005",
    accountTiering: "0x0000000000000000000000000000000000000006",
    sessionKeyManager: "0x0000000000000000000000000000000000000007",
    policyManager: "0x0000000000000000000000000000000000000008",
    socialTradingModule: "0x0000000000000000000000000000000000000009",
    mevBountyMarketplace: "0x000000000000000000000000000000000000000A",
    gamificationSystem: "0x000000000000000000000000000000000000000B",
    multiChainStateAggregator: "0x000000000000000000000000000000000000000C",
    autoHedgedLPVault: "0x000000000000000000000000000000000000000D",
    secureERC4626Vault: "0x000000000000000000000000000000000000000E",
    privateMempoolIntegration: "0x000000000000000000000000000000000000000F",
  },
};

function env(key: string): Address | undefined {
  const value = process.env[key];
  return value ? (value as Address) : undefined;
}

export function getContractAddresses(chainId: number): ContractAddresses {
  const defaults = addressesByChain[chainId] ?? addressesByChain[polygon.id];
  return {
    standRCore:
      env("NEXT_PUBLIC_STANDR_CORE_ADDRESS") ?? defaults.standRCore,
    intentBasedTrading:
      env("NEXT_PUBLIC_INTENT_TRADING_ADDRESS") ?? defaults.intentBasedTrading,
    standRPerpsCore:
      env("NEXT_PUBLIC_PERPS_CORE_ADDRESS") ?? defaults.standRPerpsCore,
    yieldAggregator:
      env("NEXT_PUBLIC_YIELD_AGGREGATOR_ADDRESS") ?? defaults.yieldAggregator,
    multiSourceOracle:
      env("NEXT_PUBLIC_MULTI_SOURCE_ORACLE_ADDRESS") ?? defaults.multiSourceOracle,
    accountTiering:
      env("NEXT_PUBLIC_ACCOUNT_TIERING_ADDRESS") ?? defaults.accountTiering,
    sessionKeyManager:
      env("NEXT_PUBLIC_SESSION_KEY_MANAGER_ADDRESS") ?? defaults.sessionKeyManager,
    policyManager:
      env("NEXT_PUBLIC_POLICY_MANAGER_ADDRESS") ?? defaults.policyManager,
    socialTradingModule:
      env("NEXT_PUBLIC_SOCIAL_TRADING_MODULE_ADDRESS") ?? defaults.socialTradingModule,
    mevBountyMarketplace:
      env("NEXT_PUBLIC_MEV_BOUNTY_MARKETPLACE_ADDRESS") ?? defaults.mevBountyMarketplace,
    gamificationSystem:
      env("NEXT_PUBLIC_GAMIFICATION_SYSTEM_ADDRESS") ?? defaults.gamificationSystem,
    multiChainStateAggregator:
      env("NEXT_PUBLIC_MULTI_CHAIN_STATE_AGGREGATOR_ADDRESS") ?? defaults.multiChainStateAggregator,
    autoHedgedLPVault:
      env("NEXT_PUBLIC_AUTO_HEDGED_LP_VAULT_ADDRESS") ?? defaults.autoHedgedLPVault,
    secureERC4626Vault:
      env("NEXT_PUBLIC_SECURE_ERC4626_VAULT_ADDRESS") ?? defaults.secureERC4626Vault,
    privateMempoolIntegration:
      env("NEXT_PUBLIC_PRIVATE_MEMPOOL_INTEGRATION_ADDRESS") ?? defaults.privateMempoolIntegration,
  };
}
