var ircClient = require("../ircClient");
var config = require("../config");
var request = require("request");

//using public API documented at: http://www.cryptocoincharts.info/v2/tools/api

function handleMessage(from, to, message) {
    var match = message.match(RegExp(config.cmdPrefix + "coin (?:(?:(\\d+) (\\w+) to (\\w+)$)|(\\w+)$)", "i"));
    if (match) {
        var value = 1;
        var source = null;
        var dest = "usd";

        if (match[4]) {
            //if second format (.coin btc)
            source = match[4];
        } else {
            //if first format (.coin x btc to usd)
            var value = match[1];
            source = match[2];
            dest = match[3];
        }

        request.get("http://www.cryptocoincharts.info/v2/api/tradingPair/" + source + "_" + dest, function(error, response, body) {
            if (error) {
                console.log(error);
                return;
            }

            //if we requested a valid trading pair
            var pair = JSON.parse(body);
            if (pair.id) {
                ircClient.say(to, from + ": " + pair.id + " price: " + pair.price +
                    (value > 1 ? (", " + value + " " + source + " = " + (value * pair.price) + " " + dest) : "") +
                    ", best market: " + pair.best_market);
            } else {
                ircClient.say(to, from + ": No exchange information available for " + source + "/" + dest);
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