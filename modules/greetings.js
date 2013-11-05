module.exports = function(client, config) {
    client.addListener("message#", function(nick, to, text) {
        if (message.match(RegExp("(greetings|hello|hi|sup|yo|hey)\s"+config.nick,"i")) {
            client.say(to, "Hi " + nick + "!");
        }
	if (message.match(RegExp(config.nick + "!",i))) {
	    client.say(nick, from + "!");
	}
    });
};
