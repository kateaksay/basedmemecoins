"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.get("/api", (req, res) => res.send("Welcome to the Based Meme Coins API!"));
app.listen(3000, () => console.log("Server ready."));
module.exports = app;
//# sourceMappingURL=index.js.map