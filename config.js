var path = require("path");

module.exports = {
    //node-irc config
    server: "irc.gamesurge.net",
    nick: "greenman",
    options: {
        userName: "greenman",
        channels: ["#modacity"]
    },

    cmdPrefix: ".",
    //message colors
    colors: true;
    //modules config
    modulesDir: path.join(__dirname, "modules")
};
