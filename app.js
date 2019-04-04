require('dotenv').config();

const Telebot = require('telebot');
const Moment = require('moment-timezone');
const Timezones = require('./src/timezones.js');
const Giphy = require('giphy-api')(process.env.GIPHY_TOKEN);
const Chats = require('./src/chats.js');
const Chat = require('./models/chat.js');
const bot = new Telebot({
    token: process.env.TELEGRAM_BOT_TOKEN,
    usePlugins: ['askUser', 'commandButton', 'namedButtons'],
    pluginFolder: '../plugins/',
});

/** Giphy tags */
const GIF_TAGS = ['420', 'WEED', 'marijuana', 'blunt'];

/** Stores the user selected region when doing the /timezone event */
const usrRegion = {};

bot.on('ask.region', msg => {
    const chatId = msg.chat.id;
    const region = msg.text;

    if (!Timezones.hasRegion(region)) {
        return msg.reply.text('That region doesn\'t exists');
    }

    const areasButtons = Timezones.getRegionAreasButtons(region);
    usrRegion[chatId] = region;

    return bot.sendMessage(chatId,
        `Please specify the nearest area`, {
            replyMarkup: bot.keyboard(
                areasButtons, {
                    resize: false,
                    once: true,
                    selective: true
                }
            ),
            replyToMessage: msg.message_id,
            ask: `area`
        });
});


bot.on('ask.area', async msg => {
    const chatId = msg.from.id;
    const msgId = msg.message_id;
    const region = usrRegion[chatId];
    const area = msg.text;
    delete usrRegion[chatId];

    const chat = new Chat(null, chatId, `${region}/${area}`);
    let response;
    try {
        const serverResponse = await Chats.postChat(chat)
        response = serverResponse;
    } catch (error) {
        response = `There was an error while updating the timezone, this is the server response:\n\`${error}\``;
    }
    bot.sendMessage(chatId,
        response, {
            parseMode: 'Markdown',
            replyToMessage: msgId,
        });
});

bot.on(['/start', '/420'], async msg => {
    const chatId = msg.chat.id;
    const msgId = msg.message_id;
    Moment.tz.setDefault();
    const zone = Moment.tz.guess();
    const chat = new Chat(null, chatId, zone);

    let response;
    try {
        if (await Chats.chatExists(chat)) {
            const serverChat = await Chats.getChat(chat.chatId);
            response = `This chat already exists with the **${serverChat.timezone}** timezone, \nif you wish to change the timezone use the \`/timezone\` event`;
        } else {
            const serverResponse = await Chats.postChat(chat);
            response = `The chat created with the **${zone}** timezone,\nif you wish to change the timezone use the \`/timezone\` event`;
        }
    } catch (error) {
        response = `There was an error while starting the bot, this is the server response:\n\`${error}\``;
    }
    bot.sendMessage(chatId,
        response, {
            parseMode: 'Markdown',
            replyToMessage: msgId,
        });
});

bot.on('/un420', async (msg) => {
    const chatId = msg.from.id;
    const msgId = msg.message_id;
    let response;
    try {
        const serverResponse = await Chats.deleteChat(chatId);
        response = serverResponse;
    } catch (error) {
        response = `There was an error while deleting the bot, this is the server response:\n\`${error}\``;
    }
    bot.sendMessage(chatId,
        response, {
            parseMode: 'Markdown',
            replyToMessage: msgId,
        });
});

bot.on('/timezone', (msg) => {
    const chatId = msg.chat.id;
    const regionButtons = Timezones.getRegionButtons();
    return bot.sendMessage(chatId, `Please specify the region`, {
        replyMarkup: bot.keyboard(
            regionButtons, {
                resize: false,
                once: true,
                selective: true
            }
        ),
        replyToMessage: msg.message_id,
        ask: 'region'
    });
});

bot.on('tick', async (msg, dk, tick) => {
    if (twentyMinutesIn()) {
        const chatIds = await fourTwentyChats();
        if (chatIds.length > 0) {
            sendFourTwentyGif(chatIds);
        }
    }
});

bot.start();

/**
 * Sends a random gif to all the chats in the [chatIds] list
 * from Giphy using a random tag from the 
 * list of tags stored in [GIF_TAGS]
 * @param {String} chatsIds Chats that are going to receive the 420 gifs
 */
async function sendFourTwentyGif(chatsIds) {
    try {
        for (const index in chatIds) {
            const tagIndex = Math.floor(Math.random() * (GIF_TAGS.length));
            Giphy.random({
                    tag: GIF_TAGS[tagIndex],
                    fmt: 'json',
                },
                (err, res) => {
                    if (err) {
                        console.error('Error', err);
                        return;
                    }

                    const gifURL = res.data.image_url;
                    const gifTag = GIF_TAGS[tagIndex];
                    bot.sendDocument(chatIds[index], gifURL, {
                        caption: `Here is your 420 gif (#${gifTag} tag used). See you in 12 hours`,
                    });
                });
        };
    } catch (err) {
        console.error('sendFourTwentyGif', err);
    }
}

/**
 * Validates whether the current time is 420
 * using the default timezone
 * @returns {Array<String>} Returns the chatsIds where is currently 420
 */
async function fourTwentyChats() {
    const chatsIds = [];

    try {
        const chats = await Chats.getChats();
        const chatsTimezones = [];

        //We get all chats timezones and exclude repeated
        for (let index = 0; index < chats.length; index++) {
            const timezone = chats[index].timezone;
            if (!chatsTimezones.includes(timezone)) {
                chatsTimezones.push(timezone);
            }
        }

        //We check in each timezone whether or not is 420 already
        for (let index = 0; index < chatsTimezones.length; index++) {
            const timezone = chatsTimezones[index];
            const moment = Moment().tz(timezone);
            const hourMinute = moment.format('hm');
            if (hourMinute === '420') {
                const fourTwentyChats = chats.filter((chat) => chat.timezone === timezone);
                chatsIds.push(chats.map((chat) => chat.chatId));
            }
        }

        return chatsIds;
    } catch (err) {
        console.error('isFourTwenty', err);
        throw Error(err);
    }
}

/**
 * Checks if its the 20th minute of the hour
 * @returns {boolean} If its the 20th minute of the hour or not
 */
function twentyMinutesIn() {
    const moment = Moment();
    const minutes = moment.format('mm');
    return minutes === '20';
}