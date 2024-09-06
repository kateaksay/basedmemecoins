import express from "express";
import { createPublicClient, formatEther, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import { basedMemeCoinNFT_ABI } from "./BasedMemeCoinNFT_abi";

const app = express();

// Create a public client
const client = createPublicClient({
  chain: baseSepolia,
  transport: http()
});

const contractAddress = "0xaa60eb1436b6c006f9d6994c64281863fa8918ea";

const getTokenMetadata = async (tokenId: string): Promise<any> => {
     try {
        return await client.readContract({
          address: contractAddress,
          abi: basedMemeCoinNFT_ABI,
          functionName: "getMemeCoin",
          args: [BigInt(tokenId)],
        });
    } catch (error) {
        console.error('Error fetching metadata:', error);
        throw error;
    }
};

app.get("/api", (req: any, res: any) => res.send("Welcome to the Based Meme Coins API!"));


app.get("/api/nfts/basedmemecoins/:tokenId", async (req: any, res: any) => {
    const { tokenId } = req.params;
    const result = await getTokenMetadata(tokenId);
    // Return metadata
    res.json({
      name: result.symbol,
      description: `Bought ${formatEther(result.cost)} worth of  ${result.name}`,
      image: `https://basedmemecoins.com/api/nfts/basedmemecoins/${tokenId}/image.svg`,
    });
});

app.get("/api/nfts/basedmemecoins/:tokenId/image.svg", async (req: any, res: any) => {
    const { tokenId } = req.params;
    const result = await getTokenMetadata(tokenId);
    const symbol = result.symbol; // Added token symbol
    const transferAmount = formatEther(result.cost); // Added transfer amount
    const image = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
        <rect width="512" height="512" fill="#000" />
        <text x="50%" y="40%" font-family="monospace" font-size="72" fill="#fff" text-anchor="middle">${symbol}</text>
        <text x="50%" y="60%" font-family="monospace" font-size="36" fill="#fff" text-anchor="middle">${transferAmount} ETH</text>
    </svg>`;
    res.send(image);
});

app.listen(3000, () => console.log("Server ready."));
module.exports = app;
