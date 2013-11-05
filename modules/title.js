var request = require("request");
var urlRegex = /(?:.*\s+|^)((http:\/\/|https:\/\/|www\.)(\S)+)(?:\s+.*|$)/i;
var titleRegex = /(<\s*title[^>]*>(.+?)<\s*\/\s*title)>/g;

module.exports = function(client, config) {
    client.addListener("message", function(from, to, message) {
        var urlMatch = message.match(urlRegex);
        if (urlMatch) {
            var url = urlMatch[1];
            
            request.get(url, function(error, response, body) {
                if (error) {
                    console.log(error);
                    return;
                }
                titleRegex.lastIndex = 0;
                var titleMatch = titleRegex.exec(body);
		if (response.statusCode != 201){
		    client.say(to,"Error: " + response.statusCode);
		}
                if (titleMatch) {
                    client.say(to, "[ " + titleMatch[2] + " ]");
                }
            });
        }
    });
};
