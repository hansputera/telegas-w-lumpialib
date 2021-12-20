/**
 * @class Config - Config instance
 */
class Config {
  /**
   * Get telegram bot token
   * @return {string}
   */
  static get token() {
    return 'YOUR TELEGRAM BOT TOKEN';
  }

/**
 * Get owners id
 * @return {number[]}
 */
  static get owners() {
    return [
      1803044735,
    ]
  }
}

class CommandUtil {
  constructor() {
    this.commands = [];
  }

  register(...commands) {
    for (const command of commands) {
      if (!command.cooldown) command.cooldown = 5000;
      else if (!command.alias) command.alias = [];
    }
    this.commands = [...new Set(this.commands.concat(
      commands,
    ))];
  }

  /**
   * Use this method if you want search a command by command name.
   * @param {string} commandName
   */
  find(commandName) {
    return this.commands.find((command) => command.name === commandName.toLowerCase() || command.alias.includes(commandName.toLowerCase()));
  }

  /**
   * @param {string} commandName
   */
  remove(commandName) {
    this.commands = this.commands.filter((command) => command.name.toLowerCase() === commandName.toLowerCase() || command.alias.includes(commandName.toLowerCase()));
  }
}


class AnotherUtil {
  /**
   * Retrieve tiktok video result.
   * @param {string} videoUrl
   */
  static async tiktok(videoUrl) {
    const response = UrlFetchApp.fetch('https://tiktok-dl.tslab.site/api/download?url=' + videoUrl);
    return JSON.parse(
      response.getContentText(),
    );
  }
}

