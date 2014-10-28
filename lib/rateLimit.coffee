buckets = {}

module.exports = (requestsPerSecond = 1, burst = 1) ->
  return (from, to, message, next) ->
    if buckets[from] == undefined
      buckets[from] =
        tokens: burst
        lastRequest: new Date().getTime()

    now = new Date().getTime()
    elapsedSec = (now - buckets[from].lastRequest) / 1000
    currTokens = buckets[from].tokens
    buckets[from].tokens = Math.min(burst, currTokens + elapsedSec * requestsPerSecond)
    buckets[from].lastRequest = now

    if buckets[from].tokens >= 1
      buckets[from].tokens -= 1
      next()