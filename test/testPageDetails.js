process.env.NODE_ENV = 'test';
var server = require('../server');

const Browser = require('zombie');

// We're going to make requests to http://example.com/signup
// Which will be routed to our test server localhost:3000
Browser.localhost('localhost', 3030);

describe('User visits signup page', function() {
  this.timeout(4000);

  const browser = new Browser();

  before(function(done) {
    server.listen(3030).on('listening', done);
  });

  before(function() {
    return browser.visit('/');
  });

  describe('submits form', function() {

    before(function() {
      browser
        .fill('professor', 'Ronald Kroeker');
      return browser.pressButton('Search');
    });

    it('should be successful', function() {
      browser.assert.success();
    });

    it('should see welcome page', function() {
      browser.assert.text('title', "Q: Waterloo's Advanced Quest Search");
    });
  });

});