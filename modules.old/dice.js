var ircClient = require("../ircClient");
var config = require("../config");

function handleMessage(from, to, message) {
    var match = message.match(RegExp(config.cmdPrefix + "d\\s+(\\d+)", "i"));
    if (match) {
        var sides = parseInt(match[1], 10);
        if (sides == NaN) {
            ircClient.say(to, from + ": That's not a number.");
        }
        var roll = Math.floor((Math.random() * sides) + 1);
        ircClient.say(to, from + ": A " + roll + " shows on the " + sides + "-sided die.")
    }
}

module.exports = {
    setup: function() {
        ircClient.addListener("message#", handleMessage);
    },

    shutdown: function() {
        ircClient.removeListener("message#", handleMessage);
    }
};