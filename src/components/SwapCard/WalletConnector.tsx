import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import Image from 'next/image';
import React, { useEffect } from 'react';
import useSwap from 'store/useSwap';
import { Numberish } from 'types';
import { RAY, WSOL } from 'utils/constants';
import { getTokenAccountsByOwner } from 'utils/swap';
import styles from './styles.module.scss';

const PHANTOM = new PhantomWalletAdapter();

const WalletConnector: React.FC = () => {
    const { connection } = useConnection();
    const { connected, publicKey, wallet, select, connect, disconnect } = useWallet();

    useEffect(() => {
        if (publicKey !== null && connected && connection) {
            let solBalance: Numberish = 0;
            // let wsolBalance: Numberish = 0;
            let rayBalance: Numberish = 0;

            connection.getBalance(publicKey).then((balance) => {
                solBalance = balance / LAMPORTS_PER_SOL;
            });

            getTokenAccountsByOwner(connection, publicKey).then((tokenAccounts) => {
                const rayTokenAccount = tokenAccounts.find((account) => {
                    return account.accountInfo.mint.toBase58() === RAY.mint;
                });

                if (rayTokenAccount) {
                    connection.getTokenAccountBalance(rayTokenAccount.pubkey).then((accBalance) => {
                        rayBalance = accBalance.value.uiAmount || 0;
                    });
                }

                const wsolTokenAccount = tokenAccounts.find((account) => {
                    return account.accountInfo.mint.toBase58() === WSOL.mint;
                });

                // if (wsolTokenAccount) {
                //     connection.getTokenAccountBalance(wsolTokenAccount.pubkey).then((accBalance) => {
                //         wsolBalance = accBalance.value.uiAmount || 0;
                //     });
                // }

                useSwap.setState({ rayBalance, solBalance });
            });
        }
    }, [connected, connection, publicKey]);

    const onConnect = () => {
        if (wallet) connect();
        else select(PHANTOM.name);
    };

    const onDisconnect = () => {
        disconnect();
    };

    return (
        <div className={styles.walletContainer}>
            <div className={styles.wallet}>{connected ? publicKey?.toBase58() : 'Connect wallet'}</div>
            <button className={styles.walletConnectButton} onClick={connected ? onDisconnect : onConnect}>
                <Image src={PHANTOM.icon || ''} objectFit="contain" objectPosition="center" layout="fill" alt={PHANTOM.name || ''} />
            </button>
        </div>
    );
};

export default WalletConnector;
