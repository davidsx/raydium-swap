import BN from 'bn.js';
import { BigNumberish, Fraction, Percent, Price, TEN, TokenAmount, ZERO } from '@raydium-io/raydium-sdk';
import { Numberish } from 'types';

/**
 *
 * @example
 * getIntInfo(0.34) //=> { numerator: '34', denominator: '100'}
 * getIntInfo('0.34') //=> { numerator: '34', denominator: '100'}
 */
export function parseNumberInfo(n: Numberish | undefined): {
    denominator: string;
    numerator: string;
    sign?: string;
    int?: string;
    dec?: string;
} {
    if (n === undefined) return { denominator: '1', numerator: '0' };
    if (n instanceof BN) {
        return { numerator: n.toString(), denominator: '1' };
    }

    if (n instanceof Fraction) {
        return { denominator: n.denominator.toString(), numerator: n.numerator.toString() };
    }

    const s = String(n);
    const [, sign = '', int = '', dec = ''] = s.replace(',', '').match(/(-?)(\d*)\.?(\d*)/) ?? [];
    const denominator = '1' + '0'.repeat(dec.length);
    const numerator = sign + (int === '0' ? '' : int) + dec || '0';
    return { denominator, numerator, sign, int, dec };
}

export function toFraction(value: Numberish): Fraction {
    if (value instanceof Percent) return new Fraction(value.numerator, value.denominator);
    if (value instanceof Price) return value.adjusted;
    if (value instanceof Fraction) return value;

    if (value instanceof TokenAmount) {
        try {
            return toFraction(value.toExact());
        } catch (e) {
            return new Fraction(ZERO);
        }
    }

    const n = String(value);
    const details = parseNumberInfo(n);
    return new Fraction(details.numerator, details.denominator);
}

export function toFractionWithDecimals(value: Numberish): { fr: Fraction; decimals?: number } {
    //  to complete math format(may have decimal), not int
    if (value instanceof Percent) return { fr: new Fraction(value.numerator, value.denominator) };

    if (value instanceof Price) return { fr: value.adjusted };

    // to complete math format(may have decimal), not BN
    if (value instanceof TokenAmount) return { fr: toFraction(value.toExact()), decimals: value.token.decimals };

    // do not ideal with other fraction value
    if (value instanceof Fraction) return { fr: value };

    // wrap to Fraction
    const n = String(value);
    const details = parseNumberInfo(n);
    return { fr: new Fraction(details.numerator, details.denominator), decimals: details.dec?.length };
}

/**
 * only int part will become BN
 */
export function toBN(n: undefined): undefined;
export function toBN(n: Numberish, decimal?: BigNumberish): BN;
export function toBN(n: Numberish | undefined, decimal: BigNumberish = 0): BN | undefined {
    if (!n) return undefined;
    if (n instanceof BN) return n;
    return new BN(
        toFraction(n)
            .mul(TEN.pow(new BN(String(decimal))))
            .toFixed(0)
    );
}
