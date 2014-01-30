var ircClient = require("../ircClient");
var config = require("../config");
var Datastore = require("nedb");
var moment = require("moment");

var seenDb = new Datastore({ filename: "seen.db", autoload: true });
seenDb.persistence.setAutocompactionInterval(48 * 60 * 60 * 1000);

function handleMessage(nick, to, text) {
    //we've seen 'nick' post, so save this fact to the db
    seenDb.update({name: nick.toLowerCase()},
        {
            name: nick.toLowerCase(),
            date: new Date(),
            channel: to
        },
        { multi: true, upsert: true }, function(error, numReplaced, upsert) {
            if (error) {
                throw error;
            }
        }
    );

    //check if they're issuing the seen command
    var cmd = text.match(RegExp(config.cmdPrefix + "seen\\s+(.+)", "i"));
    if (cmd) {
        var name = cmd[1].toLowerCase();
        seenDb.findOne({name: name}, function(err, doc) {
            if (err) {
                throw err;
            }
            ircClient.say(to, nick + ": " + (doc ?
                "I last saw " + name + " in " + doc.channel + " " + moment(doc.date).fromNow() :
                "I haven't seen " + name
            ));
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