var ircClient = require("../ircClient");
var request = require("request");
var config = require("../config");

var url = "http://www.leonatkinson.com/random/index.php/rest.html?method=advice";
var quoteRegex = /<quote>(.*)<\/quote>/;

function handleMessage(from, to, message) {
    if (!message.match(RegExp(config.cmdPrefix + "why", "i"))) {
        return;
    }

    request.get(url, function(error, response, body) {
        if (error) {
            console.log(error);
            return;
        }
        quoteRegex.lastIndex = 0;
        var quoteMatch = quoteRegex.exec(body);
        if (quoteMatch) {
            ircClient.say(to, from + ": " + quoteMatch[1])
        }
    });
}

module.exports = {
    setup: function() {
        ircClient.addListener("message#", handleMessage);
    },

    shutdown: function() {
        ircClient.removeListener("message#", handleMessage);
    }
};