var express = require('express');
var http = require('http');

var app = express();

var server = app.listen(3000, function(){
	console.log('Listening on port %d', server.address().port);
});

app.get('/weather', function(req, res){
	lat = req.param('lat', '35');
	lon = req.param('lon', '139');

	path = 'http://api.openweathermap.org/data/2.5/forecast/daily?lat=' + lat + '&lon=' + lon + '&cnt=10&mode=json';
	console.log('Using path ' + path);

	http.get(path, function(getRes){
		console.log("Got response: " + getRes.statusCode);
		data = "";
		getRes.on('data', function(chunk){
			data += chunk;
		});
		getRes.on('end', function() {
			toReturn = data;
			res.send(toReturn);
		})
	    }).on('error', function(e) {
		errorMsg = "Got error: " + e.message;
		console.log(errorMsg);
		res.send(errorMsg);
	    });
});
