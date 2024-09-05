const express = require("express");
const app = express();

app.get("/", (req: any, res: any) => res.send("Welcome to the Based Meme Coins API!"));

app.listen(3000, () => console.log("Server ready."));

module.exports = app;
