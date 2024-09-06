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
const viem_1 = require("viem");
const chains_1 = require("viem/chains");
const BasedMemeCoinNFT_abi_1 = require("./BasedMemeCoinNFT_abi");
const app = (0, express_1.default)();
// Create a public client
const client = (0, viem_1.createPublicClient)({
    chain: chains_1.baseSepolia,
    transport: (0, viem_1.http)()
});
const contractAddress = "0xaa60eb1436b6c006f9d6994c64281863fa8918ea";
const getTokenMetadata = (tokenId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield client.readContract({
            address: contractAddress,
            abi: BasedMemeCoinNFT_abi_1.basedMemeCoinNFT_ABI,
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
        description: `Bought ${(0, viem_1.formatEther)(result.cost)} worth of  ${result.name}`,
        image: `https://basedmemecoins.com/api/nfts/basedmemecoins/${tokenId}/image.svg`,
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
        <text x="50%" y="60%" font-family="monospace" font-size="36" fill="#fff" text-anchor="middle">${transferAmount} ETH</text>
    </svg>`;
    res.send(image);
}));
app.listen(3000, () => console.log("Server ready."));
module.exports = app;
//# sourceMappingURL=index.js.map