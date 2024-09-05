import express from "express";
import { Request, Response } from "express";
const app = express();
app.get("/api", (req: Request, res: Response) => res.send("Welcome to the Based Meme Coins API!"));
app.listen(3000, () => console.log("Server ready."));
module.exports = app;
