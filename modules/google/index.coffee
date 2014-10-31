request = require "request"
rateLimit = require "../../lib/rateLimit"
c = require "irc-colors"

module.exports = init: (bot, config, modules) ->
  if modules.man
    modules.man.page "google-search", "Gets the first Google result for a query. Usage: #{c.red "#{config.global.prefix}g <query>"}"
    modules.man.page "google-complete", "Get the top 5 Google auto-complete results. Usage: #{c.red "#{config.global.prefix}complete <query>"}"

  limiter = rateLimit
    rate: 0.3
    strikes: 5
    cooldown: 20

  bot.msg ///^#{config.global.prefix}g\s+(.+)$///, (nick, channel, match) ->
    limiter nick, go: () ->
      query = match[1]
      request.get "http://www.google.com/search?q=#{query}&btnI", (error, response, body) ->
        if error then throw error
        url = response.request.href

        # try to get the title
        if modules.title
          modules.title.resolve url, (error, title) ->
            if !error and title
              bot.reply nick, channel, "#{c.underline.red url} [ #{c.teal title} ]"
        else
          bot.reply nick, channel, c.underline.red url

  bot.msg ///^#{config.global.prefix}complete\s+(.+)$///, (nick, channel, match) ->
    limiter nick, go: () ->
      query = match[1]
      request.get "http://suggestqueries.google.com/complete/search?client=firefox&q=#{query}", (error, response, body) ->
        if error then throw error
        result = JSON.parse body
        if !result or !result[1] or result[1].length == 0
          return bot.reply nick, channel, "No suggestions found"

        top5 = result[1].slice 0, 5
        top5 = top5.map (suggestion) -> "'#{c.red suggestion}'"
        bot.reply nick, channel, top5.join ", "
