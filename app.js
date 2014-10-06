var express = require('express');
var http = require('http');
var cheerio = require('cheerio');
var moment = require('moment');

var app = express();

var server = app.listen(3000, function(){
	console.log('Listening on port %d', server.address().port);
});

app.get('/weather', function(req, res){
	lat = req.param('lat', '35');
	lon = req.param('lon', '139');
	callback = req.param('callback');

	path = 'http://api.openweathermap.org/data/2.5/forecast/daily?lat=' + lat + '&lon=' + lon + '&cnt=10&mode=json&units=imperial';
	console.log('Using path ' + path);

	http.get(path, function(getRes){
		console.log("Got response: " + getRes.statusCode);
		data = "";
		getRes.on('data', function(chunk){
			data += chunk;
		});
		getRes.on('end', function() {
			recvJson = JSON.parse(data).list;
			sendJson = [];

			$ = cheerio.load(recvJson);
			$(recvJson).each(function(){
				sendJson.push({
					title: this.temp.morn + '°',
					start: moment(this.dt, 'X').hour(6).format(),
					color: '#448A88',
					className: 'weatherIcon',
					icon: this.weather[0].icon
				});
				sendJson.push({
					title: this.temp.eve + '°',
					start: moment(this.dt, 'X').hour(18).format(),
					color: '#266D7F',
					className: 'weatherIcon',
					icon: this.weather[0].icon
				});
			});			


			sendTxt = callback + '(\'' + JSON.stringify(sendJson) + '\');';
			console.log(sendTxt);
			res.set('Content-Type', 'application/javascript');	
			res.send(sendTxt);
		})
	    }).on('error', function(e) {
		errorMsg = "Got error: " + e.message;
		console.log(errorMsg);
		res.send(errorMsg);
	});
});

var kelvinToFahrenheit = function(k){
	f = parseInt(((k - 273.15)*1.8)+32);
	//console.log(k + ' = ' + f);
	return f;
};

