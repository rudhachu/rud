const fetch = require('node-fetch'); 
const { rudhra, mode, getJson } = require("../lib");

rudhra({
    pattern: 'insta ?(.*)',
    fromMe: mode,
    desc: 'Download Instagram Media.',
    type: 'downloader'
}, async (message, match, client) => {
    const insta = match || message.reply_message.text;

    if (!insta) {
        return await message.reply('Where is the URL?');
        return;
    }

    const url = `https://api.eypz.c0m.in/aio?url=${insta}`;
    const rudh = await getJson(url);
    const medias = rudh.medias;

    if (Array.isArray(medias) && medias.length > 0) {
        for (let fek of medias) {
            await message.sendFile(fek);
        }
    } else {
        await message.reply("No media found or an error occurred.");
    }
});
