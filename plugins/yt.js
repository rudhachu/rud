const {
  rudhra,
  mode,
  PREFIX,
  getApiConfig,
} = require("../lib");
const fetch = require("node-fetch");
const yts = require("yt-search");
const config = require('../config');

rudhra({
  pattern: "song ?(.*)",
  fromMe: mode,
  desc: "Search and download audio from YouTube.",
  type: "downloader",
}, async (message, match, client) => {
  match = match || message.reply_message.text;
    if (!match) {
        return await message.reply('Please provide a search query.');
    }
  try {
    const { baseUrl, apiKey } = await getApiConfig();
    let videoUrl, videoTitle;

    if (match.startsWith("http")) {
      videoUrl = match;
    } else {
      const { videos } = await yts(match);
      if (!videos || videos.length === 0) {
        return await message.reply("No results found for your search query.");
      }

      const firstVideo = videos[0];
      videoUrl = firstVideo.url;
      videoTitle = firstVideo.title;
    }

    const encodedUrl = encodeURIComponent(videoUrl);
    const ytApi = `${baseUrl}api/download/yt?url=${encodedUrl}&apikey=${apiKey}`;
    const response = await fetch(ytApi);
    const data = await response.json();

    const { result } = data;
    if (!result || !result.mp4 || !result.title) {
      return await message.reply("Failed to fetch audio details. Please try again.");
    }

    const mp4 = result.mp4;
    const title = videoTitle || result.title;
    await message.reply(`Downloading: ${title}...`);
    await client.sendMessage(
      message.jid,
      {
        audio: { url: mp4 },
        mimetype: "audio/mpeg",
        fileName: `${title}.mp3`,
      },
      { quoted: message.data }
    );
  } catch (error) {
    console.error("Error:", error);
    await message.reply("An error occurred while processing your request. Please try again later.");
  }
});
rudhra({
  pattern: "yta ?(.*)",
  fromMe: mode,
  desc: "Search and download audio from YouTube.",
  type: "downloader",
}, async (message, match, client) => {
  match = match || message.reply_message.text;
    if (!match) return await message.reply("Give me a YouTube link");
    if (!isUrl(match)) return await message.reply("Give me a YouTube link");
    

  try {
    const { baseUrl, apiKey } = await getApiConfig();
    let videoUrl, videoTitle;

    if (match.startsWith("http")) {
      videoUrl = match;
    } else {
      const { videos } = await yts(match);
      if (!videos || videos.length === 0) {
        return await message.reply("No results found for your search query.");
      }

      const firstVideo = videos[0];
      videoUrl = firstVideo.url;
      videoTitle = firstVideo.title;
    }

    const encodedUrl = encodeURIComponent(videoUrl);
    const ytApi = `${baseUrl}api/download/yt?url=${encodedUrl}&apikey=${apiKey}`;
    const response = await fetch(ytApi);
    const data = await response.json();

    const { result } = data;
    if (!result || !result.mp4 || !result.title) {
      return await message.reply("Failed to fetch audio details. Please try again.");
    }

    const mp4 = result.mp4;
    const title = videoTitle || result.title;
    await message.reply(`Downloading: ${title}...`);
    await client.sendMessage(
      message.jid,
      {
        audio: { url: mp4 },
        mimetype: "audio/mpeg",
        fileName: `${title}.mp3`,
      },
      { quoted: message.data }
    );
  } catch (error) {
    console.error("Error:", error);
    await message.reply("An error occurred while processing your request. Please try again later.");
  }
});
rudhra({
  pattern: "video ?(.*)",
  fromMe: mode,
  desc: "Search and download audio from YouTube.",
  type: "downloader",
}, async (message, match, client) => {
  match = match || message.reply_message.text;
    if (!match) {
        return await message.reply('Please provide a search query.');
    }

  try {
    const { baseUrl, apiKey } = await getApiConfig();
    let videoUrl, videoTitle;

    if (match.startsWith("http")) {
      videoUrl = match;
    } else {
      const { videos } = await yts(match);
      if (!videos || videos.length === 0) {
        return await message.reply("No results found for your search query.");
      }

      const firstVideo = videos[0];
      videoUrl = firstVideo.url;
      videoTitle = firstVideo.title;
    }


    const encodedUrl = encodeURIComponent(videoUrl);
    const ytApi = `${baseUrl}api/download/yt?url=${encodedUrl}&apikey=${apiKey}`;
    const response = await fetch(ytApi);
    const data = await response.json();

   
    const { result } = data;
    if (!result || !result.mp4 || !result.title) {
      return await message.reply("Failed to fetch audio details. Please try again.");
    }

    const mp4 = result.mp4;
    const title = videoTitle || result.title;
    
    await message.reply(`Downloading: ${title}...`);
    await client.sendMessage(
      message.jid,
      {
        video: { url: mp4 },
        mimetype: "video/mp4",
        fileName: `${title}.mp3`,
      },
      { quoted: message.data }
    );
  } catch (error) {
    console.error("Error:", error);
    await message.reply("An error occurred while processing your request. Please try again later.");
  }
});
rudhra({
  pattern: "ytv ?(.*)",
  fromMe: mode,
  desc: "Search and download audio from YouTube.",
  type: "downloader",
}, async (message, match, client) => {
  match = match || message.reply_message.text;
    if (!match) return await message.reply("Give me a YouTube link");
    if (!isUrl(match)) return await message.reply("Give me a YouTube link");
    

  try {
    const { baseUrl, apiKey } = await getApiConfig();
    let videoUrl, videoTitle;

    if (match.startsWith("http")) {
      videoUrl = match;
    } else {
      const { videos } = await yts(match);
      if (!videos || videos.length === 0) {
        return await message.reply("No results found for your search query.");
      }

      const firstVideo = videos[0];
      videoUrl = firstVideo.url;
      videoTitle = firstVideo.title;
    }


    const encodedUrl = encodeURIComponent(videoUrl);
    const ytApi = `${baseUrl}api/download/yt?url=${encodedUrl}&apikey=${apiKey}`;
    const response = await fetch(ytApi);
    const data = await response.json();

   
    const { result } = data;
    if (!result || !result.mp4 || !result.title) {
      return await message.reply("Failed to fetch audio details. Please try again.");
    }

    const mp4 = result.mp4;
    const title = videoTitle || result.title;
    
    await message.reply(`Downloading: ${title}...`);
    await client.sendMessage(
      message.jid,
      {
        video: { url: mp4 },
        mimetype: "video/mp4",
        fileName: `${title}.mp3`,
      },
      { quoted: message.data }
    );
  } catch (error) {
    console.error("Error:", error);
    await message.reply("An error occurred while processing your request. Please try again later.");
  }
});

rudhra({
    pattern: 'play ?(.*)',
    fromMe: mode,
    desc: 'Search and download audio or video from YouTube',
    type: 'downloader'
}, async (message, match, client) => {
    const { baseUrl, apiKey } = await getApiConfig();

    if (!match) {
        await client.sendMessage(message.jid, { text: "Please provide a YouTube URL or search query after the command. Example: .play <search query>" });
        return;
    }

    const api = `${baseUrl}api/download/yt?apikey=${apiKey}`;

    let videoUrl = match;

    if (!match.startsWith('http')) {
        try {
            const results = await yts(match);
            if (!results || results.videos.length === 0) {
                await client.sendMessage(message.jid, { text: "No results found for your search." });
                return;
            }
            videoUrl = results.videos[0].url;
        } catch (error) {
            await client.sendMessage(message.jid, { text: "Error occurred while searching. Please try again." });
            return;
        }
    }

    const url = encodeURIComponent(videoUrl);
    const yt = `${api}&url=${url}`;

    try {
        const dwn = await fetch(yt);
        const dn = await dwn.json();

        if (!dn.result || !dn.result.mp4) {
            await client.sendMessage(message.jid, { text: "Error fetching media. Please try again." });
            return;
        }

        const mp4 = dn.result.mp4;
        const thumbnail = dn.result.thumb;
        const sourceurl = dn.result.source;

        const optionsText = `*_${dn.result.title}_*\n\n\`\`\`1.\`\`\` *audio*\n\`\`\`2.\`\`\` *video*\n\n_*Send a number as a reply to download*_`;

        const contextInfoMessage = {
            text: optionsText,
            contextInfo: {
                mentionedJid: [message.sender],
                externalAdReply: {
                    title: data.title,
                    body: "ʀᴜᴅʜʀᴀ ʙᴏᴛ",
                    sourceUrl: data.source_url,
                    mediaUrl: data.source_url,
                    mediaType: 1,
                    showAdAttribution: true,
                    renderLargerThumbnail: false,
                    thumbnailUrl: data.thumbnail
                }
            }
        };

        const sentMsg = await client.sendMessage(message.jid, contextInfoMessage, { quoted: message.data });

           client.ev.on('messages.upsert', async (msg) => {
            const newMessage = msg.messages[0];

            if (
                newMessage.key.remoteJid === message.jid &&
                newMessage.message?.extendedTextMessage?.contextInfo?.stanzaId === sentMsg.key.id
            ) {
                const userReply = newMessage.message?.conversation || newMessage.message?.extendedTextMessage?.text;

                if (userReply === '1') {
                    await client.sendMessage(
                        message.jid,
                        {
                            audio: { url: mp4 },
                            mimetype: 'audio/mpeg',
                            fileName: `rudhra-bot.mp3`,
                            contextInfo: { externalAdReply: externalAdReply }
                        },
                        { quoted: message.data }
                    );
                } else if (userReply === '2') {
                    await client.sendMessage(
                        message.jid,
                        {
                            video: { url: mp4 },
                            mimetype: 'video/mp4',
                            caption: `*Title:* ${dn.result.title}\n*Duration:* ${dn.result.duration} seconds`,
                            contextInfo: { externalAdReply: externalAdReply }
                        },
                        { quoted: message.data }
                    );
                } else {
                    await client.sendMessage(message.jid, { text: "Invalid option. Please reply with 1 or 2." });
                }
            }
        });
    } catch (error) {
        await client.sendMessage(message.jid, { text: "An error occurred while fetching media. Please try again." });
    }
});
rudhra({
  pattern: 'yts ?(.*)', 
  fromMe: mode,
  desc: 'Search for videos on YouTube.',
  type: 'downloader'
}, async (message, match, client) => {
  const query = match;
  if (!query) {
    return await message.reply('*Please provide a search query.*');
  }

  yts(query, async (err, result) => {
    if (err) {
      return message.reply('*Error occurred while searching YouTube.*');
    }

    if (result && result.videos.length > 0) {
      let formattedMessage = '*YouTube Top 10 Search Results:*\n\n';
      
      result.videos.slice(0, 10).forEach((video, index) => {
        formattedMessage += `*${index + 1},* *Title :* ${video.title}\n   *Duration :* ${video.duration}\n   *Link :* ${video.url}\n\n`;
      });

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
    } else {
      await message.reply('*No results found for that query.*');
    }
  });
});
