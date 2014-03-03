var ircClient = require("../ircClient");
var request = require("request");
var crypto = require("crypto");
var moment = require("moment");
var Datastore = require("nedb");

var repostsDb = new Datastore({ filename: "postedlinks.db", autoload: true });

var urlRegex = /(?:.*\s+|^)((http:\/\/|https:\/\/|www\.)(\S)+)(?:\s+.*|$)/i;
var titleRegex = /(<\s*title[^>]*>(.+?)<\s*\/\s*title)>/g;

function handleMessage(nick, to, text) {
    var urlMatch = text.match(urlRegex);
    if (urlMatch) {
        var url = urlMatch[1].trim();

        isRepost(url, to, function(isRepost, nickOP, dateOP) {
            resolveTitle(url, function(error, response, title) {
                if (error || response.statusCode != 200) {
                    ircClient.say(to, "[ Error: " + response.statusCode + " ]");
                    return;
                }
                if (title || isRepost) {
                    ircClient.say(to,
                        (title ? "[ " + title + " ] " : "") +
                        (isRepost ? "Originally posted by " + nickOP + " " + moment(dateOP).fromNow() : "")
                    );
                }

                //remember who posted this link
                if (!isRepost) {
                    savePost(url, nick, to);
                }
            });
        });
    }
}

function savePost(url, nick, channel) {
    var urlHash = crypto.createHash("md5").update(url).digest("base64");
    repostsDb.insert({
        urlHash: urlHash,
        nick: nick,
        channel: channel,
        date: new Date()
    }, function(err, doc) {
        if (err) {
            throw err;
        }
    });
}

//callback takes arguments isRepost, nick, date
function isRepost(url, channel, callback) {
    var urlHash = crypto.createHash("md5").update(url).digest("base64");
    repostsDb.find({urlHash: urlHash, channel: channel}, function(err, docs) {
        var nick, date, isRepost;
        if (isRepost = (!err && docs.length > 0)) {
            nick = docs[0].nick;
            date = docs[0].date;
        }

        callback(isRepost, nick, date);
    });
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

    resolveTitle: resolveTitle,
    isRepost: isRepost
};