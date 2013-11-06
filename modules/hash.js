var crypto = require("crypto");

module.exports = function(client, config) {
	client.addListener("message#", function(nick, to, text) {
		var cmd = text.match(RegExp(config.cmdPrefix + "hash(?:\\s+(.+)\\s(.+))?", "i"));
		if (cmd) {
			if (cmd[1] && cmd[2]) {
				try {
					var hash = crypto.createHash(cmd[1]).update(cmd[2]).digest("hex");
					client.say(to, cmd[1] + " hash of \"" + cmd[2] +"\": " + hash);
				} catch (err) {
					client.say(to, nick + ": Error: " + err);
				}
			} else {
				//list of available hash functions is dependent on the system
				//list of available functions available through:
				//	"openssl list-message-digest-algorithms"
				client.say(to, nick + ": Supported hash functions: " + crypto.getHashes().join(", "));
			}
		}
	});
}
