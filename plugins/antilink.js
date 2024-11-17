const { rudhra, mode, isUrl, isAdmin, deleteMessage, removeParticipant } = require("../lib/");
const config = require("../config");

rudhra({
    on: "text",
    fromMe: false,
    onlyGroup: true,
    type: 'group',
    desc: 'AntiLink Delete message sent by a participant.',
}, async (message, match) => {
    if (!message.isGroup) return;

    if (config.ANTILINK && isUrl(match)) {
        await message.reply("_Link detected_");

        const botIsAdmin = await message.isAdmin(message.user);
        if (!botIsAdmin) {
            return await message.reply("*_I'm not an admin. Please make me an admin to enforce rules!_*");
        }

        const senderIsAdmin = await isAdmin(message.jid, message.user, message.client);
        if (senderIsAdmin) {
            return; // Do nothing if the sender is an admin
        }

        try {
            if (!message.quoted) {
                return await message.reply("_Error: Unable to find the quoted message._");
            }

            // Delete the message
            await deleteMessage(message.client, message.chat, message.quoted);

            const num = message.quoted.sender;
            if (num === message.user) {
                return await message.reply("_I cannot remove myself from the group!_");
            }

            // Kick the user
            await removeParticipant(message.client, message.jid, num);

            const userMention = `@${num.split("@")[0]}`;
            return await message.client.sendMessage(message.jid, {
                text: `*_ ${userMention}, has been removed for sharing prohibited links._*`,
                mentions: [num],
            });
        } catch (error) {
            console.error("Error:", error);
            return await message.reply("_An error occurred while enforcing the rule. Please check the logs._");
        }
    }
});
