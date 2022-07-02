import 'styles/globals.css';
import '@solana/wallet-adapter-react-ui/styles.css';
import type { AppProps } from 'next/app';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { useMemo } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { clusterApiUrl } from '@solana/web3.js';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';

const network = WalletAdapterNetwork.Mainnet;

function MyApp({ Component, pageProps }: AppProps) {
    const endpoint = useMemo(() => clusterApiUrl(network), []);
    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            // new SolflareWalletAdapter(),
            // new SolletWalletAdapter(),
            // new SlopeWalletAdapter(),
            // new BitpieWalletAdapter(),
            // new HuobiWalletAdapter(),
            // new GlowWalletAdapter(),
        ],
        []
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} localStorageKey="davidsx" autoConnect>
                <WalletModalProvider>
                    <Component {...pageProps} />
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}

export default MyApp;
