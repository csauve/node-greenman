var path = require("path");
var config = require("./config");
var fs = require("fs");

var modules = {};

//returns the module from cache, otherwise uses node's own require to load the module
function requireModule(moduleName) {
    if (isModuleLoaded(moduleName)) {
        return modules[moduleName];
    }
    try {
        var mod = require(path.join(config.modulesDir, moduleName));
        mod.setup();
        modules[moduleName] = mod;
        console.log("Loaded module: " + moduleName);
        return mod;
    } catch (err) {
        console.error("Failed to load module: " + moduleName);
        console.error(err.stack);
        return null;
    }
}

//shuts down a module and invalidates it in the require cache
function unloadModule(moduleName) {
    if (!isModuleLoaded(moduleName)) {
        console.warn("Module " + moduleName + " is not loaded");
        return false;
    }
    modules[moduleName].shutdown();
    delete modules[moduleName];
    delete require.cache[require.resolve(path.join(config.modulesDir, moduleName))];
    console.log("Unloaded module: " + moduleName);
    return true;
}

//unloads (if loaded) then loads and returns a module
function reloadModule(moduleName) {
    unloadModule(moduleName);
    return requireModule(moduleName);
}

function isModuleLoaded(moduleName) {
    return modules[moduleName] ? true : false;
}

//load modules for the first time
function init() {
    var successfullyLoadedCount = 0;
    var modulesToLoad = _.difference(config.enabledModules || listAvailableModules(), config.disabledModules);

    modulesToLoad.forEach(function(moduleName) {
        requireModule(moduleName) && successfullyLoadedCount++;
    });

    console.log("Loaded " + successfullyLoadedCount + " modules");
    return successfullyLoadedCount;
}

//returns array of currently loaded module names
function listLoadedModules() {
    var moduleNames = [];
    for (var moduleName in modules) {
        moduleNames.push(moduleName);
    }
    return moduleNames;
}

//returns array of names of all .js files in the modules directory (without the .js)
function listAvailableModules() {
    var files = fs.readdirSync(config.modulesDir);
    var moduleNames = [], match;
    files.forEach(function(filename) {
        (match = filename.match(/(.*)\.js/i)) && moduleNames.push(match[1]);
    });
    return moduleNames;
}

//public interface
module.exports = {
    requireModule: requireModule,
    unloadModule: unloadModule,
    reloadModule: reloadModule,
    isModuleLoaded: isModuleLoaded,
    init: init,
    listLoadedModules: listLoadedModules,
    listAvailableModules: listAvailableModules
}