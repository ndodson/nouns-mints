"use client";
import "@rainbow-me/rainbowkit/styles.css";
import { http, WagmiProvider } from "wagmi";
import {
    getDefaultConfig,
    RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { base, baseSepolia, Chain } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { coinbaseWallet, walletConnectWallet, rainbowWallet, metaMaskWallet } from '@rainbow-me/rainbowkit/wallets'
import TxProvider from "./TransmissionsProvider";

coinbaseWallet.preference = 'all';

const queryClient = new QueryClient()

const config = getDefaultConfig({
    appName: "Uplink.wtf",
    appUrl: process.env.NEXT_PUBLIC_CLIENT_URL,
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
    chains: [base as Chain, baseSepolia as Chain],
    transports: {
        [base.id]: http(`https://base-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`),
        [baseSepolia.id]: http(`https://base-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`),
    },
    ssr: true,
    wallets: [{
        groupName: "Popular",
        wallets: [coinbaseWallet, metaMaskWallet]
    },
    {
        groupName: "More",
        wallets: [walletConnectWallet, rainbowWallet]
    }
    ],
})

export default function WalletProvider({
    children,
    session,
    refetchInterval,
}: any) {

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider
                    modalSize="compact"
                    initialChain={base}
                // avatar={(user) => <UserAvatar user={user} size={160} styleOverride="flex items-center rounded-full overflow-hidden p-2.5" />}
                >
                    <TxProvider>
                        {children}
                    </TxProvider>
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
