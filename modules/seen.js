var ircClient = require("../ircClient");
var config = require("../config");
var nStore = require("nstore");
var moment = require("moment");

var seen = null;

function saveSeen(nick, channel) {
    seen.save(nick.toLowerCase(),
        {
            date: new Date(),
            channel: channel
        },
        function(error) {
            if (error) {
                console.log(error);
            }
        }
    );
}

function handleJoin(channel, nick, message) {
    //save the timestamp upon joining
    saveSeen(nick, channel);
}

function handleMessage(nick, to, text) {
    //save the timestamp upon message from nick
    saveSeen(nick, to);

    //check if theyre issuing the seen command
    var cmd = text.match(RegExp(config.cmdPrefix + "seen\\s+(.+)", "i"));
    if (cmd) {
        var name = cmd[1];
        seen.get(name.toLowerCase(), function(err, doc, key) {
            if (err) {
                ircClient.say(to, nick + ": I haven't seen " + name);
                return;
            }
            ircClient.say(to, nick + ": I last saw " + name + " in " + doc["channel"] + " " + moment(doc["date"]).fromNow());
        });
    }
}

module.exports = {
    setup: function() {
        seen = nStore.new("seen.db", function() {
            ircClient.addListener("join", handleJoin);
            ircClient.addListener("message#", handleMessage);
        });
    },

    shutdown: function() {
        ircClient.removeListener("join", handleJoin);
        ircClient.removeListener("message#", handleMessage);
        nstore = null;
    }
};