import { SplTokenInfo } from "@raydium-io/raydium-sdk";

export function parseTokenSymbol(token: SplTokenInfo) {
    return token.symbol === 'WSOL' ? 'SOL' : token.symbol;
}