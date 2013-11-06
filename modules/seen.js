var nStore = require('nstore');

module.exports = function(client, config) {
	//save the timestamp upon joining
	client.addListener("join", function(channel,nick,message) {
		var seen = nStore.new("seen.db", function() {
			seen.save(channel,
				{
					Name: nick,
					Time: new Date()
				}
			);
		});
	});

	client.addListener("message#", function(nick, to, text) {
		var cmd = text.match(RegExp("^(\\" + config.cmdPrefix + "seen)\s(.+)","i"));
		if (cmd && cmd[1]) {
			var name = cmd[1];
			seen.get(name, function(err, doc, key) {
				if (err) {
					console.log(err);
				}
				client.say(name + " was last seen " + doc["Time"]);
			});
		}
	});
};
