# greenman
An IRC bot built on node-irc and inspired by [DEEbot](https://github.com/DEElekgolo/DEEbot) and [express](http://expressjs.com/).

## Installation
1. Clone or export this repository
2. `npm install` to install dependencies
3. Edit `config.cson`
4. `coffee greenman.coffee [config.cson]`, where config.cson is an optional path

## Writing Modules
Greenman modules are just NPM modules in the `modules` directory exporting an object with an `init` function.
The `init` function should take arguments `bot` (used to register callbacks and make replies) and `config` (the contents of `config.cson`). For example:

```coffee
module.exports = init: (bot, config) ->
  bot.msg ///hi, #{config.irc.nick}!///i, (nick, channel, match) ->
    bot.say channel, "Hello, #{nick}!"
```

## Bot API
The bot (`lib/ircClient`) exposes a minimal API which should be familiar to express/connect users:

```coffee
Bot = require "./lib/ircClient"
bot = new Bot "nick"

# Catch-all middleware. Callbacks are called in the order they're registered
bot.use (nick, to, message, next) ->
  console.log "#{nick} said #{message} to #{to}"
  # Call next() to allow the next callback in the stack run. Or don't call it and the stack will abort
  next()

# Handle messages to channels only, say to channel
bot.msg (nick, channel, message) ->
  bot.say channel, "Keep it quiet, #{nick}!"

# Handle messages to channels and matching a pattern
bot.msg /I like (.+)/i, (nick, channel, match) ->
  bot.say channel, "I like #{match[1]} too!"

# Handle private messages only, reply in private
bot.pm (nick, message) ->
  bot.say nick, "You just told me: #{message}"

# Private messages with a pattern
bot.pm /!secret (.+)/i, (nick, match) ->
  secrets.put match[1]
  bot.say nick, "Your secret's safe with me!"

# This just takes an options object equivalent to "node-irc" options, plus the server field
bot.connect
  server: "irc.example.com"
  channels: [
    "#mychannel"
  ]
```

## Rate Limiting
It may be desirable to limit the rate that modules handle messages. Require `lib/rateLimit` for a simple limiter:

```coffee
rateLimit = require "../../lib/rateLimit"

module.exports = init: (config, bot) ->
  prefix = config.global.prefix || "!"

  limiter = rateLimit
    rate: 0.3
    burst: 2
    strikes: 3
    cooldown: 60

  bot.msg /^!echo\s+(.+)$/i, (nick, channel, match) ->
    limiter nick,
      go: () -> bot.reply nick, channel, match[1]
      no: (strike) -> bot.say nick, "Enhance your calm! (Strike #{strike} of 3)"
```

Call `rateLimit` with an options object to get a new limiter. The options are:
* **rate**: Requests per second, determines token refill rate
* **burst**: Determines token capacity
* **strikes**: Set this to X, and the limiter will not allow further requests after X blocked requests. Disabled with value 0 by default
* **cooldown**: Number of seconds after the last request until strikes returns to 0. This is 0 by default, meaning they are blocked forever if strikes are enabled

To invoke the limiter, just call it with a key that will get its own token bucket, like `nick`, and a callbacks object. The `no` callback is optional.

## To-Do
* Convert all modules in modules.old to new API
* Pull rateLimit out to its own NPM module
* Random quoting when chat active
* JS and python sandbox modules