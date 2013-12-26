var path = require("path");
var config = require("./config");
var fs = require("fs");

var modules = {};

//shuts down a module and invalidates its associated require cache
function unloadModule(moduleName, callback) {
    if (!modules[moduleName]) {
        console.warn("Module " + moduleName + " is not loaded");
        callback("Module " + moduleName + " is not loaded");
        return;
    }
    modules[moduleName].shutdown();
    delete modules[moduleName];
    delete require.cache[require.resolve(path.join(config.modulesDir, moduleName))];
    console.log("Unloaded module: " + moduleName);
    callback();
}

//loads a module, or reloads it if the module has already been loaded
function loadModule(moduleName, callback) {
    if (modules[moduleName]) {
        console.log("Module " + moduleName + " is already loaded. Unloading");
        unloadModule(moduleName, function(error) {
            if (error) {
                console.warn(error);
            }
        });
    }

    try {
        var mod = require(path.join(config.modulesDir, moduleName));
        mod.setup();
        modules[moduleName] = mod;
        console.log("Loaded module: " + moduleName);
        callback();
    } catch (err) {
        console.error("Failed to load module: " + moduleName);
        console.error(err.stack);
        callback(err);
    }
}

//load modules for the first time
function init() {
    var count = 0;
    var modulesToLoad = config.enabledModules || fs.readdirSync(config.modulesDir);
    modulesToLoad.forEach(function(moduleName) {
        moduleName = moduleName.split(".")[0];

        //ignore modules in the disabled list
        if (_.contains(config.disabledModules, moduleName)) {
            return;
        }

        loadModule(moduleName, function(error) {
            if (!error) {
                count++;
            }
        });
    });

    console.log("Loaded " + count + " modules");
    return count;
}

function getLoadedModules() {
    var moduleNames = [];
    for (var moduleName in modules) {
        moduleNames.push(moduleName);
    }
    return moduleNames;
}

//public interface
module.exports = {
    unloadModule: unloadModule,
    loadModule: loadModule,
    init: init,
    getLoadedModules: getLoadedModules
}