const {
    rudhra,
    getJson,
    mode,
    getBuffer
} = require("../lib/");
const fetch = require('node-fetch');

rudhra({
    pattern: 'insta ?(.*)',
    fromMe: mode,
    desc: 'Download Instagram Reels',
    type: 'info'
}, async (message, match, client) => {
    const instaUrl = match || message.reply_message.text;

    if (!instaUrl) {
        return await message.reply('_Enter an Instagram URL!_');
    }

    try {
        let resi = await getJson(`https://api.devstackx.in/v1/igdl?url=${instaUrl}`);
        
        if (!resi || !resi.data || resi.data.length === 0) {
            return await message.reply('_No media found or invalid URL!_');
        }

        await message.sendMessage(message.jid, "_Uploading..._", { quoted: message.data });

        for (let media of resi.data) {
            await message.client.sendMessage(
                message.jid,
                { video: { url: media.url }, // Ensure proper format for sending media
                mimetype: "video/mp4"},
                { quoted: message.data }
            );
        }
    } catch (error) {
        console.error('Error fetching media:', error);
        await message.reply('_Error fetching media!_');
    }
});
