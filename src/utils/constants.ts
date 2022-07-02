import { LiquidityPoolJsonInfo, Percent, SplTokenInfo } from '@raydium-io/raydium-sdk';

export const SLIPPAGE = new Percent(1, 100);

export const RAY: SplTokenInfo & { icon: string } = {
    symbol: 'RAY',
    name: 'Raydium',
    mint: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
    decimals: 6,
    extensions: { coingeckoId: 'raydium' },
    icon: 'https://img.raydium.io/icon/4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R.png',
};

export const WSOL: SplTokenInfo & { icon: string } = {
    symbol: 'WSOL',
    name: 'Wrapped Solana',
    mint: 'So11111111111111111111111111111111111111112',
    decimals: 9,
    extensions: { coingeckoId: 'wrapped-solana' },
    icon: 'https://img.raydium.io/icon/So11111111111111111111111111111111111111112.png',
};

export const RAY_SOL_POOL: LiquidityPoolJsonInfo = {
    id: 'AVs9TA4nWDzfPJE9gGVNJMVhcQy3V9PGazuz33BfG2RA',
    baseMint: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
    quoteMint: 'So11111111111111111111111111111111111111112',
    lpMint: '89ZKE4aoyfLBe2RuV6jM3JGNhaV18Nxh8eNtjRcndBip',
    // baseDecimals: 6,
    // quoteDecimals: 9,
    // lpDecimals: 6,
    version: 4,
    programId: '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8',
    authority: '5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1',
    openOrders: '6Su6Ea97dBxecd5W92KcVvv6SzCurE2BXGgFe9LNGMpE',
    targetOrders: '5hATcCfvhVwAjNExvrg8rRkXmYyksHhVajWLa46iRsmE',
    baseVault: 'Em6rHi68trYgBFyJ5261A2nhwuQWfLcirgzZZYoRcrkX',
    quoteVault: '3mEFzHsJyu2Cpjrz6zPmTzP7uoLFj9SbbecGVzzkL1mJ',
    withdrawQueue: 'FSHqX232PHE4ev9Dpdzrg9h2Tn1byChnX4tuoPUyjjdV',
    lpVault: '87CCkBfthmyqwPuCDwFmyqKWJfjYqPFhm5btkNyoALYZ',
    marketVersion: 3,
    marketProgramId: '9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin',
    marketId: 'C6tp2RVZnxBPFbnAsfTjis8BN9tycESAT4SgDQgbbrsA',
    marketAuthority: '7SdieGqwPJo5rMmSQM9JmntSEMoimM4dQn7NkGbNFcrd',
    marketBaseVault: '6U6U59zmFWrPSzm9sLX7kVkaK78Kz7XJYkrhP1DjF3uF',
    marketQuoteVault: '4YEx21yeUAZxUL9Fs7YU9Gm3u45GWoPFs8vcJiHga2eQ',
    marketBids: 'C1nEbACFaHMUiKAUsXVYPWZsuxunJeBkqXHPFr8QgSj9',
    marketAsks: '4DNBdnTw6wmrK4NmdSTTxs1kEz47yjqLGuoqsMeHvkMF',
    marketEventQueue: '4HGvdannxvmAhszVVig9auH6HsqVH17qoavDiNcnm9nj',
};
