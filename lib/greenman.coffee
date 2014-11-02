irc = require "irc"

module.exports = class Greenman

  constructor: (@nick = "greenman") ->
    @stacks = {}

  use: (event, callback) ->
    if !@stacks[event] then @stacks[event] = []
    @stacks[event].push callback

  event: (event, callback) ->
    @use event, () ->
      next = arguments[arguments.length - 1]
      callback.apply null, arguments
      next.apply null, arguments

  msg: (arg1, arg2) =>
    @event "message", (from, to, text) =>
      if to != @nick
        if arg2 != undefined
          match = text.match arg1
          if match then arg2 from, to, match
        else
          arg1 from, to, text

  pm: (arg1, arg2) =>
    @event "message", (from, to, text) =>
      if to == @nick
        if arg2 != undefined
          match = text.match arg1
          if match then arg2 from, match
        else
          arg1 from, text

  any: (arg1, arg2) =>
    @event "message", (from, to, text) ->
      if arg2 != undefined
        match = text.match arg1
        if match then arg2 from, to, match
      else
        arg1 from, to, text

  say: (to, text) =>
    if @client then @client.say to, text

  reply: (from, to, text) =>
    if @client
      isPrivateMessage = to == @nick
      dest = if isPrivateMessage then from else to
      @client.say dest, "#{from}: #{text}"

  getClient: () ->
    return @client || null

  connect: (server, options) =>
    if @client then @client.disconnect()
    @client = new irc.Client server, @nick, options

    for event, stack of @stacks
      ((event, stack) =>
        @client.addListener event, () ->
          executeHandler = (index, args) =>
            if index >= stack.length then return
            handler = stack[index]
            #set (replace) the 'next' callback argument
            args[args.length - 1] = () ->
              executeHandler index + 1, arguments #output args
            handler.apply null, args
          try
            firstArgs = Array.prototype.slice.call arguments
            firstArgs.push null #executeHandler will override this
            executeHandler 0, firstArgs #input args
          catch error
            console.error "Uncaught error in '#{event}' stack: #{error.stack}"
      )(event, stack)
