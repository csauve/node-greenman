Roll = require "roll"
roll = new Roll()
c = require "irc-colors"

module.exports = init: (bot, config, modules) ->
  if modules.man
    modules.man.page "roll", "Roll <dice> like #{c.red 'd20'}, #{c.red '2d6+1'}, #{c.red '5'}. Usage: #{c.red "#{config.global.prefix}d <dice>"}"

  bot.msg ///^#{config.global.prefix}d\s+(.+)$///i, (nick, channel, match) ->
    input = match[1]

    if /^\d+$/.test input
      sides = Number input
      if sides > 1
        input = "d#{input}"
        result = roll.roll(input).result
        bot.reply nick, channel, "A #{result} shows on the #{sides}-sided die"
        return

    if roll.validate input
      result = roll.roll(input).result
      bot.reply nick, channel, result
    else
      bot.reply nick, channel, "Bad format"