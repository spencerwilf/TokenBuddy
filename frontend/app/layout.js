"use client"

import { sepolia } from "wagmi/chains";
import { WagmiConfig, createConfig } from "wagmi";
import { ConnectKitProvider, ConnectKitButton, getDefaultConfig } from "connectkit";

const alchemyId = process.env.ALCHEMY_API_KEY;
const walletConnectProjectId = process.env.WALLETCONNECT_PROJECT_ID;

const chains = [sepolia];


const config = createConfig(
  getDefaultConfig({
    alchemyId: '8ng3YjP1FzF4q3eOhjRVjOfQZ8CULkRO',
    walletConnectProjectId: '8f2f1116de01979e2141cfd6a002c47e',
    chains,
    appName: "TokenBuddy",
  }),
);

export default function RootLayout({ children }) {
  return (
      <WagmiConfig config={config}>
      <ConnectKitProvider theme="retro" chains={chains}>
    <html lang="en">
     <link rel="preconnect" href="https://fonts.googleapis.com"></link>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin></link>
<link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet"></link>
      <body>{children}</body>
    </html>
    </ConnectKitProvider>
    </WagmiConfig>
  )
}
