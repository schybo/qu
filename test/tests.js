process.env.NODE_ENV = 'test';
var server = require('../server');

const Browser = require('zombie');
const facebookLink = "http://www.facebook.com/share.php?u=https://uwcourses.com/&title=Better Quest Searching";
const twitterLink= "http://twitter.com/share?text=Better Quest Searching!&url=https://uwcourses.com/&hashtags=waterloo,quest,classes";
const githubLink = "https://github.com/bscheibe/qu/";

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

  var clearBrowser = function () {
  	//Don't have the course subject cleared here yet
  	browser
        .select('campus', 'UW U')
        .select('term', '1169')
        .select('days', '')
        .select('time', '')
        .select('level', '')
        .fill('professor', '')
        .fill('subjects', '')
  }

  //************* UI Tests **************//

  //Unfortunately not able to test search functionality with enter yet:
  //https://github.com/assaf/zombie/issues/275
  //http://stackoverflow.com/questions/11964059/how-to-emulate-press-enter-key-with-zombie-js

  describe('and test online campus ui change', function() {
    before(function() {
      browser
        .select('campus', 'ONLN ONLINE')
      return true;
    });

    it('should disable search by days', function() {
      browser.assert.attribute('#days', 'disabled', 'true');
    });

    it('should disable search by time', function() {
      browser.assert.attribute('#time', 'disabled', 'true');
    });

  });

  describe('and test abroad campus ui change', function() {
    before(function() {
      browser
        .select('campus', 'OFF ABROAD')
      return true;
    });

    it('should disable search by days', function() {
      browser.assert.attribute('#days', 'disabled', 'true');
    });

    it('should disable search by time', function() {
      browser.assert.attribute('#time', 'disabled', 'true');
    });

  });

  describe('and test MWF ui change', function() {
    before(function() {
      browser
        .select('campus', 'UW U')
        .select('days', 'MWF')
      return true;
    });

    it('should offer 10 time choices', function() {
      browser.assert.elements('#time > option', { exactly: 10 });
    });

  });

  describe('and test TTh ui change', function() {
    before(function() {
      browser
        .select('campus', 'UW U')
        .select('days', 'TTh')
      return true;
    });

    it('should offer 11 time choices', function() {
      browser.assert.elements('#time > option', { exactly: 11 });
    });

  });

  describe('and test MW ui change', function() {
    before(function() {
      browser
        .select('campus', 'UW U')
        .select('days', 'MW')
      return true;
    });

    it('should offer 11 time choices', function() {
      browser.assert.elements('#time > option', { exactly: 11 });
    });

  });

  describe('and test WF ui change', function() {
    before(function() {
      browser
        .select('campus', 'UW U')
        .select('days', 'WF')
      return true;
    });

    it('should offer 11 time choices', function() {
      browser.assert.elements('#time > option', { exactly: 11 });
    });

  });

  describe('and test M ui change', function() {
    before(function() {
      browser
        .select('campus', 'UW U')
        .select('days', 'M')
      return true;
    });

    it('should offer 4 time choices', function() {
      browser.assert.elements('#time > option', { exactly: 4 });
    });

  });

  describe('and test T ui change', function() {
    before(function() {
      browser
        .select('campus', 'UW U')
        .select('days', 'T')
      return true;
    });

    it('should offer 4 time choices', function() {
      browser.assert.elements('#time > option', { exactly: 4 });
    });

  });

  describe('and test W ui change', function() {
    before(function() {
      browser
        .select('campus', 'UW U')
        .select('days', 'W')
      return true;
    });

    it('should offer 4 time choices', function() {
      browser.assert.elements('#time > option', { exactly: 4 });
    });

  });

  describe('and test Th ui change', function() {
    before(function() {
      browser
        .select('campus', 'UW U')
        .select('days', 'Th')
      return true;
    });

    it('should offer 4 time choices', function() {
      browser.assert.elements('#time > option', { exactly: 4 });
    });

  });

  describe('and has the following header basics: ', function() {
    it('the faq link', function() {
      browser.assert.link('a.header-link', 'FAQ', '/faq');
    });

    it('the correct header', function() {
      browser.assert.text('h1', 'Advanced Quest Search');
    });

    it('the status element', function() {
      browser.assert.element('.status');
    });

    it('the logo', function() {
      browser.assert.element('img.logo');
    });
  });

  describe('and floating action button works: ', function() {
    before(function() {
      return browser.assert.element('#menu');
    });

    it('and it has 3 children', function() {
      browser.assert.elements('.mfb-component__list > li', { exactly: 3 });
    });

    it('and the facebook link is correct', function() {
      browser.assert.link('#facebook', '', facebookLink);
    });

    it('and the twitter link is correct', function() {
      browser.assert.link('#twitter', '', twitterLink);
    });

    it('and the github link is correct', function() {
      browser.assert.link('#github', '', githubLink);
    });
  });

  describe('and can see the calendar', function() {
    before(function() {
      return browser.pressButton('#courseCalendarHeader');
    });

    it('with correct interior', function() {
      browser.assert.element('.fc-view-container');
    });
  });

  describe('and currently sees no matches', function() {
    it('with correct header', function() {
      browser.assert.text('#resultsHeaderForNoMatches', 'No Matches');
    });
  });

  //************* Functionality Tests **************//

  describe('and submits basic search', function() {
    before(function() {
      clearBrowser();
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

    it('should see correct search result headers', function() {
      browser.assert.text('#resultsHeaderForCourse', "6 Course Matches");
      browser.assert.text('#resultsHeaderForLab', "No Lab Matches");
      browser.assert.text('#resultsHeaderForTutorial', "No Tutorial Matches");
      browser.assert.text('#resultsHeaderForTest', "No Test Matches");
    });
  });

  describe('and submits search with previous and course level', function() {
    before(function() {
      browser
        .fill('professor', 'Ronald Kroeker')
        .select('term', '1169')
        .select('level', '2')
      return browser.pressButton('Search');
    });

    it('should be successful', function() {
      browser.assert.success();
    });

    it('should see 4 results', function() {
      browser.assert.elements('.courseMatch', 4);
    });
  });

  describe('and submits search with previous and days', function() {
    before(function() {
      browser
        .fill('professor', 'Ronald Kroeker')
        .select('term', '1169')
        .select('level', '2')
        .select('days', 'MWF')
      return browser.pressButton('Search');
    });

    it('should be successful', function() {
      browser.assert.success();
    });

    it('should see 1 results', function() {
      browser.assert.elements('.courseMatch', 1);
    });
  });

  describe('and submits search with previous and time', function() {
    before(function() {
      browser
        .fill('professor', 'Ronald Kroeker')
        .select('term', '1169')
        .select('level', '2')
        .select('days', 'MWF')
        .select('time', '11:30-12:20')
      return browser.pressButton('Search');
    });

    it('should be successful', function() {
      browser.assert.success();
    });

    it('should see 1 results', function() {
      browser.assert.elements('.courseMatch', 1);
    });
  });

  describe('and submits search with previous and subject', function() {
    before(function() {
      browser
        .fill('professor', 'Ronald Kroeker')
        .fill('subjects', 'LAT')
        .select('term', '1169')
        .select('level', '2')
        .select('days', 'MWF')
        .select('time', '11:30-12:20')
      return browser.pressButton('Search');
    });

    it('should be successful', function() {
      browser.assert.success();
    });

    it('should see 1 results', function() {
      browser.assert.elements('.courseMatch', 1);
    });
  });

  describe('and submits search with previous and two subjects', function() {
    before(function() {
      browser
        .fill('professor', 'Ronald Kroeker')
        .fill('subjects', 'LAT,CLAS')
        .select('term', '1169')
        .select('level', '2')
        .select('days', 'MWF')
        .select('time', '11:30-12:20')
      return browser.pressButton('Search');
    });

    it('should be successful', function() {
      browser.assert.success();
    });

    it('should see 1 results', function() {
      browser.assert.elements('.courseMatch', 1);
    });
  });

  describe('and submits search with previous and incorrect subject', function() {
    before(function() {
      browser
        .fill('professor', 'Ronald Kroeker')
        .fill('subjects', 'CLAS')
        .select('term', '1169')
        .select('level', '2')
        .select('days', 'MWF')
        .select('time', '11:30-12:20')
      return browser.pressButton('Search');
    });

    it('should be successful', function() {
      browser.assert.success();
    });

    it('should see 0 results', function() {
      browser.assert.elements('.courseMatch', 0);
    });
  });

  describe('and test search by time range', function() {
    before(function() {
      clearBrowser();
      browser.pressButton('button.circular');
      browser
        .fill('startRange', '12:00pm')
        .fill('endRange', '4:00pm')
        .fill('professor', 'Ronald Kroeker')
      return browser.pressButton('Search');
    });

    it('should see 1 results', function() {
      browser.assert.elements('.courseMatch', 1);
    });

  });

  describe('and test search by only start time', function() {
    before(function() {
      browser
        .fill('startRange', '12:00pm')
        .fill('endRange', '')
        .fill('professor', 'Ronald Kroeker')
      return browser.pressButton('Search');
    });

    it('should see 1 results', function() {
      browser.assert.elements('.courseMatch', 1);
    });

  });

  describe('and test search by only end time', function() {
    before(function() {
      browser
        .fill('startRange', '')
        .fill('endRange', '4:00pm')
        .fill('professor', 'Ronald Kroeker')
      return browser.pressButton('Search');
    });

    it('should see 6 results', function() {
      browser.assert.elements('.courseMatch', 6);
    });

  });

  //****************** FAQ Tests ********************//

  describe('and the FAQ page loads', function() {
    before(function() {
      return browser.visit('/faq');
    });

    it('and has the correct header', function() {
      browser.assert.text('h1#faq', 'FAQ');
    });

  });

});