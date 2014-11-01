c = require "irc-colors"
crypto = require "crypto"
rateLimit = require "../../lib/rateLimit"

limiter = rateLimit
  rate: 0.5

module.exports = init: (bot, config, modules) ->
  prefix = config.global.prefix

  if modules.man
    modules.man.page "hash", "Calculate hashes of texts.
      See #{c.teal "hash-algorithms"} for a list of algorithms.
      Usage: #{c.red "#{prefix}hash <algorithm> <text>"}"

    modules.man.page "hash-algorithms", crypto.getHashes().join ", "

  bot.any ///^#{prefix}hash\s+(.+)\s+(.+)$///i, (from, to, match) ->
    limiter from,
      go: () ->
        try
          hash = crypto.createHash(match[1]).update(match[2]).digest "hex"
          bot.reply from, to, hash
        catch error
          bot.reply from, to, "Failed to hash: #{error}"
