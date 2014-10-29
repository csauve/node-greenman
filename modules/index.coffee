fs = require "fs"
path = require "path"
async = require "async"
colors = require "colors/safe"

module.exports = init: (config, bot, callback) ->
  fs.readdir __dirname, (error, files) ->
    return callback error if error

    tryLoadModule = (file, asyncCallback) ->
      if file in config?.global?.disabledModules or file[0] == "."
        return asyncCallback()

      filePath = path.join __dirname, file
      fs.stat filePath, (error, stats) ->
        return asyncCallback error if error

        try
          if stats.isDirectory()
            mod = require "./#{file}"
            console.log "Initializing module #{colors.green file}"
            mod.init config, bot
          asyncCallback()
        catch error
          asyncCallback error

    async.each files, tryLoadModule, callback