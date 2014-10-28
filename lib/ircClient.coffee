irc = require "irc"

module.exports = class Greenman
  constructor: (@nick = "greenman") ->
    @stack = []

  use: (callback) ->
    @stack.push callback
    return this

  msg: (pattern, callback) ->
    @use (from, to, message, next) ->
      match = message.match pattern
      if match then callback from, to, match
      next()
    return this

  pm: (pattern, callback) ->
    @use (from, to, message, next) ->
      match = message.match pattern
      if match and to == @nick then callback from, match
      next()
    return this

  say: (to, message) ->
    if @client
      @client.say to, message
    return this

  reply: (nick, channel, message) ->
    if @client
      @client.say channel, "#{nick}: #{message}"
    return this

  connect: (server, options) ->
    if @client
      @client.disconnect()
    @client = new irc.Client server, @nick, options

    stack = @stack
    @client.addListener "message", (from, to, message) ->
      executeStack = (index) ->
        if index >= stack.length then return
        callback = stack[index]
        callback from, to, message, () ->
          executeStack index + 1

      executeStack 0