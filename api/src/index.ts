import express from "express";
import cors from "cors";
import { createPublicClient, createWalletClient, http, formatEther, parseEther, encodeFunctionData } from 'viem';
import { baseSepolia } from 'viem/chains';
import axios from "axios";
import { basedMemeCoinNFT_ABI, contractAddressNFT } from "./BasedMemeCoinNFTContract";


const app = express();

// Enable CORS for all routes
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create a public client
const client = createPublicClient({
  chain: baseSepolia as any,
  transport: http()
});

const getTokenMetadata = async (tokenId: string): Promise<any> => {
     try {
        return await client.readContract({
          address: contractAddressNFT,
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
      description: `Bought ${formatEther(result.cost)} ETH worth of  ${result.name}`,
      image: `https://basedmemecoins.vercel.app/api/nfts/basedmemecoins/${tokenId}/image.svg`,
    });
});

app.get("/api/nfts/basedmemecoins/:tokenId/image.svg", async (req: any, res: any) => {
    const { tokenId } = req.params;
    const result = await getTokenMetadata(tokenId);
    const symbol = result.symbol; // Added token symbol
    const transferAmount = formatEther(result.cost); // Added transfer amount
    const image = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <rect width="512" height="512" fill="#000" />
        <text x="50%" y="40%" font-family="monospace" font-size="72" fill="#fff" text-anchor="middle">${symbol}</text>
        <text x="50%" y="60%" font-family="monospace" font-size="36" fill="#fff" text-anchor="middle">${parseFloat(transferAmount).toFixed(8)} ETH</text>
    </svg>`;
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(image);
});

async function getBaseEcosystemCoins() {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets",
      {
        params: {
          vs_currency: "usd",
          category: "base-ecosystem",
          order: "market_cap_desc",
          per_page: 300,
          page: 1,
          sparkline: false,
        },
      }
    );

    const coins = response.data.map((coin: any) => ({
      name: coin.name,
      symbol: coin.symbol,
    }));

    return coins;
  } catch (error) {
    console.error("Error fetching coin data:", error);
  }
}

app.post("/api/invest", async (req: any, res: any) => {
    console.log(req.body);

    const coins = await getBaseEcosystemCoins();
    
    const { prompt, amount } = req.body;

    const fullPrompt = 
    `You are an expert in crypto and finance. You are recommending
    based meme coins on the BASE network. Here are the coins available:

    ${coins.map((coin: any) => `${coin.name} (${coin.symbol})`).join("\n")}
    
    Return a list of coin name, symbol, and amount invested based
    on the following prompt from the client: 

    """
    ${prompt}. 
    """

    Divide the amount of ${amount/24.0} units between 1 to 5 investments based 
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
                "symbol": "COIN 2",
                "amount": "0.00005"
            }
        ]
    }

    Do not include any other text in your response.
    `;

    // send a request to chatgpt
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
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

    const data = await response.json();
    if (data.choices) {
      const recommendations = JSON.parse(data.choices[0].message.content);
      res.json(recommendations);
    } else {
      res.status(500).json({ error: "Failed to generate recommendations" });
    }
});

app.listen(3000, () => console.log("Server ready."));
module.exports = app;
