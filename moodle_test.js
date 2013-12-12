var fs = require('fs');
var utils = require('utils');
var x = require('casper').selectXPath;


var config_file = "./moodle_monitoring.conf";
var config;


//casper = require('casper').create();
// With help from http://blog.newrelic.com/2013/06/04/simpler-ui-testing-with-casperjs-2/


var config = JSON.parse(fs.read(config_file));

casper.test.on('fail', function() {
	var d = new Date();
	var timestamp = d.getFullYear() + (d.getMonth()+1).toString() + d.getDate() + "_" + d.getHours() + d.getMinutes() + d.getSeconds();

    casper.capture('screenshots/fail' + timestamp + '.png');
});


casper.test.begin('Log into Moodle and check a sample course for basic functionality', 39, function suite(test) {

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
		
		// Make sure form fields are present
		this.test.assertExists('form#fm1',
			'Login form exists'
		);			
		this.test.assertExists('form#fm1 #username',
			'Username field exists'
		);	
		this.test.assertExists('form#fm1 #password',
			'Password field exists'
		);	
	
		 this.fill('form#fm1', {
			'username':    config.account.username,
			'password':    config.account.password
		}, true);
	});
	
	
	// Check My Home
	casper.then(function() {
	
		test.comment("Testing My Home page");
	
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
		
		// Check for test course link
		this.test.assertExists('a[title="Swarthmore Test Course"]',
			'\"Swarthmore Test Course\" link exists'
		);
	});
	
	
	// Check Swarthmore test course
	casper.thenClick('a[title="Swarthmore Test Course"]', function() {
	
		test.comment("Testing \"Swarthmore Test Course\"");

		// Check http status
		this.test.assertHttpStatus(200, 'Swarthmore Test Course page is up (status 200)');
	
		// Check login page title
		this.test.assertTitle(
			'Course: Swarthmore Test Course',
			'Swarthmore Test Course page has the correct title'
		);

		this.test.assertTextExists("You are logged in as", "\"You are logged in as\" text appears on the page");
		
		// Check for test text page course link
		this.test.assertExists({
        	type: 'xpath', path: "//a/span[contains(text(),'Test Text Page')][1]" }, 
        	"\"Test Text Page\" link exists" );
	
		// Check for test text file course link
		this.test.assertExists({
        	type: 'xpath', path: "//a/span[contains(text(),'Test Text File')][1]" }, 
        	"\"Test Text File\" link exists" );	
	
		// Check for test blog course link
		this.test.assertExists({
        	type: 'xpath', path: "//a/span[contains(text(),'Test Blog')][1]" }, 
        	"\"Test Blog\" link exists" );	
	
	});


	// Check Test Text page
	casper.thenClick({ type: 'xpath', path: "//a/span[contains(text(),'Test Text Page')][1]"}, function() {
	
		test.comment("Testing \"Test Text Page\"");

		// Check http status
		this.test.assertHttpStatus(200, 'Test text page is up (status 200)');
	
		// Check login page title
		this.test.assertTitle(
			'ITS_Test: Test Text Page',
			'Test Text page has the correct title'
		);

		// Check for login info
		this.test.assertTextExists("You are logged in as", "\"You are logged in as\" text appears on the page");

		// Check for  page content
		this.test.assertTextExists("As he said this, Ahab advanced upon him with such overbearing terrors in his aspect, that Stubb involuntarily retreated.", "Sample text appears on the test text page");
		
		// Return to main course page
		casper.back();
		
	});
	
	
	// Check Test Text file
	casper.thenClick({ type: 'xpath', path: "//a/span[contains(text(),'Test Text File')][1]"}, function() {
	
		test.comment("Testing \"Test Text File\"");

		// Check http status
		this.test.assertHttpStatus(200, 'Test text file page is up (status 200)');

		// Check for  page content
		this.test.assertTextExists("Nothing was greater there than the quality of robust love", "Sample text appears on the test text page");
		
		// Return to main course page
		casper.back();
		
	});
	

	// Check Campus Pack blog
	casper.thenClick({ type: 'xpath', path: "//a/span[contains(text(),'Test Blog')][1]"}, function() {
	
		test.comment("Testing \"Test Campus Pack Blog\"");

		// Check http status
		this.test.assertHttpStatus(200, 'Campus Pack blog page is up (status 200)');

		// Check page title
		this.test.assertTitle(
			'Swarthmore College Blogs and Wikis - Test Blog',
			'Campus Pack blog page has the correct title'
		);

		// Check for page heading
		this.test.assertTextExists("Swarthmore College Blogs and Wikis", "Heading text appears on the blog page");

		// Check for page content
		this.test.assertTextExists("They, of course, are Walden all over and all through; are themselves small Waldens in the animal kingdom, Waldenses", "Sample text appears on the Campus Pack blog page");

		// Check for link back to Moodle
		this.test.assertExists({
        	type: 'xpath', path: "//a[contains(text(),'Moodle Home')][1]" }, 
        	"\"Moodle Home\" link exists" );	
	});
	
	
	
	// Check returning to main course page
	casper.thenClick({ type: 'xpath', path: "//a[contains(text(),'Moodle Home1')][1]"}, function() {
		
		test.comment("Testing return to \"Swarthmore Test Course\"");

		// Check http status
		this.test.assertHttpStatus(200, 'Swarthmore Test Course page is up (status 200)');
	
		// Check login page title
		this.test.assertTitle(
			'Course: Swarthmore Test Course',
			'Swarthmore Test Course page has the correct title'
		);

		this.test.assertTextExists("You are logged in as", "\"You are logged in as\" text appears on the page");

		// Check to see if the logout link is present
		// Check for link back to Moodle
		this.test.assertExists({ type: 'xpath', path:"//a[contains(text(),'Logout')][1]"}, "\"Logout\" link exists" );		
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
			this.echo('The whole test suite ended.');
		});
    
});





