const { rudhra, mode } = require('../lib/');
const { Baileys } = require('@whiskeysockets/baileys');
rudhra({
    pattern: "vo",
    fromMe: mode,
    desc: "anti viewOnce",
    type: "user",
  },
  async (message, match, m) => {
if (!message.reply_message || (!m.quoted.message.viewOnceMessageV2 && !m.quoted.message.viewOnceMessageV2Extension)) return await message.reply('*_Reply at viewOnce message!_*')
    if(m.quoted.message.viewOnceMessageV2Extension){
const downloadedMedia1 = await downloadMediaMessage(m.quoted.message.viewOnceMessageV2Extension, 'buffer', {}, { reuploadRequest: message.client.updateMediaMessage })
await message.client.sendMessage(message.sender, { audio :downloadedMedia1 ,  mimetype:"audio/mpeg", contextInfo: { externalAdReply: {
title: "𝗥𝗨𝗗𝗛𝗥𝗔-𝗕𝗢𝗧",
body: "𝗔𝗻𝘁𝗶 𝘃𝗶𝗲𝘄𝗢𝗻𝗰𝗲 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹",
sourceUrl: "",
mediaUrl: "𝙡",
mediaType: 1,
showAdAttribution: true,
renderLargerThumbnail: false,
thumbnailUrl: "https://raw.githubusercontent.com/rudhra-prh/media/refs/heads/main/image/botra.png" }} },{ quoted: message.data })
} else if(m.quoted.message.viewOnceMessageV2){
const downloadedMedia = await downloadMediaMessage(m.quoted.message.viewOnceMessageV2, 'buffer', {}, { reuploadRequest: message.client.updateMediaMessage })
await message.client.sendMessage(message.sender, {image: downloadedMedia, contextInfo: { externalAdReply: {
title: "𝗥𝗨𝗗𝗛𝗥𝗔-𝗕𝗢𝗧",
body: "𝗔𝗻𝘁𝗶 𝘃𝗶𝗲𝘄𝗢𝗻𝗰𝗲 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹",
sourceUrl: "",
mediaUrl: "",
mediaType: 1,
showAdAttribution: true,
renderLargerThumbnail: false,
thumbnailUrl: "https://raw.githubusercontent.com/rudhra-prh/media/refs/heads/main/image/botra.png" }} },{ quoted: message.data })
}
  }
);
