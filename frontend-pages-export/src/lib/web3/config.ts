import { cookieStorage, createStorage, http } from "wagmi";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { mainnet, polygon, arbitrum, base } from "@reown/appkit/networks";

export const projectId =
  process.env.NEXT_PUBLIC_REOWN_PROJECT_ID ?? "demo-project-id";

export const networks = [mainnet, polygon, arbitrum, base];

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
  transports: {
    [mainnet.id]: http(
      process.env.NEXT_PUBLIC_MAINNET_RPC ?? "https://rpc.ankr.com/eth",
    ),
    [polygon.id]: http(
      process.env.NEXT_PUBLIC_POLYGON_RPC ?? "https://polygon-rpc.com",
    ),
    [arbitrum.id]: http(
      process.env.NEXT_PUBLIC_ARBITRUM_RPC ?? "https://arb1.arbitrum.io/rpc",
    ),
    [base.id]: http(
      process.env.NEXT_PUBLIC_BASE_RPC ?? "https://mainnet.base.org",
    ),
  },
});

export const wagmiConfig = wagmiAdapter.wagmiConfig;
