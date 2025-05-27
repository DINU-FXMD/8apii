const express = require("express");
const { ytmp3 } = require("./scraper");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/ytmp3", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ status: false, message: "Missing YouTube URL" });

  try {
    const dl = await ytmp3(url);
    res.json({
      status: true,
      creator: "Scraper by Dinuwh",
      result: dl
    });
  } catch (e) {
    res.status(500).json({ status: false, message: e.message });
  }
});

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));