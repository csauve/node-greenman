var irc = require("irc");
var config = require("./config");

var client = new irc.Client(config.server, config.nick, config.options);

//handle irc errors
client.addListener("error", function(message) {
    console.log(message);
});

module.exports = client;

// module.exports.sayColourSafe = function() {
// 	//todo
//}