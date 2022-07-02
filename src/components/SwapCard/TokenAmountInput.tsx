import useSwap from 'store/useSwap';
import Image from 'next/image';
import React, { useMemo } from 'react';
import { WSOL } from 'utils/constants';
import { parseTokenSymbol } from 'utils/display';
import { toFraction } from 'utils/numberish';
import styles from './styles.module.scss';

interface Props {
    side: 'in' | 'out';
}

const TokenAmountInput: React.FC<Props> = ({ side }) => {
    const solBalance = useSwap((s) => s.solBalance);
    const rayBalance = useSwap((s) => s.rayBalance);
    const tokenIn = useSwap((s) => s.tokenIn);
    const tokenOut = useSwap((s) => s.tokenOut);
    const rawAmountIn = useSwap((s) => s.rawAmountIn);
    const rawAmountOut = useSwap((s) => s.rawAmountOut);
    const refreshSwap = useSwap((s) => s.refreshSwap);

    const token = useMemo(() => (side === 'in' ? tokenIn : tokenOut), [side, tokenIn, tokenOut]);
    const rawAmount = useMemo(() => (side === 'in' ? rawAmountIn : rawAmountOut), [rawAmountIn, rawAmountOut, side]);
    const tokenBalance = useMemo(
        () => (token.mint === WSOL.mint ? toFraction(solBalance).toFixed(6) : toFraction(rayBalance).toFixed(6)),
        [rayBalance, solBalance, token.mint]
    );

    const onChange: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
        if (side === 'in') {
            useSwap.setState({ rawAmountIn: e.currentTarget.value });
            refreshSwap();
        }
    };

    return (
        <div className={styles.tokenContainer}>
            <div className={styles.icon}>
                <Image src={token.icon || ''} objectFit="contain" objectPosition="center" layout="fill" alt={token.name} />
            </div>
            <div className={styles.symbol}>{parseTokenSymbol(token)}</div>
            <div className={styles.inputContainer}>
                <div className={styles.balance}>Remaining: {tokenBalance}</div>
                <input className={styles.input} value={rawAmount || ''} placeholder="0" onChange={onChange} />
            </div>
        </div>
    );
};

export default TokenAmountInput;
