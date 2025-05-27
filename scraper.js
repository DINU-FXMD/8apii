const axios = require("axios");
const ytdl = require("ytdl-core");

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
          'User-Agent': 'Mozilla/5.0'
        }
      }
    );
    return response.data?.data?.key || null;
  } catch {
    return null;
  }
}

async function fetchDownloadLink(key, type = "audio", quality = "128") {
  try {
    const response = await axios.post(
      "https://cdn61.savetube.su/download",
      { key, downloadType: type, quality },
      {
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'https://yt.savetube.me',
          'Referer': 'https://yt.savetube.me/',
          'User-Agent': 'Mozilla/5.0'
        }
      }
    );
    return response.data?.data?.downloadUrl || null;
  } catch {
    return null;
  }
}

async function ytmp3(query) {
  const key = await fetchKey(query);
  if (!key) throw new Error("Failed to extract key");

  const dl_link = await fetchDownloadLink(key, "audio", "128");
  if (!dl_link) throw new Error("Failed to get download link");

  const info = await ytdl.getInfo(query);
  const videoDetails = info.videoDetails;

  return {
    status: true,
    creator: "Manul Official",
    metadata: {
      type: "video",
      videoId: videoDetails.videoId,
      url: videoDetails.video_url,
      title: videoDetails.title,
      description: videoDetails.description,
      image: videoDetails.thumbnails.pop().url,
      thumbnail: videoDetails.thumbnails.pop().url,
      seconds: parseInt(videoDetails.lengthSeconds),
      timestamp: new Date(parseInt(videoDetails.lengthSeconds) * 1000).toISOString().substr(14, 5),
      duration: {
        seconds: parseInt(videoDetails.lengthSeconds),
        timestamp: new Date(parseInt(videoDetails.lengthSeconds) * 1000).toISOString().substr(14, 5),
      },
      ago: videoDetails.publishDate || "Unknown",
      views: parseInt(videoDetails.viewCount),
      author: {
        name: videoDetails.author.name,
        url: videoDetails.author.channel_url,
      }
    },
    download: {
      status: true,
      quality: "128kbps",
      availableQuality: [92, 128, 256, 320],
      url: dl_link,
      filename: `${videoDetails.title} (128kbps).mp3`
    }
  };
}

module.exports = { ytmp3 };
