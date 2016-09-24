var fs = require("fs");
var twitterKeys = require("./keys.js");
var twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var params = process.argv.slice(2);


var welcomeMessage = 
  "\r\n" +
  "Welcome! My name is LIRI. I can provide you with your latest tweets, song information from Spotify and movie data."  + "\r\n\r\n" +
  "Select one of the following choices: " + "\r\n\r\n" +
  "node liri.js my-tweets 'twitter handle'" + "\r\n\r\n" + 
  "node liri.js spotify-this-song 'song name'" + "\r\n\r\n" + 
  "node liri.js movie-this 'movie name'" + "\r\n\r\n" +
  "node liri.js do-what-it-says" + "\r\n";


var defaultMessage = 
  "\r\n" +
  "That was an invalid response, please try again." + "\r\n\r\n" +
  "What would you like me to do?" + "\r\n\r\n" +
  "Select one of the following choices: " + "\r\n\r\n" +
  "node liri.js my-tweets 'twitter handle'" + "\r\n\r\n" + 
  "node liri.js spotify-this-song 'song name'" + "\r\n\r\n" + 
  "node liri.js movie-this 'movie name'" + "\r\n\r\n" +
  "node liri.js do-what-it-says" + "\r\n";


// This switch statement handles Twitter/Spotify/OMDB calls
switch(params[0]) 
{

  case undefined: // UNDEFINED CASE WHEN USER FAILS TO ENTER TEXT AFTER TYPING node liri.js,
  // user is prompted with the Welcome Message
    console.log(defaultMessage);
    break;


  case "tweets":
  case "my-tweets":
    twitterCall(params[1]);
    break;


  case "spotify":
  case "spotify-this-song":
    if(params[1]) 
    {
      spotifyCall(params[1]);
    } 
    else 
    {
      spotifyCall("Ace of Base - The Sign");
    }
    break;


  case "movie":
  case "movie-this":
    if(params[1]) 
    {
      movieCall(params[1]);
    }
    else {
      if(params[1] === undefined) 
      {
        params[1] = "Mr. Nobody";
        movieCall();
      }
    }
    break;


  case "do":
  case "do-what-it-says":
    doCall(params[1]);
    break;

  default:
    console.log(defaultMessage);
} 


//This function specifies twitter keys in the keys.js file
function twitterCall() 
{
  var client = new twitter(
  {
    consumer_key: twitterKeys.twitterKeys.consumer_key,
    consumer_secret: twitterKeys.twitterKeys.consumer_secret,
    access_token_key:  twitterKeys.twitterKeys.access_token_key,
    access_token_secret: twitterKeys.twitterKeys.access_token_secret   
  });
  

  //This variable specifies user's twitter handle
  var twitterHandle = 'm_a_doyle';
  twitterHandle = params[1];
  params = {screen_name: twitterHandle};
  client.get('statuses/user_timeline', params, function(error, data, response)
  {
    if(error) 
    {
      throw error;
    }
    for(var i = 0; i < data.length; i++) 
    {
      var twitterResults = 
        "@" + data[i].user.screen_name + ": " + 
        data[i].text + "\r\n" + 
        data[i].created_at + "\r\n" + 
        "------- End of User's Tweet -------" + "\r\n\r\n";
      console.log(twitterResults);
      logData(twitterResults);
    }
  })
}; 


// This function sends request to Spotify
function spotifyCall(songName) 
{
  spotify.search({ type: 'track', query: songName }, function(error, data) 
  {
    if(error) 
    {
      console.log('An error occurred: ' + error);
      return;
    }
    var albumInfo = data.tracks.items[0];
    var spotifyResults = 
      "Artist: " + albumInfo.artists[0].name + "\r\n" +
      "Track Name: " + albumInfo.name + "\r\n" +
      "Preview Link: " + albumInfo.preview_url + "\r\n"+
      "Album: " + albumInfo.album.name + "\r\n";
    console.log(spotifyResults);
    logData(spotifyResults);
  })
}; 


//This function sends request to OMDB
function movieCall() 
{
  var omdbApi = 'http://www.omdbapi.com/?t=';
  var movie = params[1];
  var omdbParameters = '&y=&plot=short&r=json&tomatoes=true';
  var omdbUrl = omdbApi + movie + omdbParameters
  request(omdbUrl, function (error, response, body) 
  {
    if (!error && response.statusCode == 200) 
    {
      var movieResults = 
        "Title: " + JSON.parse(body)["Title"] + "\r\n" +
        "Year: " + JSON.parse(body)["Year"] + "\r\n" +
        "imdbRating: " + JSON.parse(body)["imdbRating"] + "\r\n" +
        "Country: " + JSON.parse(body)["Country"] + "\r\n" +
        "Language: " + JSON.parse(body)["Language"] + "\r\n" +
        "Plot: " + JSON.parse(body)["Plot"] + "\r\n" +
        "Actors: " + JSON.parse(body)["Actors"] + "\r\n" +
        "Rotten Tomatoes Rating: " + JSON.parse(body)["tomatoRating"] + "\r\n" +
        "Rotten Tomato URL: " + JSON.parse(body)["tomatoURL"] + "\r\n\r\n";
      console.log(movieResults);
      logData(movieResults);
    }
  })
}; 


//This function runs outputs spotify-this-song for the "I Want it That Way" song
function doCall() 
{
  fs.readFile("./random.txt", "utf8", function(error, data) 
  {
    if(error) 
    {
      console.log('An error occurred: ' + error);
      return;
    }
    data = data.split(',');
    spotifyCall(data[1]);
  })
}; 


//This function appends user's queries to Liri to the log.txt file
function logData(logEntry) 
{
  fs.appendFile("./log.txt", logEntry, (error) => {
    if(error) {
      throw error;
    }
  });
} 



