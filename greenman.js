var irc = require("irc");
var path = require("path");
var fs = require("fs");
var config = require("./config");

var client = new irc.Client(config.server, config.nick, config.options);

client.addListener("error", function(message) {
    console.log(message);
});

//load modules
var modulesToLoad = config.enabledModules || fs.readdirSync(config.modulesDir);

modulesToLoad.forEach(function(moduleName) {
    if (config.disabledModules && config.disabledModules.indexOf(moduleName.split(".")[0]) != -1) {
        return;
    }
    require(path.join(config.modulesDir, moduleName))(client, config);
    console.log("Loaded module: " + moduleName);
});
