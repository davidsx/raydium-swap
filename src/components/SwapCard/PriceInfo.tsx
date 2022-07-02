import { useConnection } from '@solana/wallet-adapter-react';
import useSwap from 'store/useSwap';
import React from 'react';
import { parseTokenSymbol } from 'utils/display';
import styles from './styles.module.scss';

const PriceInfo: React.FC = () => {
    const { connection } = useConnection();
    const tokenIn = useSwap((s) => s.tokenIn);
    const tokenOut = useSwap((s) => s.tokenOut);
    const executionPrice = useSwap((s) => s.executionPrice);
    const changeDirection = useSwap((s) => s.changeDirection);

    const onChangeDirection = async () => {
        changeDirection();
    };

    return (
        <div className={styles.priceContainer}>
            <div className={styles.price}>
                1 {parseTokenSymbol(tokenIn)} ≈ {executionPrice?.toFixed(6)} {parseTokenSymbol(tokenOut)}
            </div>
            <button className={styles.changeDirectionButton} onClick={onChangeDirection}>
                &#10606;
            </button>
        </div>
    );
};

export default PriceInfo;
