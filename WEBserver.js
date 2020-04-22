const express = require('express');
const app = express();
var socket = require('socket.io');
var _ = require('underscore');
const { MongoClient } = require("mongodb");

var favicon = require('serve-favicon');
var path = require('path');
app.use(favicon(path.join(__dirname,'public','images','favicon.ico')));

// Connect Database from MongoDB
const url = "mongodb+srv://englishDB:englishpassword@cluster0-5liml.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true } );

var server = app.listen(3000,() => console.log('listening at 3000'));
app.use(express.static(__dirname + '/public'));
app.use(express.json());
var io = socket(server)

app.get('/getDB', async (request, response) => {

  // with firebase
  usersdb.once("value", function(data, error){
    if (error){
      response.end();
      console.log('Error while performing Query.', err);
      return;
    }
    // var users = data.val();
    // // Grab the keys to iterate over the object
    // var keys = Object.keys(users);
    //
    // for (var i = 0; i < keys.length; i++) {
    //   var key = keys[i];
    //   // Look at each fruit object!
    //   var user = users[key];
    //   print('name '+user.name)
    //   print('pass '+user.password)
    // }
    response.json({data});
    console.log('The query result is: ', data);
  });

  // // with mysql
  // console.log('request parameters',request.params);
  // const sqlquery = request.params.sql;
  // db.query(sqlquery, function(err, rows) { //MAKE A QUERY
  //     if (err){
  //       response.end();
  //       console.log('Error while performing Query.', err);
  //       return;
  //     }
  //     response.json({rows});
  //     console.log('The query result is: ', rows);
  //
  // });
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

  try {
      await client.connect();
      console.log("Connected correctly to server");
      result = await client.db("englishDB").collection("users")
                          .findOne({ name:user, password:pass });

      if (result) {
          console.log('Found a username '+result);
          response.json({
            status:'succes'
          });
      } else {
          console.log('No usernames found');
          response.json({
            status:'wrong'
          });
      }

  } catch (err) {
      console.log(err.stack);
  }
  finally {
      await client.close();
  }
});
