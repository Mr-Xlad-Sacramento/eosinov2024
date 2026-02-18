"use client";

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import { mainnet, polygon, arbitrum, base } from "@reown/appkit/networks";
import { cookieToInitialState, WagmiProvider, type Config } from "wagmi";

import { wagmiAdapter, projectId } from "@/lib/web3/config";

const metadata = {
  name: "STANDR DEX",
  description:
    "Intent-first DeFAI workspace — AI analysis, spot & perps trading, yield vaults, cross-chain settlement.",
  url: typeof window !== "undefined" ? window.location.origin : "https://standr.dex",
  icons: ["/standr-icon.svg"],
};

createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [mainnet, polygon, arbitrum, base],
  defaultNetwork: polygon,
  metadata,
  features: {
    analytics: true,
    email: true,
    socials: ["google", "x", "discord", "apple"],
    emailShowWallets: true,
  },
  themeMode: "dark",
  themeVariables: {
    "--w3m-accent": "#c86a2f",
    "--w3m-border-radius-master": "2px",
  },
});

export function Providers({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies?: string | null;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchOnMount: false,
            retryOnMount: false,
            staleTime: 60_000,
            gcTime: 10 * 60_000,
            retry: 0,
          },
        },
      }),
  );

  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig as Config,
    cookies ?? null,
  );

  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig as Config}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
