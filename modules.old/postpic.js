var ircClient = require("../ircClient");
var config = require("../config");

function handleMessage(from, to, message) {
    var match = message.match(RegExp(".*(" + config.nick + ":? post pic).*", "i"));
    if (match) {
        ircClient.say(to, "\x030,3╭━━━━━━╮\x03");
        ircClient.say(to, "\x030,3┃　\x031,8  ͡° ͜ʖ ͡° \x030,3 　　 ┃\x03");
        ircClient.say(to, "\x030,3┃　　　　　　┃\x03");
        ircClient.say(to, "\x030,3┃┃　　　┃　┃\x03");
        ircClient.say(to, "\x030,3┃┃　　　┃　┃\x03");
        ircClient.say(to, "\x030,3┃┃　　　┃　┃\x03");
        ircClient.say(to, "\x030,3╰┫　　　╰┳╯\x03");
        ircClient.say(to, "　\x030,3┃　5　 　┃\x03");
        ircClient.say(to, "　\x030,3┃　┃　　┃\x03");
        ircClient.say(to, "　\x030,3┃　┃　　┃\x03");
        ircClient.say(to, "\x030,3╭┛╭┛　   ┃\x03");
        ircClient.say(to, "\x030,3┗━┻━━━╯\x03");
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