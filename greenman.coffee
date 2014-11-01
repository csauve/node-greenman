CSON = require "cson"
Greenman = require "./lib/ircClient"
modulesDir = require "./modules"
colors = require "colors/safe"

config = CSON.parseFileSync process.argv[2] || "config.cson"
greenman = new Greenman config.irc.nick

greenman.use (from, to, message, next) ->
  if from not in (config.global?.disabledNicks || [])
    next from, to, message

greenman.use (from, to, message, next) ->
  next from, to, message.trim()

modulesDir.getEnabled config, (modules) ->
  for name of modules
    try
      modules[name].init greenman, config, modules
    catch error
      return console.error "Module #{colors.red name} failed to initialize: #{error.stack}"

  console.log "Connnecting to #{colors.green config.irc.server} as #{colors.green config.irc.nick} ( ͡° ͜ʖ ͡°)"
  greenman.connect config.irc