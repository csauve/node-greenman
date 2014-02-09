var ircClient = require("../ircClient");
var config = require("../config");
var request = require("request");

function handleMessage(from, to, message) {
    var match = message.match(RegExp(config.cmdPrefix + "g (.+)", "i"));
    if (match) {
        var input = match[1];
        request.get("http://www.google.com/search?q=" + thing + "&btnI", function(error, response, body) {
            if (error) {
                console.log(error);
                return;
            }

            console.log(response);
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
