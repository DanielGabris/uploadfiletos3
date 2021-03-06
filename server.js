crypto = require("crypto");
moment = require("moment"); //requires >= 1.5.0 for UTC support

var express = require('express');
var app = express();

app.use("/",express.static(__dirname + '/public'));

var AWS_BUCKET = 'lezyeoh';
var AWS_ACCESS_KEY = 'AKIAIEW5ODTJENQ2PM4Q';
var AWS_SECRET_KEY = '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';

app.get('/getS3Options', function (req, res) {

	var s3Policy = {
		'conditions': [
			{'bucket': AWS_BUCKET},
			['starts-with', '$key', ''],
			{'acl': 'public-read'},
			["content-length-range", 0, 10 * 1024 * 1024],
			['starts-with', '$Content-Type', 'image']
		],
		'expiration': moment().add('minutes', 60).format("YYYY-MM-DDTHH:MM:ss\\Z")
	};

	var policy = new Buffer(JSON.stringify(s3Policy)).toString("base64")
	var signature = crypto.createHmac("sha1", AWS_SECRET_KEY).update(policy).digest("base64")

	res.json(
		{
			policy: policy,
			signature: signature,
			key: AWS_ACCESS_KEY
		});
});

var port = Number(process.env.PORT || 8000);
var server = app.listen(port, function() { console.log('Listening on port %d', server.address().port); });
