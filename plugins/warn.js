const { rudhra, isAdmin ,parsedJid, mode } = require("../lib");
const { PausedChats, WarnDB, saveWarn, resetWarn } = require("../lib");
const { WARN_COUNT } = require("../config");
const config = require('../config'); // Adjust the path as needed

const checkPermissions = async (message) => {
    if (message.isSudo) return true;
    if (!config.ADMIN_ACCESS) return false;
    return await message.isAdmin(message.sender);
};


rudhra({
    pattern: "warn",
    fromMe: false,
    onlyGroup: true,
    desc: "Warn a user",
    type: "group",
  },
async (message, match) => {
    if (!(await checkPermissions(message))) return;
    const user = message.mention[0] || message.reply_message.jid;
    if (!user) return message.reply("_Mention or reply to someone_");
    let isadmin = await isAdmin(message.jid, message.user, message.client);
    if (!isadmin) return
    let reason = message?.reply_message.text || match;
    reason = reason.replace(/@(\d+)/, "");
    reason = reason ? reason.length <= 1 : "Reason not Provided";

    const warnInfo = await saveWarn(user, reason);
    let userWarnCount = warnInfo ? warnInfo.warnCount : 0;
    userWarnCount++;
    await message.reply(
      `_User @${
        user.split("@")[0]
      } warned._ \n_Warn Count: ${userWarnCount}._ \n_Reason: ${reason}_`,
      { mentions: [user] }
    );
    if (userWarnCount > WARN_COUNT) {
      const jid = parsedJid(user);
      await message.sendMessage(
        message.jid,
        "Warn limit exceeded kicking user"
      );
      return await message.client.groupParticipantsUpdate(
        message.jid,
        jid,
        "remove"
      );
    }
    return;
  }
);

rudhra({
    pattern: "resetwarn",
    fromMe: false,
    onlyGroup: true,
    desc: "Reset warnings for a user",
    type: "group",
  },
async (message, match) => {
    if (!(await checkPermissions(message))) return;
    const user = message.mention[0] || message.reply_message.jid;
    if (!user) return message.reply("_Mention or reply to someone_");
    let isadmin = await isAdmin(message.jid, message.user, message.client);
    if (!isadmin) return
    await resetWarn(user);
    return await message.reply(
      `_Warnings for @${user.split("@")[0]} reset_`,
      {
        mentions: [user],
      }
    );
  }
);
