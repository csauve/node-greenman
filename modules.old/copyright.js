var ircClient = require("../ircClient");

function handleMessage(nick, to, text) {
    if (text.match(/.*torrent.*/i)) {
        ircClient.say(to, "\x031,4▓ ☣ ▓ CAUTION - COPYRIGHT INFRINGEMENT DETECTED ▓ ☣ ▓\x03");
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
