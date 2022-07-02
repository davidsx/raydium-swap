import useSwap from 'store/useSwap';
import React from 'react';
import { SLIPPAGE } from 'utils/constants';
import styles from './styles.module.scss';

const SwapInfo: React.FC = () => {
    const priceImpact = useSwap((s) => s.priceImpact);

    return (
        <div className={styles.infoContainer}>
            <span>Max slippage: {SLIPPAGE.numerator.toNumber()}%</span>
            <span>Price impact: {priceImpact?.toFixed(6) || '-'}%</span>
        </div>
    );
};

export default SwapInfo;
