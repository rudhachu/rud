 const {
  rudhra,
  mode,
  isUrl,
  getJson,
  PREFIX,
  AddMp3Meta,
  getBuffer,
  toAudio,
  yta,
  ytv,
  ytsdl,
  parsedUrl
} = require("../lib");
const axios = require('axios');
const config = require('../config');
const yts = require("yt-search");
rudhra({
    pattern: 'song ?(.*)',
    fromMe: mode,
    desc: 'Search and download audio from YouTube.',
    type: 'info'
}, async (message, match, client) => {
    match = match || message.reply_message.text;
    if (!match) {
        return await message.reply('Please provide a search query.');
    }

    const query = match;
    try {
        const { videos } = await yts(query);
        if (videos.length === 0) {
            return await message.reply('No results found.');
        }

        const firstVideo = videos[0];
        const videoUrl = firstVideo.url;

        const response = await axios.get(`https://combative-sarine-eypz-god-d4cce0fc.koyeb.app/ytdl?url=${videoUrl}`);
        const { download_links, title } = response.data;
        const mp4 = download_links.mp4;
        await message.reply(`_Downloading ${title}_`);
        await message.client.sendMessage(
            message.jid,
            { audio: { url: mp4 }, mimetype: 'audio/mp4' },
            { quoted: message.data }
          );
          await message.client.sendMessage(
            message.jid,
            { document: { url: mp4 }, mimetype: 'audio/mpeg', fileName: `${title}.mp3`, caption: `_${title}_` },
            { quoted: message.data }
          );
    } catch (error) {
        console.error('Error fetching audio:', error);
        await message.reply('Failed to download audio. Please try again later.');
    }
});
rudhra({
    pattern: 'video?(.*)',
    fromMe: mode,
    desc: 'Search and download video from YouTube.',
    type: 'info'
}, async (message, match, client) => {
    match = match || message.reply_message.text;
    if (!match) {
        return await message.reply('Please provide a search query.');
    }

    const query = match;
    try {
        const { videos } = await yts(query);
        if (videos.length === 0) {
            return await message.reply('No results found.');
        }

        const firstVideo = videos[0];
        const videoUrl = firstVideo.url;

        const response = await axios.get(`https://combative-sarine-eypz-god-d4cce0fc.koyeb.app/ytdl?url=${videoUrl}`);
        const { download_links, title } = response.data;
        const mp4 = download_links.mp4;
        await message.reply(`_Downloading ${title}_`);
        await message.client.sendMessage(
            message.jid,
            { video: { url: mp4 }, mimetype: 'video/mp4', fileName: `${title}.mp4` },
            { quoted: message.data }
        );
    } catch (error) {
        console.error('Error fetching video:', error);
        await message.reply('Failed to download video. Please try again later.');
    }
});
rudhra({
    pattern: 'yta ?(.*)',
    fromMe: mode,
    desc: 'Download audio from YouTube.',
    type: 'info'
}, async (message, match, client) => {
    match = match || message.reply_message.text;
    if (!match) {
        return await message.reply('Please provide a YouTube video URL.');
    }

    const videoUrl = match;
    try {
        const response = await axios.get(`https://combative-sarine-eypz-god-d4cce0fc.koyeb.app/ytdl?url=${videoUrl}`);
        const { download_links, title } = response.data;
        const mp4 = download_links.mp4;
        await message.reply(`_Downloading ${title}_`);
        await message.client.sendMessage(
            message.jid,
            { audio: { url: mp4 }, mimetype: 'audio/mp4' },
            { quoted: message.data }
          );
          await message.client.sendMessage(
            message.jid,
            { document: { url: mp4 }, mimetype: 'audio/mpeg', fileName: `${title}.mp3`, caption: `_${title}_` },
            { quoted: message.data }
          );
    } catch (error) {
        console.error('Error fetching audio:', error);
        await message.reply('Failed to download audio. Please try again later.');
    }
});

rudhra({
    pattern: 'ytv ?(.*)',
    fromMe: mode,
    desc: 'Download video from YouTube.',
    type: 'info'
}, async (message, match, client) => {
    match = match || message.reply_message.text;
    if (!match) {
        return await message.reply('Please provide a YouTube video URL.');
    }

    const videoUrl = match;
    try {
        const response = await axios.get(`https://combative-sarine-eypz-god-d4cce0fc.koyeb.app/ytdl?url=${videoUrl}`);
        const { download_links, title } = response.data;
        const mp4 = download_links.mp4;
        await message.reply(`_Downloading ${title}_`);
        await message.client.sendMessage(
            message.jid,
            { video: { url: mp4 }, mimetype: 'video/mp4', fileName: `${title}.mp4` },
            { quoted: message.data }
        );
    } catch (error) {
        console.error('Error fetching video:', error);
        await message.reply('Failed to download video. Please try again later.');
    }
});
rudhra(
  {
    pattern: "play ?(.*)",
    fromMe: mode,
    desc: "Download YouTube videos by a query",
    type: "downloader",
  },
  async (message, match) => {
    const query = match;

    if (!query) {
      return await message.reply('Please provide a search query!');
    }

    try {
      const searchResults = await yts(query);

      if (searchResults.all.length === 0) {
        return await message.reply(`No results found for "${query}".`);
      }

      const firstVideo = searchResults.videos[0];
      const videoId = firstVideo.videoId;
      const link = `https://convert-s0ij.onrender.com/convert-thumbnail/${videoId}.png`;

      const url = await message.ParseButtonMedia(link);

      const buttonData = {
        jid: message.jid,
        button: [],
        header: {
          title: "𝗬𝗼𝘂𝗧𝘂𝗯𝗲 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗲𝗿",
          subtitle: "YouTube Downloader",
          hasMediaAttachment: true, 
        },
        footer: {
          text: "ᴄʜᴏᴏsᴇ ᴀ ᴅᴏᴡɴʟᴏᴀᴅ ᴏᴘᴛɪᴏɴ",
        },
        body: {
          text: `*Top 5 results for "${query}":*`,
        },
      };

      buttonData.header.videoMessage = link.endsWith(".mp4") ? url : undefined;
      buttonData.header.imageMessage = link.endsWith(".png") ? url : undefined;

      for (let i = 0; i < Math.min(searchResults.videos.length, 5); i++) {
        const video = searchResults.videos[i];

        buttonData.button.push(
          {
            type: "reply",
            params: {
              display_text: `Audio ${video.title}`,
              id: `${PREFIX}yta ${video.url}`,
            },
          },
          {
            type: "reply",
            params: {
              display_text: `Video ${video.title}`,
              id: `${PREFIX}ytv ${video.url}`,
            },
          }
        );
      }

      await message.sendMessage(message.jid, buttonData, {}, "interactive");
    } catch (error) {
      console.error(error);
      await message.reply('An error occurred while searching. Please try again later.');
    }
  }
);
rudhra(
  {
    pattern: "yts ?(.*)",
    fromMe: mode,
    desc: "Search YouTube videos",
    type: "downloader",
  },
  async (message, match, m) => {
    try {
      match = match || message.reply_message.text;

      if (!match) {
        await message.reply("Please provide a search query to find YouTube videos.\nExample: `.yts How you like that`");
        return;
      }

      const response = await getJson(eypzApi + `ytdl/search?query=${encodeURIComponent(match)}`);

      if (!response || response.results.length === 0) {
        await message.reply("Sorry, no YouTube videos found for your search query.");
        return;
      }

      const formattedMessage = formatYouTubeMessage(response.results);

      const contextInfoMessage = {
        text: formattedMessage,
        contextInfo: {
          mentionedJid: [message.sender],
          externalAdReply: {
          title: "𝗬𝗼𝘂𝗧𝘂𝗯𝗲 𝗦𝗲𝗮𝗿𝗰𝗵 𝗥𝗲𝘀𝘂𝗹𝘁𝘀",
                    body: "ʀᴜᴅʜʀᴀ ʙᴏᴛ",
                    sourceUrl: "https://youtube.com/princerudh",
                    mediaUrl: "https://youtube.com",
                    mediaType: 1,
                    showAdAttribution: true,
                    renderLargerThumbnail: false,
                    thumbnailUrl: "https://raw.githubusercontent.com/rudhra-prh/media/refs/heads/main/image/yts.png"
          }
        }
      };

      await message.client.sendMessage(message.jid, contextInfoMessage);

    } catch (error) {
      console.error("Error fetching YouTube videos:", error);
      await message.reply("Error fetching YouTube videos. Please try again later.");
    }
  }
);

function formatYouTubeMessage(videos) {
  let message = "*YouTube Search Results:*\n\n";

  videos.forEach((video, index) => {
    message += `*${index + 1},* *Title :* ${video.title}\n   *Duration :* ${video.duration}\n   *Link :* ${video.url}\n\n`;
  });

  return message;
}
