irc = require "irc"

module.exports = class Greenman

  constructor: (@nick = "greenman") ->
    @stack = []

  use: (callback) ->
    @stack.push callback

  msg: (arg1, arg2) =>
    @use (from, to, message, next) =>
      if arg2 != undefined
        match = message.match arg1
        if match then arg2 from, to, match
      else
        arg1 from, to, message
      next()

  pm: (arg1, arg2) =>
    @use (from, to, message, next) =>
      if to == @nick
        if arg2 != undefined
          match = message.match arg1
          if match then arg2 from, match
        else
          arg1 from, message
      next()

  say: (to, message) =>
    if @client
      @client.say to, message

  reply: (nick, channel, message) =>
    if @client
      @client.say channel, "#{nick}: #{message}"

  connect: (server, options) =>
    if @client then @client.disconnect()
    @client = new irc.Client server, @nick, options

    @client.addListener "message", (from, to, message) =>
      executeStack = (index) =>
        if index >= @stack.length then return
        callback = @stack[index]
        callback from, to, message, () ->
          executeStack index + 1

      executeStack 0