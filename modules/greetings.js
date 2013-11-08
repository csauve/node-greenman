var config = require("../config");
var ircClient = require("../ircClient");

function handleMessage(nick, to, text) {
    if (text.match(RegExp("(greetings|hello|hi|sup|yo|hey)\\s+" + config.nick, "i"))) {
        ircClient.say(to, "Hi " + nick + "!");
    } else if (text.match(RegExp(config.nick + "\\!", "i"))) {
        ircClient.say(to, nick + "!");
    }
}

module.exports = {
    setup: function() {
        ircClient.addListener("message#", handleMessage);
    },

    shutdown: function() {
        ircClient.removeListener("message#", handleMessage);
    }
}