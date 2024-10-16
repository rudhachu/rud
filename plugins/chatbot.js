const {
        rudhra,
        getJson,
} = require('../lib');
const config = require("../config");

rudhra({
        on: 'text',
        fromMe: mode
}, async (m, match) => {
        //if(m.isCreator) return;
        if(config.CHATBOT == 'true') {
                let data = await getJson(
                        `http://api.brainshop.ai/get?bid=164220&key=gnaRnC9taxheZSzu&uid=[${m.sender.split('@')[0]}]&msg=[${m.test}]`
                )
                return await m.reply(data.cnt)
        } else if(config.CHATBOT == 'group' && m.isGroup) {
                let data = await getJson(
                        `http://api.brainshop.ai/get?bid=164220&key=gnaRnC9taxheZSzu&uid=[${m.sender.split('@')[0]}]&msg=[${m.test}]`
                )
                return await m.reply(data.cnt)
        } else if(config.CHATBOT == 'pm' && !m.isGroup) {
                let data = await getJson(
                        `http://api.brainshop.ai/get?bid=164220&key=gnaRnC9taxheZSzu&uid=[${m.sender.split('@')[0]}]&msg=[${m.test}]`
                )
                return await m.reply(data.cnt)
        }
});
