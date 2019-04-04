'use strict';
const Moment = require('moment-timezone');

/**
 * Has information of the chat
 */
class Chat {
  /**
   * Creates an instance of a chat
   * @param {String} id Firebase Id
   * @param {Number} chatId  Id of the telegram chat
   * @param {String} timezone Timezone of the chat
   */
  constructor(id = null, chatId, timezone) {
    this._id = id;
    this._chatId = chatId;
    this._timezone = timezone;
  }

  /**
   * Firebase created id
   * @returns {String} chat id in firebase
   */
  get id() {
    return this._id;
  }

  /**
   * 
   * @returns {Number} id of the chat
   */
  get chatId() {
    return this._chatId;
  }

  /**
   * 
   * @returns {String} timezone of the chat
   */
  get timezone() {
    return this._timezone;
  }

  /**
   * @param {String} timezone Zone where the chat is taking place (mainly)
   */
  set timezone(timezone) {
    this._timezone = timezone;
  }

  /**
   * @returns {String} Hours and minutes in the chat (e.g. 6:30 => 630)
   * @throws {Error} Thrown if the specified timezone is not found
   */
  get hourAndMinutes() {
    const time = moment().tz(this._timezone);
    if (time === undefined) {
      throw Error('This chat has an incorrect timezone, please specify another');
    }
    const hourAndMinutes = time.format('hm');
    return hourAndMinutes;
  }

}

module.exports = Chat;