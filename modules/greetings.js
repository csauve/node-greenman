module.exports = function(client, config) {
    client.addListener("message#", function(nick, to, text) {
        if (text.match(RegExp("(greetings|hello|hi|sup|yo|hey)\\s+" + config.nick, "i"))) {
            client.say(to, "Hi " + nick + "!");
        } else if (text.match(RegExp(config.nick + "\\!", "i"))) {
            client.say(to, nick + "!");
        }
    });
};
