request = require "request"
c = require "irc-colors"
async = require "async"
Entities = require("html-entities").XmlEntities

entities = new Entities()

TITLE_REGEX = /(<\s*title[^>]*>(.+?)<\s*\/\s*title)>/g

module.exports =
  resolve: (url, callback) ->
    request.get url, (error, response, body) ->
      if error then return callback error
      if response.statusCode != 200 then return callback new Error "Response not OK"

      TITLE_REGEX.lastIndex = 0
      match = TITLE_REGEX.exec body
      if match
        decoded = entities.decode match[2]
        callback null, decoded
      else
        callback new Error "No <title> tags found"

  init: (bot, config, modules) ->
    if modules.man
      modules.man.page "title", "Provides page titles for URLs posted. Can be used as a dependency of other modules"

    bot.msg /(?:.*\s+|^)((http:\/\/|https:\/\/|www\.)(\S)+)(?:\s+.*|$)/i, (nick, channel, match) ->
      url = match[1]

      tasks =
        title: (callback) ->
          module.exports.resolve url, callback
        short: (callback) ->
          if modules.bitly
            return modules.bitly.shorten url, callback
          callback null, null

      async.parallel tasks, (err, results) ->
        throw err if err
        if results.short
          bot.say channel, "[ #{c.teal results.title} ] #{c.underline results.short}"
        else
          bot.say channel, "[ #{c.teal results.title} ]"
