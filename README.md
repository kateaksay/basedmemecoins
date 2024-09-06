# Based Meme Coins

This is a Base team hack week project and it is hosted on https://basedmemecoins.vercel.app/

Based Meme Coins is an app that buys meme coins on Base on your behalf. After you provide a budget for it, the app decides on the coins to buy and the amount to invest in them.

## Product Integrations

- App is built on [Base](https://base.org/).
- Wallet and transactions via [Coinbase Smart Wallet](https://www.smartwallet.dev/why).
- Wallet component is powered by [OnchainKit](https://onchainkit.xyz/) and [Basenames](https://www.base.org/names).
- App receives user's approval to buy meme coins in regular intervals via [Smart Wallet Session Keys](https://www.smartwallet.dev/guides/session-keys).
- Session key UserOps are sponsored by [Coinbase Paymaster](https://portal.cdp.coinbase.com/products/bundler-and-paymaster).
- Base coin list is fed to the AI by [CoinGecko API](https://www.coingecko.com/en/api).
- AI prompts to buy meme coins are run against [ChatGPT](https://openai.com/chatgpt/).

## To Do
- Due to low liquidity and lack of meme coin contracts in Base Sepolia, token purchase happens in the app via buying an NFT. When the app is ready for Base Mainnet, Mint contract will be replaced by the Swap contract.
- Add a schedular to run the purchases regularly based on user's settings.
