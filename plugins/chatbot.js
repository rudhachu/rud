const { rudhra, getJson, mode } = require('../lib');
const config = require("../config");

rudhra({
        on: 'text',
        fromMe: mode,
}, async (message, match) => {
        //if(message.isCreator) return;
        if(config.CHATBOT == 'true') {
                let data = await getJson(
                        `http://api.brainshop.ai/get?bid=${config.BRAINSHOP.split(/[,;|]/)[0]}&key=${config.BRAINSHOP.split(/[,;|]/)[1]}&uid=[${message.sender.split('@')[0]}]&msg=[${message.body}]`
                )
                return await message.reply(data.cnt)
        } else if(config.CHATBOT == 'group' && message.isGroup) {
                let data = await getJson(
                        `http://api.brainshop.ai/get?bid=${config.BRAINSHOP.split(/[,;|]/)[0]}&key=${config.BRAINSHOP.split(/[,;|]/)[1]}&uid=[${message.sender.split('@')[0]}]&msg=[${message.body}]`
                )
                return await message.reply(data.cnt)
        } else if(config.CHATBOT == 'pm' && !message.isGroup) {
                let data = await getJson(
                        `http://api.brainshop.ai/get?bid=${config.BRAINSHOP.split(/[,;|]/)[0]}&key=${config.BRAINSHOP.split(/[,;|]/)[1]}&uid=[${message.sender.split('@')[0]}]&msg=[${message.body}]`
                )
                return await message.reply(data.cnt)
        }
});
