process.env.NODE_ENV = 'test';
var server = require('../server');

const Browser = require('zombie');

// We're going to make requests to http://example.com/signup
// Which will be routed to our test server localhost:3000
Browser.localhost('localhost', 3030);

describe('User searches on home page', function() {
  this.timeout(4000);

  const browser = new Browser();

  before(function(done) {
    server.listen(3030).on('listening', done);
  });

  before(function() {
    return browser.visit('/');
  });

  describe('and submits basic search', function() {

    before(function() {
      browser
        .fill('professor', 'Ronald Kroeker')
        .select('term', '1169')
      return browser.pressButton('Search');
    });

    it('should be successful', function() {
      browser.assert.success();
    });

    it('should see home page', function() {
      browser.assert.text('title', "Q: Waterloo's Advanced Quest Search");
    });

    it('should see 6 results', function() {
      browser.assert.elements('.courseMatch', 6);
    });
  });

  //Unfortunately not able to test search functionality with enter yet:
  //https://github.com/assaf/zombie/issues/275
  //http://stackoverflow.com/questions/11964059/how-to-emulate-press-enter-key-with-zombie-js

});