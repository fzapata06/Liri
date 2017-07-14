// Grabs the key variables
var keys = require('./keys.js');
var inquire = require('inquirer');
var request = require('request');
var Twitter = require('twitter');
var spotify = require('spotify');
var fs = require('fs');

var command = process.argv[2]; 
var title = process.argv.slice(3).join(' ');

function getMovie() {
    var movie = title  || 'Mr Nobody';
    var _movieName = title.split(' ').join('_') || 'Mr_Nobody';
    var movieInfo;
    request('http://www.omdbapi.com/?t=' + movie, function (error, response, body) {
        if (!error) {
            movieInfo = JSON.parse(body);
            console.log('Movie Title: ' + movieInfo['Title'] +
                '\n* Release Date: ' + movieInfo['Released'] +
                '\n* IMDB Rating: ' + movieInfo['imdbRating'] +
                '\n* Productin Country: ' + movieInfo['Country'] +
                '\n* Language: ' + movieInfo['Language'] +
                '\n* Plot: ' + movieInfo['Plot'] +
                '\n* Actors: ' + movieInfo['Actors'] +
                '\n* Rotton Tomatoes Ratings: ' + movieInfo['Ratings'][1]['Value'] +
                '\n* Website: ' + movieInfo['Website'] +
                '\n* Rotten Tomatoes URL: ' + 'https://www.rottentomatoes.com/m/' + _movieName + '/' 
                );
        } else {
            console.log('error:', error); // Print the error if one occurred 
        }
    }); 
}

function getSong() {

    var song = title  || 'dancing in the moonlight';
    spotify.search({ type: 'track', query: song }, function(err, data) {
        if ( err ) {
            console.log('Error occurred: ' + err);
            return;
        }
        console.log("* Song Name: " + data.tracks.items[0].name);
        console.log("* Artist Name: " + data.tracks.items[0].artists[0].name);
        console.log("* Preview: " + data.tracks.items[0].preview_url);
        console.log("* Album Name: " + data.tracks.items[0].album.name);
    });
}

function getTweets() {
    var twitterClient = new Twitter(keys.twitterKeys);
    var  Twitter_Params = {screen_name: 'eleanormark', count: 20}

    twitterClient.get('statuses/user_timeline', Twitter_Params, function(error, tweets, response) {
        if (!error) {
            tweets.forEach(function (tweet) { console.log("* Tweet: '" + tweet.text + 
                "' was created " + tweet.created_at);
            });
        } else {
            console.log('error:', error); // Print the error if one occurred 
        }
    });
}

function getRandom() {
    fs.readFile("random.txt", "utf-8", function(err, data) {
        if (err) console.log("Error: " + err);

        command = data.split(",")[0];
        title = data.split(",")[1] || "Yellow Submarine";
        console.log(command + " " + title);
        runCommand();
	});
}

function runCommand() {
    if (command === 'my-tweets') {
        getTweets();
    } else if (command === 'spotify-this-song') {
        getSong();
    } else if (command === 'movie-this') {
        getMovie(); 
    } else if (command === "do-what-it-says") {
        getRandom();
        }   
}

runCommand();
