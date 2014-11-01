irc = require "irc"

module.exports = class Greenman

  constructor: (@nick = "greenman") ->
    @stack = []

  use: (callback) ->
    @stack.push callback

  msg: (arg1, arg2) =>
    @use (from, to, message, next) =>
      if to != @nick
        if arg2 != undefined
          match = message.match arg1
          if match then arg2 from, to, match
        else
          arg1 from, to, message
      next from, to, message

  pm: (arg1, arg2) =>
    @use (from, to, message, next) =>
      if to == @nick
        if arg2 != undefined
          match = message.match arg1
          if match then arg2 from, match
        else
          arg1 from, message
      next from, to, message

  any: (arg1, arg2) =>
    @use (from, to, message, next) =>
      if arg2 != undefined
        match = message.match arg1
        if match then arg2 from, to, match
      else
        arg1 from, to, message
      next from, to, message

  say: (to, message) =>
    if @client then @client.say to, message

  reply: (from, to, message) =>
    if @client
      isPrivateMessage = to == @nick
      dest = if isPrivateMessage then from else to
      @client.say dest, "#{from}: #{message}"

  connect: (options) =>
    options.userName = options.userName || @nick
    options.realName = options.realName || @nick

    if @client then @client.disconnect()
    @client = new irc.Client options.server, @nick, options

    @client.addListener "error", (message) ->
      console.error message

    @client.addListener "message", (from, to, message) =>
      executeStack = (index, inFrom, inTo, inMessage) =>
        if index >= @stack.length then return
        stackEl = @stack[index]
        stackEl inFrom, inTo, inMessage, (outFrom, outTo, outMessage) ->
          executeStack index + 1, outFrom, outTo, outMessage
      try
        executeStack 0, from, to, message
      catch error
        console.error "Uncaught stack error: #{error.stack}"