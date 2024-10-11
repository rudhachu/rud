const { rudhra,mode, getJson } = require("../lib/");
const config = require("../config");
rudhra ({
    pattern: "naruto",
    fromMe: mode,
    desc: "random Naruto anime videos",
    type: "AnimeVideo",
}, async (message, match) => {
  const { result } = await getJson(apiUrl + 'api/anime/naruto?apikey=rudhra-bot');
  message.sendFromUrl(result.url, {
    contextInfo: {
      mentionedJid: [message.sender],
      forwardingScore: 1,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363298577467093@newsletter',
        newsletterName: "ʀᴜᴅʜʀᴀ-ʙᴏᴛ",
        serverMessageId: -1
      }
    },
    caption: `${config.CAPTION}`
  });
});

rudhra ({
    pattern: "anime",
    fromMe: mode,
    desc: "random  anime videos",
    type: "AnimeVideo",
}, async (message, match) => {
const { result } = await getJson(apiUrl + 'api/anime/anivideo?apikey=rudhra-bot');
  message.sendFromUrl(result.url, {
    contextInfo: {
      mentionedJid: [message.sender],
      forwardingScore: 1,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363298577467093@newsletter',
        newsletterName: "ʀᴜᴅʜʀᴀ-ʙᴏᴛ",
        serverMessageId: -1
      }
    },
    caption: `${config.CAPTION}`
  });
});
 rudhra ({
    pattern: "mstatus",
    fromMe: mode,
    desc: "random Malayalam status videos",
    type: "media",
}, async (message, match) => {
const { result } = await getJson(apiUrl + 'api/randomvideo/msts?apikey=rudhra-bot')
  message.sendFromUrl(result.url, {
    contextInfo: {
      mentionedJid: [message.sender],
      forwardingScore: 1,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363298577467093@newsletter',
        newsletterName: "ʀᴜᴅʜʀᴀ-ʙᴏᴛ",
        serverMessageId: -1
      }
    },
    caption: `${config.CAPTION}`
  });
});rudhra ({
    pattern: "onepiece",
    fromMe: mode,
    desc: "random one-piece anime status ",
    type: "AnimeVideo",
}, async (message, match) => {
const url = apiUrl + 'api/anime/onepiece?apikey=rudhra-bot'
  message.sendFromUrl(url, {
    contextInfo: {
      mentionedJid: [message.sender],
      forwardingScore: 1,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363298577467093@newsletter',
        newsletterName: "ʀᴜᴅʜʀᴀ-ʙᴏᴛ",
        serverMessageId: -1
      }
    },
    caption: `${config.CAPTION}`
  });
});
rudhra ({
    pattern: "onepiece",
    fromMe: mode,
    desc: "random one-piece anime status ",
    type: "AnimeVideo",
}, async (message, match) => {
const url = apiUrl + 'api/anime/onepiece?apikey=rudhra-bot'
  message.sendFromUrl(url, {
    contextInfo: {
      mentionedJid: [message.sender],
      forwardingScore: 1,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363298577467093@newsletter',
        newsletterName: "ʀᴜᴅʜʀᴀ-ʙᴏᴛ",
        serverMessageId: -1
      }
    },
    caption: `${config.CAPTION}`
  });
});
rudhra ({
    pattern: "demonslayer",
    fromMe: mode,
    desc: "random demonslayer anime status ",
    type: "AnimeVideo",
}, async (message, match) => {
const url = apiUrl + 'api/anime/demonslayer?apikey=rudhra-bot'
  message.sendFromUrl(url, {
    contextInfo: {
      mentionedJid: [message.sender],
      forwardingScore: 1,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363298577467093@newsletter',
        newsletterName: "ʀᴜᴅʜʀᴀ-ʙᴏᴛ",
        serverMessageId: -1
      }
    },
    caption: `${config.CAPTION}`
  });
});

