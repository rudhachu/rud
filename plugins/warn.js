const { rudhra, isAdmin ,parsedJid, mode } = require("../lib");
const { exec } = require("child_process");
const { PausedChats, WarnDB } = require("../lib");
const { WARN_COUNT } = require("../config");
const { saveWarn, resetWarn } = require("../lib");


// Warn Command
rudhra({
    pattern: "warn",
    fromMe: mode,
    desc: "Warn a user",
  },
  async (message, match) => {
    // Identify the user to warn by mention or reply
    const userId = message.mention[0] || message.reply_message.jid;
    if (!userId) return message.reply("_Mention or reply to someone_");

    // Extract reason for the warning, remove any user mentions
    let reason = message?.reply_message.text || match;
    reason = reason.replace(/@(\d+)/, "");
    reason = reason ? reason : "Reason not Provided";

    // Save warning information and increment warn count
    const warnInfo = await saveWarn(userId, reason);
    let userWarnCount = warnInfo ? warnInfo.warnCount : 0;
    userWarnCount++;

    // Notify about the warning with details
    await message.reply(
      `_User @${
        userId.split("@")[0]
      } warned._ \n_Warn Count: ${userWarnCount}._ \n_Reason: ${reason}_`,
      { mentions: [userId] }
    );

    // Check if warn count exceeds limit and remove user if needed
    if (userWarnCount > WARN_COUNT) {
      await message.sendMessage(
        message.jid,
        "Warn limit exceeded. Kicking user."
      );
      return await message.client.groupParticipantsUpdate(message.jid, [num], "remove");
    }
    return;
  }
);

// Reset Warn Command
rudhra({
    pattern: "resetwarn",
    fromMe: mode,
    desc: "Reset warnings for a user",
  },
  async (message) => {
    // Identify the user to reset warnings by mention or reply
    const userId = message.mention[0] || message.reply_message.jid;
    if (!userId) return message.reply("_Mention or reply to someone_");

    // Reset warning count for the user
    await resetWarn(userId);

    // Confirm the reset with a reply
    return await message.reply(
      `_Warnings for @${userId.split("@")[0]} reset_`,
      { mentions: [userId] }
    );
  }
);
