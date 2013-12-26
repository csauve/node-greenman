var ircClient = require("../ircClient");
var config = require("../config");
var moduleLoader = require("../moduleLoader");

config.rcon = {
    password: "changeme"
};

function handlePm(from, message) {
    var match = message.match(RegExp(config.cmdPrefix + "rcon " + config.rcon.password + " (.+)", "i"));
    if (!match) {
        return;
    }

    var args = match[1].split(" ");
    switch (true) {
        case /^(?:j|join)/.test(args[0]):
            ircClient.join(args[1], function() {
                ircClient.say(from, "Joined " + args[1]);
            });
            break;
        case /^(?:load|ld)/.test(args[0]):
            moduleLoader.loadModule(args[1], function(error) {
                if (error) {
                    ircClient.say(from, "Failed to load module " + args[1]);
                } else {
                    ircClient.say(from, "Loaded module " + args[1]);
                }
            });
            break;
        case /^(?:unload|uld)/.test(args[0]):
            moduleLoader.unloadModule(args[1], function(error) {
                if (error) {
                    ircClient.say(from, error);
                } else {
                    ircClient.say(from, "Unloaded module " + args[1]);
                }
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