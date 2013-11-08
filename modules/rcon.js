var ircClient = require("../ircClient");
var config = require("../config");

config.rcon = {
    password: "changeme"
};

function handlePm(from, message) {
    var match = message.match(config.cmdPrefix + "rcon " + config.rcon.password + " (.+)");
    if (!match) {
        return;
    }

    var args = match[1].split(" ");
    switch (true) {
        case /j|join/.test(args[0]):
            ircClient.join(args[1], function() {
                ircClient.say(from, "Joined " + args[1]);
            });
            break;
        default:
            ircClient.say(from, "Unsupported command: " + args[0]);
    }
}

module.exports = {
    setup: function() {
        ircClient.addListener("pm", handlePm);
    },

    shutdown: function() {
        ircClient.removeListener("pm", handlePm);
    }
};