// server.js
// where your node app starts

// init
// setup express for handling http requests
var express = require("express");
var util = require("util");
var shortid = require("shortid");
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('public')); // http://expressjs.com/en/starter/static-files.html
var connected=false;
app.listen(3000);
console.log('Listening on port 3000');
    
// setup nunjucks for templating in views/index.html
var nunjucks = require('nunjucks');
nunjucks.configure('views', { autoescape: true, express: app });

// setup our datastore
var datastore = require("./datastore").sync;
datastore.initializeApp(app);

// create routes
app.get("/", function (request, response) {
  try {
    initializeDatastoreOnProjectCreation();
    var posts = datastore.get("posts");
    response.render('index.html', {
      title: "Welcome!"
    });
  } catch (err) {
    console.log("Error: " + err);
    handleError(err, response);
  }
});

app.get("/new/*", function (request, response) {
  //Get the url parameter
  let urlParm = request.path.substring(5);
  if(urlParm.match(/^(ftp|http|https):\/\/[^ "]+$/)) {
    let urlShortId = shortid.generate();
    try {
      // We get the contents of the submitted form and append it to the posts array
      // We store the updated posts array back in our database posts entry
      datastore.set(urlParm, urlShortId);
      // And then we redirect to view the json object that was just added
      response.send(datastore.get(urlParm));
    } catch (err) {
      handleError(err, response);
    }
  }
  else {
    response.send("Invalid URL parameter");
  }
});

app.get("/*", function (request, response) {
  let short_url = request.path.substring(1);
  try {
    response.redirect(datastore.get(short_url).original_url);
  } catch (err) {
    handleError(err, response);
  }  
});

function handleError(err, response) {
  response.status(500);
  response.send(
    "<html><head><title>Internal Server Error!</title></head><body><pre>"
   // + JSON.stringify(err, null, 2) + "
    + util.inspect(err.message) + "</pre></body></pre>"
  );
}

// ------------------------
// DATASTORE INITIALIZATION

function initializeDatastoreOnProjectCreation() {
  if(!connected){
    connected = datastore.connect();
  }
}
