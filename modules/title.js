var ircClient = require("../ircClient");
var request = require("request");

var urlRegex = /(?:.*\s+|^)((http:\/\/|https:\/\/|www\.)(\S)+)(?:\s+.*|$)/i;
var titleRegex = /(<\s*title[^>]*>(.+?)<\s*\/\s*title)>/g;

function handleMessage(nick, to, text) {
    var urlMatch = text.match(urlRegex);
    if (urlMatch) {
        var url = urlMatch[1];

        resolveTitle(url, function(error, response, title) {
            if (error || response.statusCode != 200) {
                ircClient.say(to, "[ Error: " + response.statusCode + " ]");
                return;
            }
            if (title) {
                ircClient.say(to, "[ " + title + " ]");
            }
        });
    }
}

//callback takes arguments error, response, title
function resolveTitle(url, callback) {
    request.get(url, function(error, response, body) {
        if (error || response.statusCode != 200) {
            callback(error, response, undefined);
            return;
        }

        titleRegex.lastIndex = 0;
        var titleMatch = titleRegex.exec(body);
        if (titleMatch) {
            callback(error, response, titleMatch[2]);
        } else {
            callback(error, response, undefined);
        }
    });
}

module.exports = {
    setup: function() {
        ircClient.addListener("message#", handleMessage);
    },

    shutdown: function() {
        ircClient.removeListener("message#", handleMessage);
    },

    resolveTitle: resolveTitle
};