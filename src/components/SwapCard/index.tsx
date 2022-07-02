import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import useSwap from 'store/useSwap';
import { useEffect, useMemo } from 'react';
import { isMeaningfulNumber } from 'utils/compare';
import PriceInfo from './PriceInfo';
import styles from './styles.module.scss';
import SwapInfo from './SwapInfo';
import TokenAmountInput from './TokenAmountInput';
import WalletConnector from './WalletConnector';
import { toToken, toTokenAmount } from 'utils/web3';
import useNoti from 'store/useNoti';

const SwapCard: React.FC = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const sendSuccessNoti = useNoti((s) => s.sendSuccessNoti);
    const sendErrorNoti = useNoti((s) => s.sendErrorNoti);

    const tokenIn = useSwap((s) => s.tokenIn);
    const rawAmountIn = useSwap((s) => s.rawAmountIn);
    const calculatePriceInfo = useSwap((s) => s.calculatePriceInfo);
    const createTransaction = useSwap((s) => s.createTransaction);
    const checkWalletHasEnoughBalance = useSwap((s) => s.checkWalletHasEnoughBalance);
    const refreshSwap = useSwap((s) => s.refreshSwap);
    const refreshCount = useSwap((s) => s.refreshCount);

    const checkWalletHasEnoughTokenInBalance = useMemo(
        () => rawAmountIn && checkWalletHasEnoughBalance(toTokenAmount(toToken(tokenIn), rawAmountIn)),
        [checkWalletHasEnoughBalance, rawAmountIn, tokenIn]
    );

    useEffect(() => {
        if (refreshCount >= 0) calculatePriceInfo(connection);
    }, [calculatePriceInfo, connection, refreshCount]);

    useEffect(() => {
        const interval = setInterval(refreshSwap, 10000);
        return () => clearInterval(interval);
    }, [refreshSwap]);

    const onSwap = async () => {
        if (publicKey) {
            const { transaction, signers } = await createTransaction(connection, publicKey);
            try {
                const txid = await sendTransaction(transaction, connection, { signers, skipPreflight: true });
                if (txid) {
                    sendSuccessNoti('swap', `Swap completed. Check the transaction here: https://solscan.io/tx/${txid}`);
                }
            } catch (e) {
                sendErrorNoti(e as Error);
            }
        }
    };

    return (
        <div className={styles.body}>
            <div className={styles.container}>
                <WalletConnector />
                <TokenAmountInput side="in" />
                <PriceInfo />
                <TokenAmountInput side="out" />
                <button className={styles.swapButton} onClick={onSwap} disabled={!isMeaningfulNumber(rawAmountIn) || !checkWalletHasEnoughBalance}>
                    {isMeaningfulNumber(rawAmountIn) ? (checkWalletHasEnoughTokenInBalance ? 'Swap now' : 'Insufficient amount') : 'Invalid amount'}
                </button>
                <SwapInfo />
            </div>
        </div>
    );
};

export default SwapCard;
