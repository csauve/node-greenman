var path = require("path");

module.exports = {
    //node-irc config
    server: "irc.gamesurge.net",
    nick: "greenman",
    options: {
        userName: "greenman",
	realName: "Greenman",
	autoRejoin: true,
	floodProtection: true,
	floodProtectionDelay: 1000,
	stripColors: false,
	messageSplit: 256,
        channels: ["#modacity"]
    },

    cmdPrefix: ".",
    //modules config
    modulesDir: path.join(__dirname, "modules")
};
