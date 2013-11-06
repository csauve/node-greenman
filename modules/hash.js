var crypto = require('crypto');
module.exports = function(client,config){
	client.addListener("message#",function(nick,to,text){
		var cmd = text.match(RegExp(config.cmdPrefix + "hash\\s+(.+)\\s(.+)","i"));
		if (cmd) {
			//list of available hash functions is dependent on the system
			//list of available functions available through:
			//	"openssl list-message-digest-algorithms"
			var hash = crypto.createHash(cmd[0]).update(cmd[1]).digest("hex");
			client.say(to,cmd[0] + " hash of \"" + cmd[1] +"\": " + hash);
		};
		else
		{
			//needs some cooler way to print help when it's needed
			client.say(to,"hash (HashType) (string)");
		}
	});
}
