url = require "url"
c = require "irc-colors"
rateLimit = require "../../lib/rateLimit"
BitlyAPI = require "node-bitlyapi"

REQUEST_PREFIX = "https://api-ssl.bitly.com/v3/shorten?domain=j.mp&format=txt&longUrl="
accessToken = null

limiter = rateLimit
  rate: 1 / 5
  burst: 2
  strikes: 3
  timeout: 120

Bitly = new BitlyAPI {}

module.exports =

  shorten: (longUrl, callback) ->
    params =
      longUrl: longUrl
      format: "txt"
      domain: "j.mp"

    Bitly.shorten params, (error, result) ->
      callback error, result?.trim()

  init: (bot, config, modules) ->
    prefix = config.global.prefix

    accessToken = config.bitly?.accessToken
    if !accessToken
      throw new Error "No config.bitly.accessToken provided"

    Bitly.setAccessToken accessToken

    if modules.man
      modules.man.page "bitly", "Shorten links with bitly. Usage: #{c.red "#{prefix}shorten <url>"}"

    bot.any ///^#{prefix}shorten\s+(.+)$///i, (from, to, match) ->
      limiter from,
        no: (strike) ->
          if strike == 1 then bot.say from, "Please limit your request rate"
        go: () ->
          module.exports.shorten match[1], (error, short) ->
            throw error if error
            bot.reply from, to, c.underline.red short
