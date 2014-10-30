c = require "irc-colors"

pages = {}

module.exports =
  page: (page, description) ->
    pages[page] = description

  init: (bot, config) ->
    module.exports.page "man", "View a manual page. Usage: #{c.red "#{config.global.prefix}man <page>"}"
    module.exports.page "man-search", "Search pages for text. Usage: #{c.red "#{config.global.prefix}man-search <regex>"}"
    module.exports.page "man-list", "List all manaul pages. Usage: #{c.red "#{config.global.prefix}man-list"}"

    bot.any ///^#{config.global.prefix}man\s+(.+)$///i, (from, to, match) ->
      description = pages[match[1]]
      bot.reply from, to, if description then description else "Page not found: #{match[1]}"

    bot.any ///^#{config.global.prefix}man-search\s+(.+)$///i, (from, to, match) ->
      matches = (s) ->
        regex = new RegExp match[1], "i"
        return regex.test s

      results = (page for page, description of pages when matches(page) or matches(description))
      if results.length
        bot.reply from, to, "These pages match #{match[1]}: #{results.join ", "}"
      else
        bot.reply from, to, "No results found for #{match[1]}"

    bot.any ///^#{config.global.prefix}man-list$///i, (from, to, match) ->
      results = (page for page of pages)
      bot.reply from, to, results.join ", "