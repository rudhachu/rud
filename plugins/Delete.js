const { rudhra, numToJid } = require("../lib/");
const { ANTI_DELETE, SUDO } = require("../config");

rudhra(
  {
    on: "delete",
    fromMe: false,
    desc: "anti delete",
    type: "whatsapp",
  },
  async (message) => {
    if (!ANTI_DELETE) return;

    try {
      // Ensure message.client.store and messageId are available
      if (!message.client.store) {
        console.error("Message store is not initialized.");
        return;
      }

      if (!message.messageId) {
        console.error("Message ID is undefined.");
        return;
      }

      // Load the deleted message
      const msg = await message.client.store.messages.get(message.chatId)?.get(message.messageId);

      if (!msg || !msg.message) {
        console.error("Failed to retrieve deleted message.");
        return;
      }

      // Extract sender name
      const name = msg.pushName?.trim().replace(/\s+/g, " ") || "unknown sender";

      // Get SUDO JID
      const sudo = numToJid(SUDO.split(",")[0]) || message.client.user?.id;
      if (!sudo) {
        console.error("SUDO JID is undefined.");
        return;
      }

      // Forward the deleted message
      await message.rudhforwardMessage(sudo, msg.message, {
        contextInfo: {
          isForwarded: false,
          externalAdReply: {
            title: "Deleted Message",
            body: `From: ${name}`,
            mediaType: 1,
            thumbnailUrl: "https://i.imgur.com/NezTSpv.png",
            mediaUrl: "https://www.youtube.com/princerudh",
            sourceUrl: "https://www.youtube.com/princerudh",
          },
        },
        quoted: msg.message,
      });
    } catch (error) {
      console.error("Error in anti-delete handler:", error);
    }
  }
);
