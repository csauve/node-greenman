CSON = require "cson"
config = CSON.parseFileSync process.argv[2] || "config.cson"
rateLimit = require "./lib/rateLimit"
Greenman = require "./lib/ircClient"

greenman = new Greenman config.irc.nick

greenman.use rateLimit config.core.rateLimit.requestsPerSecond

greenman.msg /^!echo (.+)$/, (nick, channel, match) ->
    greenman.reply nick, channel, match[1]

greenman.connect config.irc.server, config.irc.options