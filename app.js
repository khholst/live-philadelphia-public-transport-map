const express = require("express");
const dotenv = require("dotenv");
const app = express();
dotenv.config();

app.listen(process.env.PORT || 3000);
app.use(express.static("client-side"));

const key = process.env.API_KEY;

app.get("/api_key", async (request, response) => {
    response.json({apiKey: key});
});