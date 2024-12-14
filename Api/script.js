const express = require("express");
const bodyParser = require("body-parser");
const shortid = require("shortid");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory storage
const urlDatabase = {};

// API to shorten URL
app.post("/shorten", (req, res) => {
    const { longUrl } = req.body;
    if (!longUrl) {
        return res.status(400).json({ error: "Long URL is required" });
    }
    const shortCode = shortid.generate();
    urlDatabase[shortCode] = longUrl;
    const shortUrl = `https://day-6-cw.vercel.app/${shortCode}`;
    res.json({ shortUrl });
});

// Redirect to original URL
app.get("/:shortCode", (req, res) => {
    const { shortCode } = req.params;
    const longUrl = urlDatabase[shortCode];
    if (longUrl) {
        res.redirect(longUrl);
    } else {
        res.status(404).send("URL not found");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
