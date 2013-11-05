module.exports = function(client, config) {
    config.rip = ".*(deebot|kanye|rec0).*";

    client.addListener("message", function(from, to, message) {
        var match = message.match(new RegExp(config.rip, "i"));
        if (match) {
            client.say(to, "rip " + match[1]);
        }
    });
};