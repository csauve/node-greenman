module.exports = function(client, config) {
    var regex = /.*(torrent).*/i;

    client.addListener("message", function(from, to, message) {
        if (message.match(regex)) {
            client.say(to, "\x031,4▓ ☣ ▓ CAUTION - COPYRIGHT INFRINGEMENT DETECTED ▓ ☣ ▓\x03");
        }
    });
};