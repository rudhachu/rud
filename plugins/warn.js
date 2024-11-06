const { rudhra, isAdmin, parsedJid, mode } = require("../lib");
const { PausedChats, WarnDB } = require("../lib");
const { WARN_COUNT } = require("../config");
const { saveWarn, resetWarn } = WarnDB;

const checkPermissions = async (message) => {
    if (message.isSudo) return true;
    if (!config.ADMIN_ACCESS) return false;
    return await isAdmin(message.jid, message.sender, message.client);
};

rudhra({
    pattern: "warn",
    fromMe: false,
    onlyGroup: true,
    desc: "Warn a user",
    type: "group",
  },
  async (message, match) => {
    const userId = message.mention[0] || message.reply_message.jid;
    if (!userId) return await message.reply("_Mention or reply to someone_");
    
    let isadmin = await isAdmin(message.jid, message.user, message.client);
    if (!isadmin) return await message.reply("_You must be an admin to issue warnings._");

    let reason = match || message?.reply_message?.text || "Reason not provided";

    const warnInfo = await saveWarn(userId, reason);
    const userWarnCount = warnInfo ? warnInfo.warnCount : 1;

    await message.reply(
      `_User @${userId.split("@")[0]} warned._\n_Warn Count: ${userWarnCount}_\n_Reason: ${reason}_`,
      { mentions: [userId] }
    );

    if (userWarnCount > WARN_COUNT) {
      await message.sendMessage(message.jid, "Warn limit exceeded, kicking user.");
      return await message.client.groupParticipantsUpdate(message.jid, [userId], "remove");
    }
  }
);

rudhra({
    pattern: "resetwarn",
    fromMe: false,
    onlyGroup: true,
    desc: "Reset warnings for a user",
    type: "group",
  },
  async (message) => {
    const userId = message.mention[0] || message.reply_message.jid;
    if (!userId) return await message.reply("_Mention or reply to someone_");

    let isadmin = await isAdmin(message.jid, message.user, message.client);
    if (!isadmin) return await message.reply("_You must be an admin to reset warnings._");

    await resetWarn(userId);
    return await message.reply(
      `_Warnings for @${userId.split("@")[0]} reset_`,
      { mentions: [userId] }
    );
  }
);
