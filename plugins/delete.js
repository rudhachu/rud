const { rudhra, mode, isAdmin, sleep, parsedJid } = require("../lib/");
const config = require("../config");

// Function to check user permissions
const checkPermissions = async (message) => {
  if (message.isSudo) return true;
  if (!config.ADMIN_ACCESS) return false;
  return await message.isAdmin(message.sender);
};

rudhra(
  {
    pattern: "del",
    fromMe: mode,
    onlyGroup: true,
    desc: "Delete messages",
    type: "group",
  },
  async (message, match) => {
    try {
      // Ensure it's a group message and a reply to another message
      if (!message.isGroup) return;
      if (!message.reply_message) return await message.reply('_Reply to a message_');

      // Extract the key and check if the key.participant exists
      const key = message.reply_message.key;
      if (!key || !key.participant) return await message.reply("_Could not identify the participant_");

      // Check if the user issuing the command is an admin
      const isUserAdmin = await isAdmin(message.jid, message.sender, message.client);
      if (!isUserAdmin) return await message.reply("_You're not an admin_");

      // Check if the bot is an admin
      const isBotAdmin = await isAdmin(message.jid, message.user, message.client);
      if (!isBotAdmin) return await message.reply("_I'm not an admin_");

      // Delete the message
      await message.client.sendMessage(message.jid, { delete: key });

    } catch (error) {
      console.error("[Error]:", error);
      await message.reply('_An error occurred while trying to delete the message._');
    }
  }
);
