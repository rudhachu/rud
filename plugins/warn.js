const { rudhra, mode, isAdmin, getWarn, parsedJid } = require("../lib/");
const config = require("../config");

const checkPermissions = async (message) => {
    if (message.isSudo) return true;
    if (!config.ADMIN_ACCESS) return false;
    return await message.isAdmin(message.sender);
};

rudhra({
    pattern: "warn ?(.*)",
    fromMe: false,
    onlyGroup: true,
    desc: "warn a user in group",
    type: "group",
}, async (message, match) => {
    if (!(await checkPermissions(message))) return;
    if (!match && !message.reply_message.sender) {
        return await message.reply("_Example:- warn get_\n_warn 9091808100@g.us <reply>\nwarn remove 9091808100@s.whatsapp.net_");
    }

    if (match == 'get') {
        const { warn } = await getWarn(['warn'], { jid: message.jid, content: {} }, 'get');
        if (!Object.keys(warn)[0]) return await message.reply("_Not Found!_");
        
        let msg = '';
        for (const f in warn) {
            msg += `_*User:* @${f}_\n_*Count:* ${warn[f].count}_\n_*Remaining:* ${config.WARN_COUNT - warn[f].count}`;
        }
        return await message.send(msg, { mentions: [message.reply_message.sender], quoted: message });
    
    } else if (match == 'reset') {
        if (!message.reply_message.sender) return await message.reply("_Please Reply To a user_");
        
        const { warn } = await getWarn(['warn'], { jid: message.jid, content: {} }, 'get');
        if (!Object.keys(warn)[0]) return await message.reply("_Not Found!_");
        if (!Object.keys(warn).includes(message.reply_message.number)) return await message.reply("_User Not Found!_");
        
        await getWarn(['warn'], { jid: message.jid, content: { id: message.reply_message.number } }, 'delete');
        return await message.reply("_Warn reset Successfully_");
    
    } else {
        const admin = await client.groupMetadata(jid);
        if (!admin) return await message.reply("_I'm not admin._");
        if (!message.reply_message.sender) return await message.reply("_Please Reply To a user_");

        const reason = match || 'warning';
        const { warn } = await getWarn(['warn'], { jid: message.jid, content: {} }, 'get');
        const count = Object.keys(warn).includes(message.reply_message.number) ? Number(warn[message.reply_message.number].count) + 1 : 1;
        
        await getWarn(['warn'], { jid: message.jid, content: { [message.reply_message.number]: { count } } }, 'add');
        
        const remains = config.WARN_COUNT - count;
        let warnmsg = `╭─❏ ❮ *ᴡᴀʀɴɪɴɢ* ❯ ❏
│ _*ᴜsᴇʀ : @${message.reply_message.number}⁩*_
│ _*ᴡᴀʀɴ : ${count}*_
│ _*ʀᴇᴀsᴏɴ : ${reason}*_
│ _*ʀᴇᴀᴍɪɴɢ : ${remains}*_
╰─❏`;

        // Corrected sendMessage function call
        await message.client.sendMessage(message.jid, warnmsg, {
            mentions: [message.reply_message.sender], 
            quoted: message
        });

        if (remains <= 0) {
            await getWarn(['warn'], { jid: message.jid, content: { id: message.reply_message.number } }, 'delete');
            if (admin) {
                await message.client.groupParticipantsUpdate(message.from, [message.reply_message.sender], 'remove');
                return await message.reply("_Max warns reached, kicked out!_");
            }
        }
    }
});
