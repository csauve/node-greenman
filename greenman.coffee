CSON = require "cson"
Greenman = require "./lib/ircClient"
modules = require "./modules"
colors = require "colors/safe"

config = CSON.parseFileSync process.argv[2] || "config.cson"

greenman = new Greenman config.irc.nick

greenman.use (from, to, message, next) ->
  if from not in (config.global?.disabledNicks || []) then next()

modules.init greenman, config, (error) ->
  if error then return console.error "Failed to initialize modules: #{error.stack}"

  console.log "Connnecting to #{colors.green config.irc.server} as #{colors.green config.irc.nick} ( ͡° ͜ʖ ͡°)"
  greenman.connect config.irc