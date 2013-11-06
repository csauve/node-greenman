var request = require("request");
var urlRegex = /(?:.*\s+|^)((http:\/\/|https:\/\/|www\.)(\S)+)(?:\s+.*|$)/i;
var titleRegex = /(<\s*title[^>]*>(.+?)<\s*\/\s*title)>/g;

module.exports = function(client, config) {
    client.addListener("message#", function(nick, to, text) {
        var urlMatch = text.match(urlRegex);
        if (urlMatch) {
            var url = urlMatch[1];
            
            request.get(url, function(error, response, body) {
                if (response.statusCode != 200 || error){
                    client.say(to, "[ Error: " + response.statusCode + " ]");
                    return;
                }

                titleRegex.lastIndex = 0;
                var titleMatch = titleRegex.exec(body);
                if (titleMatch) {
                    client.say(to, "[ " + titleMatch[2] + " ]");
                }
            });
        }
    });
};
