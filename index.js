require("coffee-script/register");

module.exports = {
  rateLimit: require("./lib/rateLimit"),
  Bot: require("./lib/greenman")
};