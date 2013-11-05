var irc = require("irc");
var config = require("./config");

var client = new irc.Client(config.server, config.nick, config.options);

client.addListener("error", function(message) {
    console.log(message);
});

client.addListener("message", function(from, to, message) {
    client.say(to, message);
});