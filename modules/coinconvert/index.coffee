request = require "request"
rateLimit = require "../../lib/rateLimit"
c = require "irc-colors"

module.exports = init: (bot, config, modules) ->

  if modules.man
    modules.man.page "coin",
      "Convert between crypto-currencies using #{c.underline "http://cryptocoincharts.info/"}.
      Usage: #{c.red "#{config.global.prefix}coin <amount> <source currency> to <dest currency>"}"

  limiter = rateLimit
    rate: 0.7
    strikes: 5
    cooldown: 10

  bot.msg ///^#{config.global.prefix}coin\s+(\d+)\s+(\w+)\s+to\s+(\w+)$///i, (nick, channel, match) ->
    limiter nick,
      no: (strikes) -> if strikes == 1 then bot.say channel, "#{nick}: trading level = TOO INTENSE"
      go: () ->
        value = Number match[1]
        source = match[2]
        dest = match[3]

        # using public API documented at: http://www.cryptocoincharts.info/v2/tools/api
        request.get "http://api.cryptocoincharts.info/tradingPair/#{source}_#{dest}", (error, response, body) ->
          if error then throw error

          # if we requested a valid trading pair
          pair = JSON.parse body
          if pair.id
            bot.say channel, "#{nick}: #{value} #{pair.coin1 || source} = #{pair.price * value} #{pair.coin2 || dest}, best market: #{pair.best_market}"
          else
            bot.say channel, "#{nick}: No exchange information available for #{source} to #{dest}"
