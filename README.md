# Greenman
Greenman is a middleware library for node.js IRC bots built on [node-irc](https://github.com/martynsmith/node-irc). Greenman is to node-irc what [connect](https://github.com/senchalabs/connect) is to `http.Server`. It is not an IRC bot in itself, but provides conveniences in building them.

## Installation
```sh
npm install greenman
```

## Create a bot
Instantiate a bot by providing a nick that will identify the bot. The instance of `Bot` is what the middleware will be added to, and eventually connected to an IRC server.

```js
var Bot = require("greenman");

var bot = new Bot("nick");
```

## Middleware
Middleware are functions that handle incoming IRC messages, and then call the next middleware in the stack. They will be called in the order they were added to the bot, but only as long as a each middleware calls `next(...)`. Stacks exist per IRC event, and the middleware functions in those stacks will take arguments specific to that event. Since Greenman is built on node-irc (0.3.x), the events and callback arguments are exactly the same as [documented here](https://node-irc.readthedocs.org/en/latest/API.html#events). The `next` function lets you pass in the parameters that downstream middleware will use.

Here's an example middleware to trim messages:
```js
bot.use("message", function(from, to, text, message, next) {
  next(from, to, text.trim(), message);
});
```

Ignoring nicks from a blacklist. Because `next` is not called when the nick is in the blacklist, downstream middleware will never see the message:
(CoffeeScript)
```coffee
greenman.use "message", (from, to, text, message, next) ->
  if from not in config.blacklist
    next from, to, text, message
```

## Helper middleware
Suppose you want to handle an event and you know you would always call `next` without modifying its arguments. Greenman provides some conveniences for common middleware use cases:

```js
//no need to use the 'message' argument if you don't need it
bot.event("join", function(channel, nick) {
  console.log(nick + " joined channel " + channel);
  //next(...) will be called for you
});
```

You can use shorthand for these common events:
(CoffeeScript)
```coffee
# Handle "message" event to channels only (no private messages)
bot.msg (nick, channel, text) ->
  bot.say channel, "Keep it quiet, #{nick}!"

# Handle messages to a channel if it matches a pattern
bot.msg /I like (.+)/i, (nick, channel, match) ->
  bot.say channel, "I like #{match[1]} too!"

# Handle private messages sent to the bot
bot.pm (nick, text) ->
  bot.say nick, "Cool story, bro."

# Private messages with a pattern
bot.pm /!secret (.+)/i, (nick, match) ->
  secrets.put match[1]
  bot.say nick, "Your secret's safe with me!"

# Messages sent to channels *or* privately to the bot in a PM
# Can also be called without a regex like the others
bot.any /^!echo (.+)$/i, (from, to, match) ->
  # A special version of say that responds in the context the message was received
  bot.reply from, to, match[1]
```

## Say and reply
The first argument of `bot.say` is the recipient, be it a #channel or a nick, and the second is the text you want to send. New from node-irc is `bot.reply`. If `to` is equal to the bot's nick, then the message was a private message. Otherwise it is a message sent to a channel the bot is in. Replying takes into account the nick of the bot and sends the response to the right place. It also prefixes the message with the recipients name, so the above example would actually say "jane: Hello, world!" if the original sender was "jane".

```js
bot.any(function(from, to, text) {
  bot.reply(from, to, "Hello, world!");
});
```

Say and reply have no effect until `connect` has been called:

## Connecting to an IRC server
Connecting with Greenman is the same as connecting with [node-irc](https://node-irc.readthedocs.org/en/latest/API.html#client). Just pass in the server and options, because the bot already knows the nick you constructed it with.

```js
bot.connect("irc.example.com", {
  floodProtection: true,
  channels: [
    "#mychannel"
  ]
});
```

And that's it! Your bot should be up and running.

## Getting the IRC client
You might need to use the underlying IRC client to do some grunt work. You can get the node-irc client by calling `getClient()`. As a heads up, this will return null until `connect` has been called.

```js
var client = bot.getClient();

client.join("#mychannel", "password");
```

## Alternatives
Need something different? Check out [oftn-bot](https://github.com/oftn/oftn-bot) and [Jerk](https://github.com/gf3/Jerk) :)

## Contributing & to-do list
Pull requests happily accepted. This project is not yet at 1.0.0, so there's still some work to do:
* Compare node-irc to IRC-js as a potential foundation
* Create test cases, hardening for 1.0.0

## License
Licensed under the (MIT License](http://opensource.org/licenses/mit-license.php).