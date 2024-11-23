const {
  rudhra,
  mode,
  getJson,
  PREFIX,
  getBuffer,
  parsedUrl
} = require("../lib");
const axios = require('axios');
const fetch = require('node-fetch');
const yts = require("yt-search");

rudhra({
    pattern: 'yta ?(.*)',
    fromMe: mode,
    desc: 'Download audio from YouTube.',
    type: 'info'
}, async (message, match, client) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply("Give me a YouTube link");

    const videoUrl = match;
    try {
        const response = await axios.get(`https://itzpire.com/download/youtube?url=${videoUrl}`);
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
