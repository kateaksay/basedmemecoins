const express = require("express");
const app = express();
app.get("/", (req, res) => res.send("Welcome to the Based Meme Coins API!"));
app.listen(3000, () => console.log("Server ready."));
module.exports = app;
//# sourceMappingURL=index.js.map