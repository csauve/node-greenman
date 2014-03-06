var ircClient = require("../ircClient");
var config = require("../config");
var moduleLoader = require("../moduleManager");

config.rcon = {
    password: "changeme"
};

function handlePm(from, message) {
    var match = message.match(RegExp(config.cmdPrefix + "rcon " + config.rcon.password + " (.+)", "i"));
    if (!match) {
        return;
    }

    //todo: redo command logic (use some sort of command line arguments parsing lib?)
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
        case /^(?:getconfig|getc)/.test(args[0]):
            var pathElements = args[1].split(".");
            var node = config;
            for (var i = 0; i < pathElements.length && node != undefined; i++) {
                node = node[pathElements[i]];
            }
            ircClient.say(from, "Value: " + node);
            break;
        case /^(?:setconfig|setc)/.test(args[0]):
            var pathElements = args[1].split(".");
            var value = args[2];

            var node = config;
            //all but the final node need to be objects set by reference
            for (var i = 0; i < pathElements.length - 1; i++) {
                //create objects as we go if needed
                if (node[pathElements[i]] == undefined) {
                    node[pathElements[i]] = {};
                }
                node = node[pathElements[i]];
            }

            //set the final value by reference
            node[pathElements[pathElements.length - 1]] = value;
            ircClient.say(from, "Value set");
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