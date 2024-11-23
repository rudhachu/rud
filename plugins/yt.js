const {
  rudhra,
  mode,
  getJson,
  PREFIX,
  getBuffer,
  parsedUrl
} = require("../lib");
const axios = require("axios");

rudhra({
  pattern: "yta ?(.*)",
  fromMe: mode,
  desc: "Download audio from YouTube.",
  type: "info",
}, async (message, match, client) => {
  match = match || message.reply_message.text;
  if (!match) return await message.reply("Please provide a valid YouTube link.");

  const videoUrl = match.trim();

  // Validate YouTube URL
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
  if (!youtubeRegex.test(videoUrl)) {
    return await message.reply("Invalid YouTube link. Please provide a proper URL.");
  }

  try {
    // Call API
    const response = await axios.get(`https://itzpire.com/download/youtube?url=${videoUrl}`);
    console.log("API Response:", response.data); // Debugging log

    // Access audio data
    const { audio } = response.data.data;
    if (!audio || !audio.url) {
      return await message.reply("Failed to fetch audio download link. Please try another video.");
    }

    const { title, url: audioUrl } = audio;

    // Notify user and send audio
    await message.reply(`_Downloading ${title}_`);
    await message.client.sendMessage(
      message.jid,
      { audio: { url: audioUrl }, mimetype: "audio/mp4" },
      { quoted: message.data }
    );

    // Send as document with metadata
    await message.client.sendMessage(
      message.jid,
      {
        document: { url: audioUrl },
        mimetype: "audio/mpeg",
        fileName: `${title}.mp3`,
        caption: `_${title}_`,
      },
      { quoted: message.data }
    );
  } catch (error) {
    console.error("Error fetching audio:", error.message || error);
    await message.reply("Failed to download audio. Please try again later.");
  }
});
