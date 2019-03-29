require('dotenv').config();
const Giphy = require('giphy-api')(process.env.GIPHY_TOKEN);
const Telebot = require('telebot');
const moment = require('moment-timezone');
const bot = new Telebot(process.env.TELEGRAM_BOT_TOKEN);

const GIF_TAGS = ['420', 'WEED', 'marijuana', 'blunt'];
const DEFAULT_TIMEZONE = 'America/Tijuana';

const chatIds = [];
let lastMinute = 0;

bot.on(['/420', '/start'], (msg) => {
    const chatId = msg.chat.id;
    addChatToChatsList(chatId);
});

bot.on('/un420', (msg) => {
    //   const chatId = msg.chat.id;
    msg.reply.text(`You wont be able to un-420 @${msg.from.username}`);
    // removeChatFromChatsList(chatId);
});

bot.on('/timezone', (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `The default timezone is **${DEFAULT_TIMEZONE}**`, {
        parseMode: 'Markdown'
    });
});

bot.on('tick', (msg, dk, tick) => {
    if (minuteLapsed() && isFourTwenty()) {
        sendFourTwentyGif();
    }
});

bot.start();

/**
 * Sends a random gif to all the chats in the [chatIds] list
 * from Giphy using a random tag from the 
 * list of tags stored in [GIF_TAGS]
 */
function sendFourTwentyGif() {
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
 * @returns {boolean} True or False if it's 420
 */
function isFourTwenty() {
    try {
        const mnt = moment().tz(DEFAULT_TIMEZONE);
        const hourMinute = mnt.format('hm');

        return hourMinute == '420';
    } catch (err) {
        console.error('isFourTwenty', err);
    }
}

/**
 * Validates whether a minute has passed or not
 * using the global variable [lastMinute]
 * @returns {boolean} True or False if a minute
 * has passed
 */
function minuteLapsed() {
    try {
        const mnt = moment().tz(DEFAULT_TIMEZONE);
        const minute = parseInt(mnt.format('mm'));
        const minuteDifference = minute - lastMinute;

        if (minuteDifference !== 0) {
            lastMinute = minute;
            return true;
        }
        return false;
    } catch (err) {
        console.error('minuteLapsed', err);
    }
}

/**
 * Adds a ChatId to the current List
 * @param {number} chatId Id of the Chat to add
 */
function addChatToChatsList(chatId) {
    try {
        if (!chatIds.includes(chatId)) {
            chatIds.push(chatId);
            bot.sendMessage(chatId, 'This chat has been **addedd** to my __420 chats__ list', {
                parseMode: 'Markdown'
            });
        } else {
            bot.sendMessage(chatId, 'This chat **already existsd** in my __420 chats__ list', {
                parseMode: 'Markdown'
            });
        }
    } catch (err) {
        console.error('addChatToChatsList', err);
    }
}

/**
 * Removes the ChatId from the list of chats
 * @param {number} chatId Id of the Chat to remove
 */
function removeChatFromChatsList(chatId) {
    let indexOfChatId = -1;
    try {
        if ((indexOfChatId = chatIds.indexOf(chatId)) >= 0) {
            chatIds.splice(indexOfChatId, 1);
            bot.sendMessage(chatId, 'The chat has been **removedd** from my __420 chats__ list', {
                parseMode: 'Markdown'
            });
        } else {
            bot.sendMessage(chatId, 'This chat **doesn\'t existd** in my __420 chats__ list', {
                parseMode: 'Markdown'
            });
        }
    } catch (err) {
        console.error('removeChatFromChatsList', err);
    }
}