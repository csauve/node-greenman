module.exports = (options) ->
  requestsPerSecond = options.rate || 1
  burst = options.burst || 1
  maxStrikes = options.strikes || 0
  cooldown = options.cooldown || 0

  buckets = {}

  return (key, callbacks) ->
    if buckets[key] == undefined
      buckets[key] =
        tokens: burst
        lastRequest: new Date().getTime()
        strikes: 0

    now = new Date().getTime()
    elapsedSec = (now - buckets[key].lastRequest) / 1000

    currTokens = buckets[key].tokens
    buckets[key].tokens = Math.min(burst, currTokens + elapsedSec * requestsPerSecond)
    buckets[key].lastRequest = now

    if cooldown > 0 and elapsedSec >= cooldown then buckets[key].strikes = 0
    if maxStrikes > 0 and buckets[key].strikes >= maxStrikes then return

    if buckets[key].tokens >= 1
      buckets[key].tokens--
      callbacks.go()
    else
      buckets[key].strikes++
      if callbacks.no then callbacks.no buckets[key].strikes