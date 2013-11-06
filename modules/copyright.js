module.exports = function(client, config) {
    client.addListener("message#", function(nick, to, text) {
        if (text.match(/.*torrent.*/i)) {
            client.say(to, "\x031,4▓ ☣ ▓ CAUTION - COPYRIGHT INFRINGEMENT DETECTED ▓ ☣ ▓\x03");
        }
    });
};
