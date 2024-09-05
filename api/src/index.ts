import express from "express";
const app = express();
app.get("/api", (req: any, res: any) => res.send("Welcome to the Based Meme Coins API!"));
app.listen(3000, () => console.log("Server ready."));
module.exports = app;
