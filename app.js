var express = require('express');
var http = require('http');
var cheerio = require('cheerio');
var moment = require('moment');
var suncalc = require('./web/js/suncalc.js');

var app = express();
app.use('/web', express.static(__dirname + '/web'));

var server = app.listen(3000, function(){
	console.log('Listening on port %d', server.address().port);
});

var LAT = process.env.LAT;
var LON = process.env.LON;

app.get('/weather', function(req, res){
	lat = req.param('lat', LAT);
	lon = req.param('lon', LON);
	callback = req.param('callback');

	path = 'http://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&cnt=10&mode=json&units=imperial';
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
					title: this.main.temp + '&deg; <br/> <i> ' + this.weather[0].description + ' </i> ',
					start: moment(this.dt, 'X').format(),
					color: '#448A88',
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

app.get('/suncalc', function(req, res){
        lat = req.param('lat', LAT);
        lon = req.param('lon', LON);
	start = moment(req.param('start', moment()));
	end = moment(req.param('end', moment().add(1, 'M')));
        callback = req.param('callback');
	
	console.log('start is ' + start.toISOString());
	console.log('end is ' + end.toISOString());

	sendJson = [];
	var current = start;
        while(current.isBefore(end)){
	        var times = suncalc.getTimes(current.toDate(), lat, lon);
                sendJson.push({
                	title: 'Sunrise',
                        start: times.sunrise,
                        color: '#CFBA9F'
                });
                sendJson.push({
                        title: 'Sunset',
                        start: times.sunset,
                        color: '#7AAF9B'
                });
                current = current.add(1, 'days');
        }

	sendTxt = callback + '(\'' + JSON.stringify(sendJson) + '\');';
        console.log(sendTxt);
	res.set('Content-Type', 'application/javascript');
        res.send(sendTxt);
});
