var ircClient = require("../ircClient");

var regex = /.*(halo|h4lo|H410|hal0|ha1o|h@lo|halO|\|-\|\/-\|_\(\)|hola|h0la)(.*)(tres|tripple|triple|III|three|3|1\+2|2\+1|4-1).*/i;

function handleMessage(from, to, message) {
    if (message.match(regex)) {
        ircClient.say(to, ".k " + from + " halo 3");
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