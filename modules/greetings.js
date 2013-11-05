module.exports = function(client, config) {
    client.addListener("message", function(from, to, message) {
        var regex = new RegExp("(greetings|hello|hi|sup|yo|hey) " + config.nick, "i");
        if (message.match(regex)) {
            client.say(to, "Hi " + from + "!")
        }
    });
};