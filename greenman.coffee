CSON = require "cson"
Greenman = require "./lib/ircClient"
config = CSON.parseFileSync process.argv[2] || "config.cson"

greenman = new Greenman config.irc.nick

greenman.msg /^!echo (.+)$/, (nick, channel, match) ->
  greenman.reply nick, channel, match[1]

greenman.connect config.irc.server, config.irc.options