var ircClient = require("../ircClient");

var regex = /.*(kanye|rec0|neuro|obama|rentabot|(?:halo 5)).*/i;//hueheue

function handleMessage(from, to, message) {
    var match = message.match(regex);
    if (match) {
        ircClient.say(to, "rip " + match[1]);
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