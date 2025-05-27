const axios = require("axios");

async function fetchKey(url) {
  try {
    const response = await axios.post(
      "https://cdn59.savetube.su/info",
      { url },
      {
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'https://yt.savetube.me',
          'Referer': 'https://yt.savetube.me/',
          'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36'
        }
      }
    );
    return response.data?.data?.key || null;
  } catch (error) {
    console.error("Key fetch error:", error.message);
    return null;
  }
}

async function fetchDownloadLink(key, type = "audio", quality = "128") {
  try {
    const response = await axios.post(
      "https://cdn61.savetube.su/download",
      {
        key,
        downloadType: type,
        quality,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'https://yt.savetube.me',
          'Referer': 'https://yt.savetube.me/',
          'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36'
        }
      }
    );
    return response.data?.data?.downloadUrl || null;
  } catch (error) {
    console.error("Download fetch error:", error.message);
    return null;
  }
}

async function ytmp3(query) {
  const key = await fetchKey(query);
  if (!key) throw new Error("Failed to extract key");

  const dl_link = await fetchDownloadLink(key, "audio", "128");
  if (!dl_link) throw new Error("Failed to get download link");

  return { dl_link };
}

module.exports = { ytmp3 };