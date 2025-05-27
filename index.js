const express = require("express");
const { ytmp3 } = require("./scraper");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({
    status: true,
    message: "YTMP3 API by Dinuwh MD",
    usage: "/ytmp3?url=YOUTUBE_URL"
  });
});

app.get("/ytmp3", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({ status: false, message: "Missing URL" });

  try {
    const data = await ytmp3(url);
    res.json(data);
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
