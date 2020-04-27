const Express = require("express");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

var app = Express();

app.use(Express.static(__dirname + '/public'));
app.use(Express.json());

var favicon = require('serve-favicon');
var path = require('path');
app.use(favicon(path.join(__dirname,'public','images','favicon.ico')));


const CONNECTION_URL = "mongodb+srv://englishDB:englishpassword@cluster0-5liml.mongodb.net/test?retryWrites=true&w=majority";
const DATABASE_NAME = "englishDB";

// CONNECT MONGODB DATABASE
var server = app.listen(3000, () => {
    console.log('listening at 3000')
    MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(DATABASE_NAME);
        console.log("Connected to `" + DATABASE_NAME + "`!");
    });
});

var socket = require('socket.io');
var _ = require('underscore');
var io = socket(server)





app.get("/getDB/:unit", (request, response) => {
  /*
  pass the unit and exercice
  returns the complete database (if necessary sorted or others)
  */
  console.log('request parameters',request.params);
  const ex = request.params.unit.split('&')[0];
  const unit = parseInt(request.params.unit.split('&')[1]);

  if(ex=='crossword'){
      db.collection(ex).find({ unit:unit }).project({ unit:0, _id:0})
                                .sort({ crossword_position:1 }).toArray((error, result) => {
        if(error) {
          console.log('errroooooorr croswword DBBB')
          return response.status(500).send(error);
        }
        console.log('The query result is: ', result);
        response.json({result});
      });
  }else{
      db.collection(ex).find({ unit:unit }).project({ unit:0, _id:0})
                                .toArray((error, result) => {
        if(error) {
          console.log('errroooooorr DBBB')
          return response.status(500).send(error);
        }
        console.log('The query result is: ', result);
        response.json({result});
      });
  }
});

app.post('/checkUsr', async (request, response) => {
  /*
  pass the [username, password]
  returns if the user is in the database or not
  */
  console.log('I got a request!');
  console.log(request.body.user);
  user = request.body.user.username
  pass = request.body.user.password

  db.collection("users").findOne({ name:user, password:pass }, (error, result) => {
          if(error) {
              console.log('errooooooor users')
              return response.status(500).send(error);
          }

          if (result) {
            console.log('Found a username');
            console.log(result)
            response.json({
              status:'succes'
            });
          } else {
            console.log('No usernames found');
            response.json({
              status:'wrong'
            });
          }
      });
});
