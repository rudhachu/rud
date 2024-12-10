const {
    rudhra,
    getJson,
    mode,
    getBuffer
} = require("../lib/");
const fetch = require('node-fetch');

rudhra({
    pattern: 'fb ?(.*)',
    fromMe: mode,
    desc: 'Download Facebook Videos',
    type: 'downloader'
}, async (message, match, client) => {
    const fbUrl = match || message.reply_message.text;

    if (!fbUrl) {
        return await message.reply('_Enter an Facebook URL!_');
    }

    try {
        let resi = await getJson(`https://api.devstackx.in/v1/fbdl?url=${fbUrl}`);
        
        if (!resi || !resi.data || resi.data.length === 0) {
            return await message.reply('_No media found or invalid URL!_');
        }

        await message.sendMessage(message.jid, "_Uploading..._", { quoted: message.data });

        for (let media of resi.data) {
            await message.client.sendMessage(
                message.jid,
                { video: { url: media.hd }, // Ensure proper format for sending media
                mimetype: "video/mp4"},
                { quoted: message.data }
            );
        }
    } catch (error) {
        console.error('Error fetching media:', error);
        await message.reply('_Error fetching media!_');
    }
});
