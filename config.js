var path = require("path");

module.exports = {
    server: "irc.gamesurge.net",
    nick: "greenman",
    options: {
        channels: ["#modacitytest"]
    },

    modulesPath: path.join(__dirname, "modules"),
    enabledModules: ["greetings"]
};