var ircClient = require("../ircClient");
var config = require("../config");
var crypto = require("crypto");

function handleMessage(nick, to, text) {
    var cmd = text.match(RegExp(config.cmdPrefix + "hash(?:\\s+(.+)\\s(.+))?", "i"));
    if (cmd) {
        if (cmd[1] && cmd[2]) {
            try {
                var hash = crypto.createHash(cmd[1]).update(cmd[2]).digest("hex");
                ircClient.say(to, cmd[1] + " hash of \"" + cmd[2] +"\": " + hash);
            } catch (err) {
                ircClient.say(to, nick + ": Error: " + err);
            }
        } else {
            //list of available hash functions is dependent on the system
            //list of available functions available through:
            //  "openssl list-message-digest-algorithms"
            ircClient.say(to, nick + ": Supported hash functions: " + crypto.getHashes().join(", "));
        }
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