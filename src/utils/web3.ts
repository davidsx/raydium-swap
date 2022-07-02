import { Fraction, SplTokenInfo, Token, TokenAmount } from "@raydium-io/raydium-sdk";
import BN from "bn.js";
import { Numberish } from "types";
import { parseNumberInfo, toBN, toFraction } from "./numberish";

export function toToken(splToken: SplTokenInfo): Token {
    return new Token(splToken.mint, splToken.decimals, splToken.symbol, splToken.name);
}

export function toTokenAmount(
    token: Token,
    amount: Numberish | undefined,
    options?: {
        exact?: boolean;
        alreadyDecimaled?: boolean;
    }
): TokenAmount {
    // const parsedToken = isToken(token) ? token : new Token(token.mint, token.decimals, token.symbol, token.name);
    const numberDetails = parseNumberInfo(amount);
    const amountBigNumber = toBN(
        options?.alreadyDecimaled
            ? new Fraction(numberDetails.numerator, numberDetails.denominator).mul(new BN(10).pow(new BN(token.decimals)))
            : amount
            ? toFraction(amount)
            : toFraction(0)
    );
    // const amountBigNumber = toBN(amount ? toFraction(amount) : toFraction(0));
    return new TokenAmount(token, amountBigNumber);
}
