const { rudhra, mode, isAdmin, sleep, parsedJid } = require("../lib/");
const config = require("../config");

// Function to check user permissions
const checkPermissions = async (message) => {
  if (message.isSudo) return true;
  if (!config.ADMIN_ACCESS) return false;
  return await message.isAdmin(message.sender);
};
  
rudhra({
    pattern: "del",
    fromMe: mode,  
    desc: "Delete messages",
    type: "group",
  },
  async (message, match) => {
    try{
      if (!message.isGroup) return;
      if (!message.reply_message) return;
    message.reply_message.jid;
    let key = await message.reply_message.key
    let isadmin = await isAdmin(message.jid, message.key.participant, message.client);
    if (!isadmin) return await message.reply("_You're not admin_");
    let ismeadmin = await isAdmin(message.jid, message.user, message.client);
    if (!ismeadmin) return await message.reply("_I'm not admin_");
    return await message.client.sendMessage(message.jid, { delete: key})
  } catch (error) {
    console.error("[Error]:", error);
  }

  }
);
