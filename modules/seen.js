var nStore = require("nstore");
var moment = require("moment");
var seen = nStore.new("seen.db", function() {});

function saveSeen(nick, channel) {
	seen.save(nick,
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

module.exports = function(client, config) {
	//save the timestamp upon joining
	client.addListener("join", function(channel, nick, message) {
		saveSeen(nick, channel);
	});

	client.addListener("message#", function(nick, to, text) {
		//save the timestamp upon message from nick
		saveSeen(nick, to);

		//check if theyre issuing the seen command
		var cmd = text.match(RegExp(config.cmdPrefix + "seen\\s+(.+)", "i"));
		if (cmd) {
			var name = cmd[1];
			seen.get(name, function(err, doc, key) {
				if (err) {
					client.say(to, nick + ": I haven't seen " + name);
					return;
				}
				client.say(to, nick + ": I last saw " + name + " in " + doc["channel"] +
					" " + moment(doc["date"]).fromNow());
			});
		}
	});
};
