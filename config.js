var path = require("path");

module.exports = {
    //node-irc config
    server: "irc.gamesurge.net",
    nick: "greenman",
    options: {
        userName: "greenman",
        channels: ["#modacitytest"]
    },

    cmdPrefix: ".",

    //modules config
    modulesPath: path.join(__dirname, "modules"),
    enabledModules: [
        "greetings",
        "rcon"
    ]
};