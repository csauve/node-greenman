module.exports = init: (bot, config) ->
  bot.msg ///^(?:hello|hi|sup|yo|hey)\s+#{config.irc.nick}$///, (nick, channel) ->
    bot.say channel, "Hi, #{nick}!"
