var ircClient = require("../ircClient");
var config = require("../config");
var request = require("request");

config.bing = {
    accountKey: "changeme"
};
var queryBaseUrl = "https://api.datamarket.azure.com/Bing/Search/v1/Web?$format=json&Query=";

function handleMessage(from, to, message) {
    var match = message.match(RegExp(config.cmdPrefix + "bing (.+)", "i"));
    if (match) {
        var query = match[1];
        var auth = new Buffer([config.bing.accountKey, config.bing.accountKey].join(':')).toString('base64');
        var headers = {
            "Authorization": "Basic " + auth
        };

        request.get({url: queryBaseUrl + "'" + query + "'", headers: headers}, function(error, response, body) {
            var results = JSON.parse(body).d.results;
            if (results.length == 0) {
                ircClient.say(to, from + ": No results found!");
            } else {
                var topResult = results[0];
                ircClient.say(to, from + ": " + topResult.Url + " [" + topResult.Title + "] " + topResult.Description);
            }
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
