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


app.get('/getDB/:unit', async (request, response) => {
  console.log('request parameters',request.params);
  const ex = request.params.unit.split('&')[0];
  const unit = parseInt(request.params.unit.split('&')[1]);

  try {
      await client.connect();
      console.log("Connected correctly to server");

      if(ex=='crossword'){
          result = await client.db("englishDB").collection(ex)
                            .find({ unit:unit }).project({ unit:0, _id:0})
                            .sort({ crossword_position:1 }).toArray();
      }else{
          result = await client.db("englishDB").collection(ex)
                            .find({ unit:unit }).project({ unit:0, _id:0 }).toArray();
      }

      response.json({result})

  } catch (err) {
      console.log('Error while performing Query.', err);
  } finally {
      console.log('The query result is: ', result);
      await client.close();
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

  try {
      await client.connect();
      console.log("Connected correctly to server");
      result = await client.db("englishDB").collection("users")
                          .findOne({ name:user, password:pass });

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

  } catch (err) {
      console.log('check errooooor'+err.stack);
  }
  finally {
      await client.close();
  }
});
