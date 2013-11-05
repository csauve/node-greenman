var irc = require("irc");
var config = require("./config");
var path = require("path");

var client = new irc.Client(config.server, config.nick, config.options);

client.addListener("error", function(message) {
    console.log(message);
});

config.enabledModules.forEach(function(moduleName) {
    require(path.join(config.modulesPath, moduleName))(client, config);
    console.log("Loaded module: " + moduleName);
});
