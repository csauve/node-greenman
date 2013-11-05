var regex = /.*(torrent).*/i;

module.exports = function(client, config) {
    client.addListener("message", function(from, to, message) {
        if (message.match(regex)) {
            client.say(to, "\x031,4▓ ☣ ▓ CAUTION - COPYRIGHT INFRINGEMENT DETECTED ▓ ☣ ▓\x03");
        }
    });
};