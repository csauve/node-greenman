module.exports = function(client, config) {
    var regex = new RegExp("(greetings|hello|hi|sup|yo|hey) " + config.nick, "i");
    
    client.addListener("message", function(from, to, message) {
        if (message.match(regex)) {
            client.say(to, "Hi " + from + "!");
        }
	if (message.match(RegExp(config.nick + "!"))) {
	    client.say(to, from + "!");
	}
    });
};
