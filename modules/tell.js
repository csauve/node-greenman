var ircClient = require("../ircClient");
var config = require("../config");
var nStore = require("nstore");
var moment = require("moment");

var tellDb = null;

function saveSeen(nick, channel) {
    tellDb.save(nick.toLowerCase(),
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

function handleMessage(nick, to, text) {
    //check if the user has any mail
    tellDb.get(nick.toLowerCase(), function(err, doc, key) {
        if (!err) {
            //the user has some mail
            var mail = doc["mail"];
            if (mail && mail.length >= 1) {
                for (var i = 0; i < mail.length; i++) {
                    var sender = mail[i].sender;
                    var fromNow = moment(mail[i].date).fromNow();
                    var message = mail[i].message;
                    ircClient.say(to, nick + ": [" + fromNow + "] " + sender + ": " + message);
                }
            }
            //clear their mailbox now that they've been notified
            tellDb.remove(nick.toLowerCase(), function(err) {
                if (err) {
                    throw err;
                }
            });
        }
    });

    //check if the user wanted to send mail
    var cmd = text.match(RegExp(config.cmdPrefix + "tell\\s+(\\S+)\\s+(.+)", "i"));
    if (cmd) {
        var recipient = cmd[1].toLowerCase();
        var message = cmd[2];
        var date = new Date();

        if (recipient == nick.toLowerCase()) {
            ircClient.say(to, nick + ": Tell yourself that!");
            return;
        }

        var mailItem = {
            message: message,
            date: date,
            sender: nick
        }

        tellDb.get(recipient, function(error, doc, key) {
            if (error) {
                //recipient has no mail, so save a new mailbox with this message
                tellDb.save(recipient, {
                    mail: [mailItem]
                }, function(err) {
                    if (err) {
                        throw err;
                    }
                    ircClient.say(to, nick + ": I'll pass that on when " + recipient + " next posts.");
                });
            } else {
                //recipient already has mail, need to append
                doc.mail.push(mailItem);
                tellDb.save(recipient, doc, function (err) {
                    if (err) {
                        throw err;
                    }
                    ircClient.say(to, nick + ": I'll pass that on when " + recipient +
                        " next posts. (" + doc.mail.length + " queued)");
                });
            }
        });
    }
}

module.exports = {
    setup: function() {
        tellDb = nStore.new("tell.db", function() {
            ircClient.addListener("message#", handleMessage);
        });
    },

    shutdown: function() {
        ircClient.removeListener("message#", handleMessage);
        tellDb = null;
    }
};