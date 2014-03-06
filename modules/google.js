var ircClient = require("../ircClient");
var config = require("../config");
var request = require("request");
var moduleManager = require("../moduleManager");

function handleMessage(from, to, message) {
    var link = moduleManager.requireModule("link");

    var match = message.match(RegExp(config.cmdPrefix + "g (.+)", "i"));
    if (match) {
        var input = match[1];
        request.get("http://www.google.com/search?q=" + input + "&btnI", function(error, response, body) {
            if (error) {
                console.log(error);
                return;
            }

            var url = response.request.href;
            link.resolveTitle(url, function(error, response, title) {
                if (error) {
                    ircClient.say(to, from + ": " + url);
                } else {
                    ircClient.say(to, from + ": " + url+ " [" + title + "]");
                }
            })
        });
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
