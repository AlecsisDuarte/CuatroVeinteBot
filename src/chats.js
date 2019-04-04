require('dotenv').config();
const request = require('request-promise-native');
const BASE_URL = process.env.FIREBASE_DATABASE;
const Chat = require('../models/chat.js');


/**
 * Makes a request to our database to get all the chats
 * @returns {Promise<Array<Chat>>} Returns all the chats in the database
 */
async function getChats() {
  const uri = new URL('chats.json', BASE_URL).href;
  try {
    const response = await request.get(uri, {
      json: true
    });
    const chats = [];
    //There is not a single chat
    if (response !== 'null') {
      for (let id in response) {
        const chat = new Chat(id, response[id].chatId, response[id].timezone);
        chats.push(chat);
      }
    }
    
    // return Object.values(response).map((cht) => new Chat(cht.id, cht.chatId, cht.timezone));
    return chats;
  } catch (error) {
    console.error('getChats', error);
    throw Error(error.error);
  }
}

/**
 * @param {Chat} chat chat to save
 * @returns {Promise<String>} 
 */
async function postChat(chat) {
  if (await chatExists(chat)) {
    return await putChat(chat);
  }

  const uri = new URL('chats.json', BASE_URL).href;

  try {
    const response = await request.post(uri, {
      body: {
        chatId: chat.chatId,
        timezone: chat.timezone
      },
      json: true,
    });

    if (response !== null && response.name !== undefined) {
      return 'The chat timezone *updated succesfully*';
    }
    console.error('postChat_response', response);
    return 'Error while creating the chat, try again later';
  } catch (error) {
    console.error('postChat', error);
    throw Error(error.error);
  }
}

/**
 * Updates the chat in firebase
 * @param {Chat} chat chat to update
 */
async function putChat(chat) {
  const originalChat = await getChat(chat.chatId);
  const uri = new URL(`chats/${originalChat.id}.json`, BASE_URL).href;
  try {
    const response = await request.put(uri, {
      body: {
        chatId: chat.chatId,
        timezone: chat.timezone
      },
      json: true,
    });

    if (response !== null && response.chatId === chat.chatId) {
      return 'Chat updated correctly';
    }
    console.error('putChat_response', response);
    return 'Error while updating the chat, try again later';
  } catch (error) {
    console.error('postChat', error);
    throw Error(error.error);
  }

}

/**
 * Searches the chat in our database
 * @param {Chat} chat Chat to search
 */
async function chatExists(chat) {
  const chats = await getChats();
  if (chats.length > 0 && chats.some((cht) => cht.chatId === chat.chatId)) {
    return true;
  }
  return false;
}

/**
 * @param {String} chatId Telegram chat id
 * @returns {Promise<Chat>} Firebase chat version
 */
async function getChat(chatId) {
  const chats = await getChats();
  if (chats.length === 0) return null;
  return chats.find((chat, index) => chat.chatId === chatId);
}

/**
 * @param {String} chatId Telegram chat id
 */
async function deleteChat(chatId) {
  const chat = await getChat(chatId);
  if (chat === null) {
    return 'This chat doesn\'t exist';
  }
  const uri = new URL(`chats/${chat.id}.json`, BASE_URL).href;
  try {
    const response = await request.delete(uri);
    if (response === 'null') {
      return 'Chat *deleted* successfully';
    }
    console.error('deleteChat_response', response);
    return 'I couldn\'t delete the chat from firebase, try again later';
  } catch (error) {
    console.error('deleteChat', error);
    throw Error(error.error);
  }
}

module.exports = {
  getChats: getChats,
  postChat: postChat,
  chatExists: chatExists,
  getChat: getChat,
  deleteChat: deleteChat
}