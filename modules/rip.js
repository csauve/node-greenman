var regex = /.*(deebot|kanye|rec0|neuro).*/i;

module.exports = function(client, config) {
    client.addListener("message", function(from, to, message) {
    	var match = message.match(regex);
        if (match) {
            client.say(to, "rip " + match[1]);
        }
    });
};