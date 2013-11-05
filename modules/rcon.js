module.exports = function(client, config) {
    config.rcon = {
        password: "changeme"
    };

    client.addListener("pm", function(from, message) {
        var match = message.match(config.cmdPrefix + "rcon " + config.rcon.password + " (.+)");
        if (!match) {
            return;
        }

        var args = match[1].split(" ");
        switch (true) {
            case /j|join/.test(args[0]):
                client.join(args[1], function() {
                    client.say(from, "Joined " + args[1]);
                });
                break;
            default:
                client.say(from, "Unsupported command: " + args[0]);
        }
    });
};