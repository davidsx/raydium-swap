import {
    jsonInfo2PoolKeys,
    Liquidity,
    Percent,
    SplTokenInfo,
    SPL_ACCOUNT_LAYOUT,
    Token,
    TokenAccount,
    TokenAmount,
    TOKEN_PROGRAM_ID,
} from '@raydium-io/raydium-sdk';
import { Connection, PublicKey } from '@solana/web3.js';
import { Numberish } from 'types';
import { assertion } from './common';
import { RAY_SOL_POOL, SLIPPAGE } from './constants';
import { toToken, toTokenAmount } from './web3';

export async function getTokenAccountsByOwner(connection: Connection, owner: PublicKey) {
    assertion(connection, 'connection is not ready, maybe RPC is collapsed now');
    const tokenResp = await connection.getTokenAccountsByOwner(owner, { programId: TOKEN_PROGRAM_ID });

    const accounts: TokenAccount[] = [];

    for (const { pubkey, account } of tokenResp.value) {
        accounts.push({
            pubkey,
            accountInfo: SPL_ACCOUNT_LAYOUT.decode(account.data),
        });
    }

    return accounts;
}

// export async function computeAnotherAmountOut(
//     connection: Connection,
//     { tokenIn, tokenOut, rawAmountIn }: { tokenIn: SplTokenInfo; tokenOut: SplTokenInfo; rawAmountIn: string }
// ) {
//     // assertion(currentJsonInfo, 'pool info not ready');
//     // assertion(currentSdkParsedInfo, 'parsed info not ready');
//     const poolKeys = jsonInfo2PoolKeys(RAY_SOL_POOL);
//     const poolInfo = await Liquidity.fetchInfo({ connection, poolKeys });
//     const currencyIn = new Token(tokenIn.mint, tokenIn.decimals);
//     const amount = new TokenAmount(currencyIn, rawAmountIn, false);
//     const currencyOut = new Token(tokenOut.mint, tokenOut.decimals);
//     const { maxAnotherAmount, anotherAmount } = Liquidity.computeAnotherAmount({
//         poolKeys,
//         poolInfo,
//         amount,
//         anotherCurrency: currencyOut,
//         slippage: SLIPPAGE,
//     });

//     return { maxAnotherAmount, anotherAmount };
// }

export async function computeAmountOut(
    connection: Connection,
    amountIn: TokenAmount,
    currencyOut: Token
    // {
    //     tokenIn,
    //     tokenOut,
    //     rawAmountIn,
    // }: {
    //     tokenIn: SplTokenInfo;
    //     tokenOut: SplTokenInfo;
    //     rawAmountIn: Numberish;
    // }
) {
    assertion(connection, 'connection is not ready, maybe RPC is collapsed now');
    assertion(amountIn, `amount in is not valid: ${amountIn.toExact()}`);
    const poolKeys = jsonInfo2PoolKeys(RAY_SOL_POOL);
    const poolInfo = await Liquidity.fetchInfo({ connection, poolKeys });
    // const currencyIn = toToken(tokenIn);
    // const amountIn = toTokenAmount(currencyIn, rawAmountIn, { alreadyDecimaled: true });
    // const currencyOut = toToken(tokenOut);

    const { amountOut, minAmountOut, currentPrice, executionPrice, priceImpact, fee } = Liquidity.computeAmountOut({
        poolKeys,
        poolInfo,
        amountIn,
        currencyOut,
        slippage: SLIPPAGE,
    });

    return {
        amountIn,
        amountOut,
        minAmountOut,
        currentPrice,
        executionPrice,
        priceImpact,
        fee,
    };
}

export async function createSwapTransaction(
    connection: Connection,
    publicKey: PublicKey,
    amountIn: TokenAmount,
    minAmountOut: TokenAmount,
    // { tokenIn, tokenOut, rawAmountIn }: { tokenIn: SplTokenInfo; tokenOut: SplTokenInfo; rawAmountIn: Numberish }
) {
    assertion(connection, 'connection is not ready, maybe RPC is collapsed now');
    assertion(publicKey, 'please connect a wallet');
    const poolKeys = jsonInfo2PoolKeys(RAY_SOL_POOL);
    const tokenAccounts = await getTokenAccountsByOwner(connection, publicKey);
    // const { amountIn, minAmountOut } = await computeAmountOut(connection, { tokenIn, tokenOut, rawAmountIn });
    const { transaction, signers } = await Liquidity.makeSwapTransaction({
        connection,
        poolKeys,
        userKeys: {
            tokenAccounts,
            owner: publicKey,
        },
        amountIn,
        amountOut: minAmountOut,
        fixedSide: 'in',
    });

    return { transaction, signers };
}
