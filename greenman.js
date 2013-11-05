_ = require("underscore");
var irc = require("irc");
var path = require("path");
var fs = require("fs");
var config = require("./config");

var client = new irc.Client(config.server, config.nick, config.options);

//load modules
var modulesToLoad = config.enabledModules || fs.readdirSync(config.modulesDir);
modulesToLoad.forEach(function(moduleName) {
    //ignore modules in the disabled list
    if (_.contains(config.disabledModules, moduleName.split(".")[0])) {
        return;
    }
    require(path.join(config.modulesDir, moduleName))(client, config);
    console.log("Loaded module: " + moduleName);
});
console.log("Running");

//handle process errors. we set this up *after* modules have loaded
process.on('uncaughtException', function(err) {
    console.log(err.stack);
});
//handle irc errors
client.addListener("error", function(message) {
    console.log(message);
});
