var request = require("request");
var url = "http://www.leonatkinson.com/random/index.php/rest.html?method=advice";
var quoteRegex = /<quote>(.*)<\/quote>/;

module.exports = function(client, config) {
    var commandRegex = new RegExp(config.cmdPrefix + "why", "i");

    client.addListener("message", function(from, to, message) {
        if (!message.match(commandRegex)) {
            return;
        }

        request.get(url, function(error, response, body) {
            if (error) {
                console.log(error);
                return;
            }
            quoteRegex.lastIndex = 0;
            var quoteMatch = quoteRegex.exec(body);
            if (quoteMatch) {
                client.say(to, from + ": " + quoteMatch[1])
            }
        });
    });
};