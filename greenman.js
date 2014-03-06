_ = require("underscore");
var moduleManager = require("./moduleManager");

//load the modules
if (moduleManager.init() == 0) {
	console.warn("No modules loaded.");
	process.exit(1);
}

//handle process errors during normal operation. we set this up *after*
//modules have loaded so a malfunctioning module doesn't crash greenman
process.on("uncaughtException", function(err) {
    console.log(err.stack);
});
