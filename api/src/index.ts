import express from "express";
const app = express();


app.get("/api", (req: any, res: any) => res.send("Welcome to the Based Meme Coins API!"));


app.get("/api/nfts/basedmemecoins/:tokenId", (req: any, res: any) => {
    const { tokenId } = req.params;

    // get metadata from contract
    
    // return metadata
    res.json({
        name: "Based Meme Coin",
        description: "Based Meme Coin",
        image: "https://basedmemecoins.vercel.app/api/nfts/basedmemecoins/" + tokenId + "/image.svg",
    });    
});

app.get("/api/nfts/basedmemecoins/:tokenId/image.svg", (req: any, res: any) => {
    const { tokenId } = req.params;
    const image = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" fill="#000" /><text x="50%" y="50%" font-family="monospace" font-size="96" fill="#fff" text-anchor="middle">${tokenId}</text></svg>`;
    res.send(image);
});

app.listen(3000, () => console.log("Server ready."));
module.exports = app;
