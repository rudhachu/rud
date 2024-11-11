const {
    rudhra,
    getWarn,
    isAdmin,
    config
} = require('../lib');


rudhra({
    pattern: 'warn ?(.*)',
    fromMe: true,
    onlyGroup: true,
    desc: "warn a user in group",
    type: "group",
}, async (message, match) => {
    if (!match && !message.reply_message.sender) return await message.send('warn <reply to a user>\nresetwarn');
    if (match == 'get') {
        const {
            warn
        } = await getWarn(['warn'], {
            jid: message.jid,
            content: {}
        }, 'get');
        if (!Object.keys(warn)[0]) return await message.send('_Not Found!_');
        let msg = '';
        for (const f in warn) {
            msg += `_*user:* @${f}_\n_*count:* ${warn[f].count}_\n_*remaining:* ${config.WARN_COUNT - warn[f].count}_\n\n`;
        }
        return await message.send(msg, {mentions: [message.reply_message.sender]});
    } else if (match == 'reset') {
        if (!message.reply_message.sender) return await message.send('reply to a user');
        const {
            warn
        } = await getWarn(['warn'], {
            jid: message.jid,
            content: {}
        }, 'get');
        if (!Object.keys(warn)[0]) return await message.send('_Not Found!_');
        if (!Object.keys(warn).includes(message.reply_message.number)) return await message.send('_User Not Found!_');
        await getWarn(['warn'], {
            jid: message.jid,
            content: {
                id: message.reply_message.number
            }
        }, 'delete');
        return await message.send('successfull');
    } else {
        const BotAdmin = await isAdmin(message);
        const admin = await isAdmin(message);
        if (!BotAdmin) return await message.reply('Iam not group admin');
        if (!message.reply_message.sender) return await message.send('replt to a user');
        const reason = match || 'warning';
        const {
            warn
        } = await getWarn(['warn'], {
            jid: message.jid,
            content: {}
        }, 'get');
        const count = Object.keys(warn).includes(message.reply_message.number) ? Number(warn[message.reply_message.number].count) + 1 : 1;
        await getWarn(['warn'], {
                jid: message.jid,
                content: {
                    [message.reply_message.number]: {
                        count
                    }
                }
            },
            'add');
        const remains = config.WARN_COUNT - count;
        let warnmsg = `╭─⚠︎ ❮ *ᴡᴀʀɴɪɴɢ* ❯ ⚠︎
│ _*ᴜsᴇʀ : @${message.reply_message.number}⁩*_
│ _*ᴡᴀʀɴ : ${count}*_
│ _*ʀᴇᴀsᴏɴ : ${reason}*_
│ _*ʀᴇᴍᴀɪɴɪɴɢ : ${remains}*_
╰──•`
        await message.send(warnmsg, {
            mentions: [message.reply_message.sender]
        })
        if (remains <= 0) {
            await getWarn(['warn'], {
                jid: message.jid,
                content: {
                    id: message.reply_message.number
                }
            }, 'delete');
            if (BotAdmin) {
                await message.client.groupParticipantsUpdate(message.from, [message.reply_message.sender], 'remove');
                return await message.reply('max warm reached, user kicked')
            };
        };
    };
})
