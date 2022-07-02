import { gte, isMeaningfulNumber } from 'utils/compare';
import { Percent, Price, SplTokenInfo, TokenAmount } from '@raydium-io/raydium-sdk';
import { Connection, PublicKey } from '@solana/web3.js';
import { RAY, WSOL } from 'utils/constants';
import { computeAmountOut, createSwapTransaction } from 'utils/swap';
import create from 'zustand';
import { Numberish } from 'types';
import { toToken, toTokenAmount } from 'utils/web3';
import { assertion } from 'utils/common';
import { add } from 'utils/operation';

export type SwapStore = {
    tokenIn: SplTokenInfo & { icon: string };
    tokenOut: SplTokenInfo & { icon: string };
    changeDirection: () => void;

    rawAmountIn: string;
    rawAmountOut: string;
    priceImpact: Percent | undefined;
    executionPrice: Price | null;
    calculatePriceInfo: (connection: Connection) => Promise<void>;

    solBalance: Numberish;
    // wsolBalance: Numberish;
    rayBalance: Numberish;

    checkWalletHasEnoughBalance: (tokenAmount: TokenAmount) => boolean;

    createTransaction: (connection: Connection, publicKey: PublicKey) => ReturnType<typeof createSwapTransaction>;

    refreshCount: number;
    refreshSwap: () => void;
};

const useSwap = create<SwapStore>((set, get) => ({
    tokenIn: WSOL,
    tokenOut: RAY,
    changeDirection() {
        const { tokenIn, tokenOut } = get();
        set({ tokenIn: tokenOut, tokenOut: tokenIn });
    },

    rawAmountIn: '',
    rawAmountOut: '',
    priceImpact: undefined,
    executionPrice: null,
    calculatePriceInfo: async (connection) => {
        const { tokenIn, tokenOut, rawAmountIn } = get();
        const currencyIn = toToken(tokenIn);
        const currencyOut = toToken(tokenOut);
        if (isMeaningfulNumber(rawAmountIn)) {
            const amountIn = toTokenAmount(currencyIn, rawAmountIn, { alreadyDecimaled: true });
            const result = await computeAmountOut(connection, amountIn, currencyOut);
            set({ priceImpact: result?.priceImpact, rawAmountOut: result?.amountOut.toExact(), executionPrice: result?.executionPrice });
        } else {
            const amountIn = toTokenAmount(currencyIn, 1, { alreadyDecimaled: true });
            const result = await computeAmountOut(connection, amountIn, currencyOut);
            set({ priceImpact: undefined, rawAmountOut: undefined, executionPrice: result?.executionPrice });
        }
    },

    solBalance: 0,
    // wsolBalance: 0,
    rayBalance: 0,

    checkWalletHasEnoughBalance: (tokenAmount) => {
        const { solBalance, rayBalance } = get();
        if (tokenAmount?.token?.mint?.toBase58() === WSOL.mint) return gte(solBalance, tokenAmount);
        if (tokenAmount?.token?.mint?.toBase58() === RAY.mint) return gte(rayBalance, tokenAmount);
        return false;
    },

    createTransaction: async (connection, publicKey) => {
        const { tokenIn, tokenOut, rawAmountIn, rawAmountOut } = get();
        const currencyIn = toToken(tokenIn);
        const currencyOut = toToken(tokenOut);

        assertion(isMeaningfulNumber(rawAmountIn) && isMeaningfulNumber(rawAmountIn), 'amount in or out is invalid');

        const amountIn = toTokenAmount(currencyIn, rawAmountIn, { alreadyDecimaled: true });
        const minAmountOut = toTokenAmount(currencyOut, rawAmountOut, { alreadyDecimaled: true });
        return await createSwapTransaction(connection, publicKey, amountIn, minAmountOut);
    },

    refreshCount: 0,
    refreshSwap: () => {
        set((s) => ({ refreshCount: s.refreshCount + 1 }));
    },
}));

export default useSwap;
