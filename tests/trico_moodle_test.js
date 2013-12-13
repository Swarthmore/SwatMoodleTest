var fs = require('fs');
var utils = require('utils');
var x = require('casper').selectXPath;
var moment = require('moment');

var config_file = "./moodle_monitoring.conf";
var config;

// With help from http://blog.newrelic.com/2013/06/04/simpler-ui-testing-with-casperjs-2/


var config = JSON.parse(fs.read(config_file));
var timestamp = moment().format('YYYYMMDD-HHmmss');


// Save screenshot for every failure
casper.test.on('fail', function() {
	var d = new Date();
	//test.echo("Saving test failure screenshot as: fail" + timestamp + '.png');
    casper.capture('screenshots/fail' + timestamp + '.png');
});



casper.test.begin('Log into Moodle and visit TriCo Mnet Test Courses', 32, function suite(test) {

	// Check home page
	casper.start(config.site.url, function() {

		test.comment("Attempting to open " + config.site.url);
		test.comment("Site opened is: " + this.getCurrentUrl());

		// Check URL
		this.test.assert(
			this.getCurrentUrl() === config.site.url, 'Url is the one expected'
		);
 
		// Check http status
		this.test.assertHttpStatus(200, 'Moodle site is up (status 200)');

		// Check Moodle home page title
		this.test.assertTitle(
			'Swarthmore College Moodle',
			'Home page has the correct title'
		);

		this.test.assertTextExists("You are not logged in.", "\"You are not logged in.\" text appears on the page");

		this.test.assertExists('a[title="Log in to Moodle at Swarthmore College"]',
			'Login button exists'
		);
		
	});


	// Now log in
	casper.thenClick('a[title="Log in to Moodle at Swarthmore College"]', function() {

		test.comment("Testing CAS login");

		// Check http status
		this.test.assertHttpStatus(200, 'CAS login page is up (status 200)');
	
		// Check login page title
		this.test.assertTitle(
			'Swarthmore Login',
			'CAS login has the correct title'
		);
	
		 this.fill('form#fm1', {
			'username':    config.account.username,
			'password':    config.account.password
		}, true);
	});
	
	
	// Check My Home
	casper.then(function() {
	
		test.comment("Testing My Home page");
	
		this.debugPage();
	
		// Check http status
		this.test.assertHttpStatus(200, 'My Home page is up (status 200)');
		
		// Check My Home page title
		this.test.assertTitle(
			'Moodle Home: My home',
			'My Home has the correct title'
		);	

		this.test.assertTextExists("You are logged in as", "\"You are logged in as\" text appears on the page");
		
		// Check for proper page heading
		this.test.assertTextExists("Moodle Home: My home", "\"My Home\" text appears on the page");
		
		// Check for Bryn Mawr site link
		this.test.assertExists('a[title="Bryn Mawr Moodle"]',
			'\"Bryn Mawr Moodle\" link exists'
		);
		
		// Check for Haverford site link
		this.test.assertExists('a[title="Haverford College Moodle"]',
			'\"Haverford College Moodle\" link exists'
		);		
		
	});
	
	
	// Check Haverford Mnet
	casper.thenClick('a[title="Haverford College Moodle"]', function() {
	
		test.comment("Testing \"Haverford College Moodle Mnet\"");

		// Check http status
		this.test.assertHttpStatus(200, 'Haverford Main Moodle page is up (status 200)');
	
		// Check login page title
		this.test.assertTitle(
			'Moodle: My home',
			'Haverford College Moodle \"My Home\" has the correct title'
		);

		this.test.assertTextExists("You are logged in as", "\"You are logged in as\" text appears on the page");
		
		// Check for MNet test course
		this.test.assertExists('a[title="MNET Test Course"]',
			'\"MNET Test Course\" link exists'
		);		
	
	});


	// Check Haverford MNET Test Course Page
	casper.thenClick('a[title="MNET Test Course"]', function() {
	
		test.comment("Testing \"Haverford College MNET Test Course\"");

		// Check http status
		this.test.assertHttpStatus(200, 'Haverford MNET Test Course page is up (status 200)');
	
		// Check login page title
		this.test.assertTitle(
			'Course: MNET Test Course',
			'Haverford MNET Test Course page has the correct title'
		);

		// Check for logged in message
		this.test.assertTextExists("You are logged in as", "\"You are logged in as\" text appears on the page");
		
		// Check for content on the page
		this.test.assertTextExists("SO Roger Chillingworth—a deformed old figure, with a face that haunted men’s memories longer than they liked—took leave of Hester Prynne", "Expected text sample appears on the page");
		
		// Check for test text file course link
		this.test.assertExists({
        	type: 'xpath', path: "//a/span[contains(text(),'Test Text File')][1]" }, 
        	"\"Test Text File\" link exists" );
	
	});

	
	// Check Haverford Test Text file
	casper.thenClick({ type: 'xpath', path: "//a/span[contains(text(),'Test Text File')][1]"}, function() {
	
		test.comment("Testing \"Test Text File\"");

		// Check http status
		this.test.assertHttpStatus(200, 'Test text file page is up (status 200)');

		// Check for  page content
		this.test.assertTextExists("the Reverend Arthur Dimmesdale, whom the reader may remember as having taken a brief and reluctant part in the scene of Hester Prynne's disgrace; and, in close companionship with him, old Roger Chillingworth", "Sample text appears on the Haverford test text file");
		
		casper.back();		
		
	});
	

	// Check returning to main course page
	casper.thenClick({ type: 'xpath', path: "//a[contains(text(),'Swarthmore')][1]"}, function() {
		
		test.comment("Testing return to Swarthmore's Moodle Site");

		// Check http status
		this.test.assertHttpStatus(200, 'Swarthmore \"My Home\" page is up (status 200)');
	
		// Check My Home page title
		this.test.assertTitle(
			'Moodle Home: My home',
			'My Home has the correct title'
		);	

		this.test.assertTextExists("You are logged in as", "\"You are logged in as\" text appears on the page");
		
		// Check for proper page heading
		this.test.assertTextExists("Moodle Home: My home", "\"My Home\" text appears on the page");
		
		// Check for logout link
		this.test.assertExists({ type: 'xpath', path:"//a[contains(text(),'Logout')][1]"},
			'\"Logout\" link exists'
		);
		
	});


	// Check logging out
	casper.thenClick({ type: 'xpath', path:"//a[contains(text(),'Logout')][1]"}, function() {
		
		test.comment("Testing logging out of Moodle");
		
		// Check http status
		this.test.assertHttpStatus(200, 'Moodle CAS logout page is up (status 200)');

		// Check logout page title
		this.test.assertTitle(
			'Swarthmore Login',
			'CAS login has the correct title'
		);


		// Check that proper text exists on CAS logout page
		this.test.assertTextExists("You have successfully logged out of Swarthmore's Central Authentication Service (CAS).", "Proper CAS logout text appears on the page");
	
	});



	casper.run(function() {
			test.done();
			this.echo('The Haverford College MNet Test Suite ended.');
		});
    
});





