module.exports = function(client, config) {
	regex = /.*(halo|h4lo|H410|hal0|ha1o|h@lo|halO|\|-\|\/-\|_\(\)|hola|h0la)(.*)(tres|tripple|triple|III|three|3|1\+2|2\+1|4-1).*/i;

    client.addListener("message", function(from, to, message) {
        if (message.match(regex)) {
            client.say(to, ".k " + from + " halo 3");
        }
    });
};