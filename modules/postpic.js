module.exports = function(client, config) {
    client.addListener("message", function(from, to, message) {
        var match = message.match(RegExp(".*(" + config.nick + ":? post pic).*", "i"));
        if (match) {
            client.say(to, "\x030,3╭━━━━━━╮\x03");
            client.say(to, "\x030,3┃　\x031,8  ͡° ͜ʖ ͡° \x030,3 　　 ┃\x03");
            client.say(to, "\x030,3┃　　　　　　┃\x03");
            client.say(to, "\x030,3┃┃　　　┃　┃\x03");
            client.say(to, "\x030,3┃┃　　　┃　┃\x03");
            client.say(to, "\x030,3┃┃　　　┃　┃\x03");
            client.say(to, "\x030,3╰┫　　　╰┳╯\x03");
            client.say(to, "　\x030,3┃　5　 　┃\x03");
            client.say(to, "　\x030,3┃　┃　　┃\x03");
            client.say(to, "　\x030,3┃　┃　　┃\x03");
            client.say(to, "\x030,3╭┛╭┛　   ┃\x03");
            client.say(to, "\x030,3┗━┻━━━╯\x03");
        }
    });
};
