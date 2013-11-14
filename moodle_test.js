var fs = require('fs');
var utils = require('utils');

var config_file = "./moodle_monitoring.conf";
var config;



casper = require('casper').create();

var config = JSON.parse(fs.read(config_file));


casper.start('https://moodle.swarthmore.edu/', function() {
	this.echo(this.getTitle());
});


casper.thenClick('a[title="Log in to Moodle at Swarthmore College"]', function() {
	this.echo(this.getTitle());
	 this.fill('form#fm1', {
		'username':    config.account.username,
		'password':    config.account.password
	}, true);
});

casper.then(function() {
	this.echo(this.getTitle());
});

casper.thenClick('a[title="Swarthmore Test Course"]', function() {
	this.echo(this.getTitle());
});

casper.thenClick({
        type: 'xpath',
        path: "//a/span[contains(text(),'Test Text Page')][1]"
    }, function() {
	this.echo(this.getTitle());
});

casper.back();

casper.thenClick({
        type: 'xpath',
        path: "//a/span[contains(text(),'Test Text File')][1]"
    }, function() {
	this.echo(this.getTitle());
});

casper.back();

casper.thenClick('a[title="Logout"]', function() {
	this.echo(this.getTitle());
});


casper.run();





