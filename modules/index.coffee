fs = require "fs"
path = require "path"
async = require "async"
colors = require "colors/safe"

module.exports = getEnabled: (config, callback) ->
  fs.readdir __dirname, (error, files) ->
    if error then throw error

    isEnabledModule = (file, filterCallback) ->
      if file in config?.global?.disabledModules or file[0] == "."
        return filterCallback false

      filePath = path.join __dirname, file
      fs.stat filePath, (error, stats) ->
        if error then throw error
        filterCallback stats.isDirectory()

    async.filter files, isEnabledModule, (names) ->
      mods = {}
      for name in names
        mods[name] = require "./#{name}"
      callback mods