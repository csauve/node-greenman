var greenman = require("..");
var assert = require("assert");
var sinon = require("sinon");

var Bot = greenman.Bot;

describe("bot", function() {

  it("should return no client if not connected", function(done) {
    var bot = new Bot("nick");
    assert.equal(bot.getClient(), null);
    done();
  });

  it("should register listeners on the IRC client", function(done) {
    var fakeClient = {
      addListener: function(event, callback) {}
    };

    var mockClient = sinon.mock(fakeClient);
    mockClient.expects("addListener").once().withArgs("message")

    var bot = new Bot("nick");
    bot.use("message", function(from, to, text, message, next) {
      next(from, to, text, message);
    });

    bot.connect(fakeClient);
    mockClient.verify();

    done();
  });

  it("should chain middleware", function(done) {
    callbacks = {};
    var fakeClient = {
      addListener: function(event, callback) {
        callbacks[event] = callback;
      }
    };

    var bot = new Bot("nick");
    bot.use("message", function(from, to, text, message, next) {
      assert.equal(from, "from");
      assert.equal(to, "to");
      assert.equal(text, "text");
      next("nextfrom", "nextto", "nexttext", message);
    });
    bot.use("message", function(from, to, text, message, next) {
      assert.equal(from, "nextfrom");
      assert.equal(to, "nextto");
      assert.equal(text, "nexttext");
      done();
    });

    bot.connect(fakeClient);
    callbacks["message"]("from", "to", "text", {});
  });

  it("should apply helper middleware in the right order", function(done) {
    callbacks = {};
    var fakeClient = {
      addListener: function(event, callback) {
        callbacks[event] = callback;
      }
    };

    var checkpoints = [];

    var bot = new Bot("nick");
    bot.event("message", function(from, to, text) {
      assert.equal(from, "from");
      assert.equal(to, "to");
      assert.equal(text, "text");
      checkpoints.push("A");
    });
    bot.msg(function(nick, channel, text) {
      assert.equal(nick, "from");
      assert.equal(channel, "to");
      assert.equal(text, "text");
      checkpoints.push("B");
    });
    bot.msg(/other/i, function(nick, channel, match) {
      assert(false, "Shouldn't be here!");
    });
    bot.msg(/te(xt)/i, function(nick, channel, match) {
      assert.equal(nick, "from");
      assert.equal(channel, "to");
      assert.equal(match[1], "xt");
      checkpoints.push("C");

      assert.equal(checkpoints[0], "A");
      assert.equal(checkpoints[1], "B");
      assert.equal(checkpoints[2], "C");
      assert.equal(checkpoints.length, 3);
      done();
    });

    bot.connect(fakeClient);
    callbacks["message"]("from", "to", "text", {});
  });
});