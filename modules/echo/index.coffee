rateLimit = require "../../lib/rateLimit"
#todo: pull rateLimit out of this project

module.exports = init: (config, bot) ->
  prefix = config.global.prefix || "!"

  limiter = rateLimit
    rate: 0.3
    burst: 2
    strikes: 3
    cooldown: 60

  bot.msg ///^#{prefix}echo\s+(.+)$///i, (nick, channel, match) ->
    limiter nick,
      go: () -> bot.reply nick, channel, match[1]
      no: (strike) -> bot.say nick, "Enhance your calm! (Strike #{strike} of 3)"