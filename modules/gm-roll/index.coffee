roll = require "roll"
c = require "irc-colors"

module.exports = init: (bot, config, modules) ->
  if modules.man
    modules.man.page "roll", "Roll dice like #{c.red 'd20'}, #{c.red '2d6+1'}, #{c.red '5'}. Usage: #{c.red "#{config.global.prefix}d <dice>"}"

  bot.msg ///^#{config.global.prefix}d\s+(.+)$///i, (nick, channel, match) ->
    # todo: handle '!d 5' case and use validate if PR accepted
    #valid = roll.validate match[1]

    result = roll.roll(match[1]).result
    bot.reply nick, channel, result
