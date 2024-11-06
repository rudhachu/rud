const { rudhra, mode, isAdmin, sleep, parsedJid } = require("../lib/");
const config = require("../config");

// Function to check user permissions
const checkPermissions = async (message) => {
  if (message.isSudo) return true;
  if (!config.ADMIN_ACCESS) return false;
  return await message.isAdmin(message.sender);
};

rudhra({
    pattern: 'del$',
    fromMe: mode,
    desc: 'Delete message sent by the bot',
    type: 'whatsapp'
}, async (message, match, client) => {
    if (!message.reply_message) return await message.reply('_Reply to a message_');
    if (!message.quoted?.id || !message.quoted?.sender) return await message.reply("_Invalid message to delete_");

    await client.sendMessage(message.chat, {
        delete: {
            remoteJid: message.chat,
            fromMe: true,
            id: message.quoted.id,
            participant: message.quoted.sender
        }
    });
});

rudhra({
    pattern: 'dlt$',
    fromMe: false,
    onlyGroup: true,
    desc: 'Delete message sent by a participant',
    type: 'group'
}, async (message, match, client) => {
    if (!message.reply_message) return await message.reply('_Reply to a message_');
    const isBotAdmin = await isBotAdmins(message, client);
    if (!isBotAdmin) return await message.reply("I'm not an admin");

    if (!message.quoted?.id || !message.quoted?.sender) return await message.reply("_Invalid message to delete_");

    await client.sendMessage(message.chat, {
        delete: {
            remoteJid: message.chat,
            fromMe: message.quoted.fromMe,
            id: message.quoted.id,
            participant: message.quoted.sender
        }
    });
});

rudhra({
    pattern: 'edit ?(.*)',
    fromMe: true,
    desc: 'Edit message sent by the bot',
    type: 'whatsapp'
}, async (message, match, client) => {
    if (!message.reply_message) return await message.reply('_Reply to a message_');
    if (!match) return await message.reply('_Need text!_\n*Example: edit hi*');

    if (!message.quoted?.data?.key) return await message.reply("_Invalid message to edit_");

    await client.relayMessage(message.jid, {
        protocolMessage: {
            key: message.quoted.data.key,
            type: 14,
            editedMessage: {
                conversation: match
            }
        }
    }, {});
});
