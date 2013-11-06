var regex = /.*(kanye|rec0|neuro|con|obama|(?:halo 5)).*/i;//hueheue

module.exports = function(client, config) {
    client.addListener("message#", function(from, to, message) {
    	var match = message.match(regex);
        if (match) {
            client.say(to, "Rip " + match[1]);
        }
    });
};
