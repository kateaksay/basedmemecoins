"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const viem_1 = require("viem");
const chains_1 = require("viem/chains");
const axios_1 = __importDefault(require("axios"));
const BasedMemeCoinNFTContract_1 = require("./BasedMemeCoinNFTContract");
const app = (0, express_1.default)();
// Enable CORS for all routes
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Create a public client
const client = (0, viem_1.createPublicClient)({
    chain: chains_1.baseSepolia,
    transport: (0, viem_1.http)()
});
const getTokenMetadata = (tokenId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield client.readContract({
            address: BasedMemeCoinNFTContract_1.contractAddressNFT,
            abi: BasedMemeCoinNFTContract_1.basedMemeCoinNFT_ABI,
            functionName: "getMemeCoin",
            args: [BigInt(tokenId)],
        });
    }
    catch (error) {
        console.error('Error fetching metadata:', error);
        throw error;
    }
});
app.get("/api", (req, res) => res.send("Welcome to the Based Meme Coins API!"));
app.get("/api/nfts/basedmemecoins/:tokenId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tokenId } = req.params;
    const result = yield getTokenMetadata(tokenId);
    // Return metadata
    res.json({
        name: result.symbol,
        description: `Bought ${(0, viem_1.formatEther)(result.cost)} ETH worth of  ${result.name}`,
        image: `https://basedmemecoins.vercel.app/api/nfts/basedmemecoins/${tokenId}/image.svg`,
    });
}));
app.get("/api/nfts/basedmemecoins/:tokenId/image.svg", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tokenId } = req.params;
    const result = yield getTokenMetadata(tokenId);
    const symbol = result.symbol; // Added token symbol
    const transferAmount = (0, viem_1.formatEther)(result.cost); // Added transfer amount
    const image = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <rect width="512" height="512" fill="#000" />
        <text x="50%" y="40%" font-family="monospace" font-size="72" fill="#fff" text-anchor="middle">${symbol}</text>
        <text x="50%" y="60%" font-family="monospace" font-size="36" fill="#fff" text-anchor="middle">${parseFloat(transferAmount).toFixed(8)} ETH</text>
    </svg>`;
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(image);
}));
function getBaseEcosystemCoins() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get("https://api.coingecko.com/api/v3/coins/markets", {
                params: {
                    vs_currency: "usd",
                    category: "base-ecosystem",
                    order: "market_cap_desc",
                    per_page: 300,
                    page: 1,
                    sparkline: false,
                },
            });
            const coins = response.data.map((coin) => ({
                name: coin.name,
                symbol: coin.symbol,
            }));
            return coins;
        }
        catch (error) {
            console.error("Error fetching coin data:", error);
        }
    });
}
app.post("/api/invest", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const coins = yield getBaseEcosystemCoins();
    const { prompt, amount } = req.body;
    const fullPrompt = `You are an expert in crypto and finance. You are recommending
    based meme coins on the Base network. Here are the coins available:

    ${coins.map((coin) => `${coin.name} (${coin.symbol})`).join("\n")}
    
    Return a list of coin name, symbol, and amount invested based
    on the following prompt from the client: 

    """
    ${prompt}. 
    """

    Divide the amount of ${amount / 24.0} units between 1 to 5 investments based 
    on client prompt and your own knowledge. Use up to 8th significant digits.
    Invest different amounts for each coin based on your knowledge of the coin.

    Only respond with a single JSON:
    {
        "coins": [
            {
                "name": "Coin Name",
                "symbol": "COIN",
                "amount": "0.0001"
            },
            {
                "name": "Coin Name 2",
                "symbol": "COIN2",
                "amount": "0.00005"
            }
        ]
    }

    Do not include any other text in your response.
    `;
    // send a request to chatgpt
    const response = yield fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: "gpt-4",
            messages: [{ role: "user", content: fullPrompt }],
            max_tokens: 1000,
            temperature: 0.5,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        }),
    });
    const data = yield response.json();
    if (data.choices) {
        const recommendations = JSON.parse(data.choices[0].message.content);
        res.json(recommendations);
    }
    else {
        res.status(500).json({ error: "Failed to generate recommendations" });
    }
}));
app.listen(3000, () => console.log("Server ready."));
module.exports = app;
//# sourceMappingURL=index.js.map