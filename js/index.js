/*global var, $*/
var data_timestamp = Math.round(new Date().getTime() / 1000);
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
 
}
 
/* use browsers geolocation capability */
$(function geolocation() {
if (navigator.geolocation) {
navigator.geolocation.getCurrentPosition(getcoordinates, showError);
}
else {
$("#weather").html("Geolocation is not supported by this browser.");
}
});
 
/*store co-ordinates as variable */
function getcoordinates(position) {
 
var lat = position.coords.latitude;
var lon = position.coords.longitude;
/**add variable to local storage**/
var units = localStorage.getItem("Units");
/*current weather data url(units variable required to convert data string from "C" to "F" etc for options page */
 
var CurrentWeatherURL = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=" + units;
 
/*units variable created to change data c/f, data can be requested in either format by replacing units in the above url string*/
if (units == "imperial") {
getWeather(CurrentWeatherURL, DailyForecastURL, "F", "mph")
}
else {
getWeather(CurrentWeatherURL, DailyForecastURL, "C", "m\/s")
}
}
 
/* get default error code responses */
function showError(error) {
switch (error.code) {
case error.PERMISSION_DENIED:
$("#weather").html("User denied the request for Geolocation.");
break;
case error.POSITION_UNAVAILABLE:
$("#weather").html("Location information is unavailable at this time.");
break;
case error.TIMEOUT:
$("#weather").html("The request to get user location timed out.");
break;
case error.UNKNOWN_ERROR:
$("#weather").html("An unknown error occurred, please try again later.");
break;
}
}

/* current data */
function getWeather(CurrentWeatherURL, temp, wind) {
/*Ajax function(success callback function is passed the returned
data as a json object */
$.ajax({
url: CurrentWeatherURL,
type: 'GET',/* 'get' method used to request data from server */
cache: false,
dataType: "jsonp",
jsonp: 'callback',
success: function (data) {
/* store json data forecast in local storage as string format data */
localStorage.WeatherCache = JSON.stringify(data);
console.log(data);
},
/* error handling will display status from errorData variable */
error: function (errorData) {
$("#weather").html("Error retrieving current weather data :: " + errorData.status);
}
});
}

/* Show data*/
function displayData(temp_units, wind_units) {
try {
/* If the timestamp is newer than 15(900) minutes, parse data from cache */
if (localStorage.getItem('timestamp') > data_timestamp - 9) {
/*variable to store the converted string to local storage */
 
try{
var data = JSON.parse(localStorage.WeatherCache);
}
catch (exception) {
if (window.console) {
console.error(exception);
}
return;
}
 
var i = 0;
 
$("#weather").html('<h2>' + data.name + '</h2><img class="icon" src="img/icons/' + data.weather[i].icon + '.png"><span id="temp">'
+ Math.round(data.main.temp) + ' </span><span id="units">&deg;' + temp_units + '</span>' + '' + ' ' + '<p id="description">' + data.weather[i].description + '</p>' + '<p>' +
'<span id="humidity">' + data.main.humidity + '% humidity</span>&nbsp;&nbsp;&nbsp;&nbsp;' + Math.round(data.wind.speed) + wind_units + ' wind</p>');
}
else {
geolocation();
}
}
catch (error) {
window.console && console.error(error);
}
 
}

/* store selected measurement output type */
function SetUnits(units) {
localStorage.Units = units;
$(".active").removeClass("active");
$("#" + units).addClass("active");
}
/* switch between unit types imperial or metric */
$(function () {
$("#imperial, #metric").on("click", function () {
SetUnits(this.id);
/* reload app to show change immediately */
location.reload();
});
DefaultUnits();
});
function DefaultUnits() {
var system = localStorage.getItem("Units");
if (system != "metric" && system != "imperial") {
system = window.navigator.language == "en-US" ? "imperial" : "metric";
}
SetUnits(system);
}


