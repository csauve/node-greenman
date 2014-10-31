request = require "request"
rateLimit = require "../../lib/rateLimit"
c = require "irc-colors"

QUERY_BASE_URL = "https://api.datamarket.azure.com/Bing/Search/v1/Web?$format=json&Query="

module.exports = init: (bot, config) ->
  accountKey = config?.bing?.accountKey
  if !accountKey then throw new Error "Configuration bing.accountKey was not provided"

  limiter = rateLimit
    rate: 0.3
    strikes: 5
    cooldown: 60

  bot.msg ///^#{config.global.prefix}bing\s+(.+)$///i, (nick, channel, match) ->
    limiter nick,
      no: (strikes) -> if strikes == 1 then bot.say nick, "Chill out, bro. Limit bing queries to 0.3 per second"
      go: () ->
        auth = new Buffer [config.bing.accountKey, config.bing.accountKey].join ':'

        request.get
          url: QUERY_BASE_URL + "'" + match[1] + "'"
          headers:
            "Authorization": "Basic " + auth.toString 'base64',
          (error, response, body) ->
            results = JSON.parse(body).d.results
            if results.length == 0
              bot.say channel, "#{nick}: No results found!"
            else
              topResult = results[0]
              bot.say channel, "#{nick}: #{c.underline.red topResult.Url} [#{topResult.Title}] #{topResult.Description}"
