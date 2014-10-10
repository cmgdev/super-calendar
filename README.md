super-calendar
==============

Just a little app I made for myself to display the sunrise/sunset times and upcoming weather.

Sunrise/Sunset times are calculated using mourner's suncalc.js: https://github.com/mourner/suncalc

The upcoming weather is gotten from http://openweathermap.org/API

Uses arshaw's fullcalendar library (https://github.com/arshaw/fullcalendar) to build the calendar.

Also uses express, moment, and cheerio from npm.

This app is designed to run in Heroku, and uses config-vars LAT and LON which are set to your latitude and longitude.

In the future, I would like those to be set by the user and maybe stored in a cookie.
