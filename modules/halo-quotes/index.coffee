CSON = require "cson"
c = require "irc-colors"
rateLimit = require "../../lib/rateLimit"
path = require "path"

QUOTES_FILE = path.join __dirname, "masterchief.cson"
masterchief = CSON.parseFileSync QUOTES_FILE

commandLimiter = rateLimit
  rate: 0.3
  strikes: 3
  cooldown: 10

randomLimiter = rateLimit
  rate: 1 / 120
  burst: 2
  strikes: 2
  cooldown: 240

getRandomQuote = () ->
  index = Math.floor(masterchief.quotes.length * Math.random())
  return masterchief.quotes[index]

module.exports = init: (bot, config, modules) ->
  prefix = config.global.prefix

  if modules.man
    modules.man.page "halo-quotes", "Randomly posts Halo quotes. Can be asked directly, too: #{c.red "#{prefix}chief"}"

  bot.msg ///^#{prefix}chief$///, (nick, channel) ->
    commandLimiter nick,
      no: (strike) -> if strike == 1 then bot.say nick, "Save it for the covenant! Enhance your calm"
      go: () ->
        quote = getRandomQuote()
        bot.reply nick, channel, c.green quote

  bot.msg (nick, channel) ->
    if Math.random() > 0.05 then return
    randomLimiter channel, go: () ->
      quote = getRandomQuote()
      bot.say channel, c.green quote
