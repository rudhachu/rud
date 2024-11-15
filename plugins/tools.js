const { rudhra, mode } = require("../lib/");
const { downloadMediaMessage } = require("@whiskeysockets/baileys");

rudhra(
  {
    pattern: "vo",
    fromMe: mode,
    desc: "Bypass view-once messages",
    type: "user",
  },
  async (message, match, m) => {
    try {
      // Check if the message is a reply to a view-once message
      if (
        !message.reply_message ||
        (!m.quoted.message.viewOnceMessageV2 && !m.quoted.message.viewOnceMessageV2Extension)
      ) {
        return await message.reply("*Reply to a view-once message!*");
      }

      // Handle view-once image or video
      const isViewOnceV2Extension = m.quoted.message.viewOnceMessageV2Extension;
      const viewOnceMessage = isViewOnceV2Extension
        ? m.quoted.message.viewOnceMessageV2Extension
        : m.quoted.message.viewOnceMessageV2;

      // Download the view-once media
      const downloadedMedia = await downloadMediaMessage(
        viewOnceMessage,
        "buffer",
        {},
        { reuploadRequest: message.client.updateMediaMessage }
      );

      // Define the response message metadata
      const contextInfo = {
        externalAdReply: {
          title: "𝗥𝗨𝗗𝗛𝗥𝗔-𝗕𝗢𝗧",
          body: "Anti view-once bypass successful",
          sourceUrl: "",
          mediaUrl: "",
          mediaType: 1,
          showAdAttribution: true,
          renderLargerThumbnail: false,
          thumbnailUrl: "https://raw.githubusercontent.com/rudhra-prh/media/refs/heads/main/image/botra.png",
        },
      };

      // Send the downloaded media
      if (isViewOnceV2Extension) {
        // If it's an audio file
        await message.client.sendMessage(
          message.jid,
          { audio: downloadedMedia, mimetype: "audio/mpeg", contextInfo },
          { quoted: message.data }
        );
      } else {
        // If it's an image
        await message.client.sendMessage(
          message.jid,
          { image: downloadedMedia, contextInfo },
          { quoted: message.data }
        );
      }
    } catch (error) {
      console.error("Error handling view-once message:", error);
      await message.reply("*Failed to process the view-once message.*");
    }
  }
);
