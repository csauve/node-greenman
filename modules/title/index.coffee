request = require "request"
c = require "irc-colors"

TITLE_REGEX = /(<\s*title[^>]*>(.+?)<\s*\/\s*title)>/g

module.exports =
  resolve: (url, callback) ->
    request.get url, (error, response, body) ->
      if error then return callback error
      if response.statusCode != 200 then return callback new Error "Response not OK"

      TITLE_REGEX.lastIndex = 0
      match = TITLE_REGEX.exec body
      if match
        callback null, match[2]
      else
        callback new Error "No <title> tags found"

  init: (bot, config, modules) ->
    if modules.man
      modules.man.page "title", "Provides page titles for URLs posted. Can be used as a dependency of other modules"

    bot.msg /(?:.*\s+|^)((http:\/\/|https:\/\/|www\.)(\S)+)(?:\s+.*|$)/i, (nick, channel, match) ->
      url = match[1]

      module.exports.resolve url, (error, title) ->
        if !error then bot.say channel, "[ #{c.teal title} ]"
