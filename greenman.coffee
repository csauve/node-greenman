CSON = require "cson"
Greenman = require "./lib/ircClient"
modules = require "./modules"
colors = require "colors/safe"

config = CSON.parseFileSync process.argv[2] || "config.cson"

greenman = new Greenman config.irc.nick
modules.init config, greenman, (error) ->
  if error then return console.error "Failed to initialize modules: #{error.stack}"
  console.log "Connnecting to #{colors.green config.irc.server} as #{colors.green config.irc.nick} ( ͡° ͜ʖ ͡°)"
  greenman.connect config.irc