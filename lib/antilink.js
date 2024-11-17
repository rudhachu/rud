const isUrl = (text) => {
    // Simple URL detection (improve as needed)
    const urlRegex = /(https?:\/\/[^\s]+)/gi;
    return urlRegex.test(text);
};

const isAdmin = async (groupId, userId, client) => {
    try {
        const participants = await client.groupMetadata(groupId);
        const user = participants.participants.find((p) => p.id === userId);
        return user?.admin !== undefined;
    } catch (error) {
        console.error("Error checking admin status:", error);
        return false;
    }
};

const deleteMessage = async (client, chatId, message) => {
    try {
        await client.sendMessage(chatId, {
            delete: {
                remoteJid: chatId,
                fromMe: message.fromMe,
                id: message.id,
                participant: message.sender,
            },
        });
    } catch (error) {
        console.error("Error deleting message:", error);
        throw error;
    }
};

const removeParticipant = async (client, groupId, userId) => {
    try {
        await client.groupParticipantsUpdate(groupId, [userId], "remove");
    } catch (error) {
        console.error("Error removing participant:", error);
        throw error;
    }
};

module.exports = {
    isUrl,
    isAdmin,
    deleteMessage,
    removeParticipant,
};
