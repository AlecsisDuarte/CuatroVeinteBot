require('dotenv').config();
const Giphy = require('giphy-api')(process.env.GIPHY_TOKEN);
const Telebot = require('telebot');
const moment = require('moment-timezone');
const bot = new Telebot(process.env.TELEGRAM_BOT_TOKEN);

const GIF_TAGS = ['420', 'WEED', 'marijuana', 'blunt'];
// const MAX_GIPHY_OFFSET = 100;
const DEFAULT_TIMEZONE = 'America/Tijuana';

const chatIds = [509707694];
let lastMinute = 0;

bot.on(['/420', '/start'], (msg) => {
    const chatId = msg.chat.id;
    addChatToChatsList(chatId);
});

bot.on('/un420', (msg) => {
    //   const chatId = msg.chat.id;
    msg.reply.text(`You wont be able to un-420 your ass @${msg.from.username}`);
    // removeChatFromChatsList(chatId);
});

bot.on('/timezone', (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `The default timezone is **${DEFAULT_TIMEZONE}**`, { parseMode: 'Markdown' });
});

bot.on('tick', (msg, dk, tick) => {
    if (minuteLapsed() && isFourTwenty()) {
        sendFourTwentyGif();
    }
});

bot.start();

function sendFourTwentyGif() {
    try {
        const tagIndex = Math.floor(Math.random() * (GIF_TAGS.length));
        Giphy.random(
            {
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
                for (const index in chatIds) {
                    bot.sendDocument(chatIds[index], gifURL, {
                        caption: `Here is your 420 gif (#${gifTag} tag used). See you in 12 hours`,
                    });
                };
            });
    } catch (err) {
        console.error('sendFourTwentyGif', err);
    }
}

function isFourTwenty() {
    try {
        const mnt = moment().tz(DEFAULT_TIMEZONE);
        const hourMinute = mnt.format('hm');

        return hourMinute == '420';
    } catch (err) {
        console.error('isFourTwenty', err);
    }
}

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

function addChatToChatsList(chatId) {
    try {
        if (!chatIds.includes(chatId)) {
            chatIds.push(chatId);
            bot.sendMessage(chatId, 'This chat has been **addedd** to my __420 chats__ list', { parseMode: 'Markdown' });
        } else {
            bot.sendMessage(chatId, 'This chat **already existsd** in my __420 chats__ list', { parseMode: 'Markdown' });
        }
    } catch (err) {
        console.error('addChatToChatsList', err);
    }
}

function removeChatFromChatsList(chatId) {
    let indexOfChatId = -1;
    try {
        if ((indexOfChatId = chatIds.indexOf(chatId)) >= 0) {
            chatIds.splice(indexOfChatId, 1);
            bot.sendMessage(chatId, 'The chat has been **removedd** from my __420 chats__ list', { parseMode: 'Markdown' });
        } else {
            bot.sendMessage(chatId, 'This chat **doesn\'t existd** in my __420 chats__ list', { parseMode: 'Markdown' });
        }
    } catch (err) {
        console.error('removeChatFromChatsList', err);
    }
}
