const fs = require('fs');
const express = require('express');
require('dotenv').config()
const { MongoClient } = require("mongodb");

// Replace the following with your Atlas connection string

const CONNECTION_URL = process.env.CONNECTION_URL;
const client = new MongoClient(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true } );

async function run() {
  try {
       await client.connect();
       console.log("Connected correctly to server");

       const db = client.db("englishDB"); //database
       var rawdata, elements;

       // UPDATE USERNAME PASSWORDS --------------------------------------------
       const col0 = db.collection("users"); //table
       col0.drop()
       // read the info from the json file
       rawdata = fs.readFileSync('jsons_DB/usernamesDB.json');
       elements = JSON.parse(rawdata);
       for(let i=0; i<elements.length;i++){
         // Insert a single document, wait for promise so we can read it back
         await col0.insertOne(elements[i]);
       }

       // UPDATE CROSSWORD -----------------------------------------------------
       const col1 = db.collection("crossword"); //table
       col1.drop()
       // read the info from the json file
       rawdata = fs.readFileSync('jsons_DB/crosswordDB.json');
       elements = JSON.parse(rawdata);
       for(let i=0; i<elements.length;i++){
         // Insert a single document, wait for promise so we can read it back
         await col1.insertOne(elements[i]);
       }

       // UPDATE CROSSWORD GRID ------------------------------------------------
       const col11 = db.collection("crosswordgrid"); //table
       col11.drop()
       // read the info from the json file
       rawdata = fs.readFileSync('jsons_DB/crosswordgridDB.json');
       elements = JSON.parse(rawdata);
       for(let i=0; i<elements.length;i++){
         // Insert a single document, wait for promise so we can read it back
         await col11.insertOne(elements[i]);
       }

       // UPDATE SEARCH PUZZLE -------------------------------------------------
       const col2 = db.collection("search_puzzle"); //table
       col2.drop()
       // read the info from the json file
       rawdata = fs.readFileSync('jsons_DB/searchpuzzleDB.json');
       elements = JSON.parse(rawdata);
       for(let i=0; i<elements.length;i++){
         // Insert a single document, wait for promise so we can read it back
         await col2.insertOne(elements[i]);
       }

       // UPDATE IMAGES --------------------------------------------------------
       const col3 = db.collection("images"); //table
       col3.drop()
       // read the info from the json file
       rawdata = fs.readFileSync('jsons_DB/imagesDB.json');
       elements = JSON.parse(rawdata);
       for(let i=0; i<elements.length;i++){
         // Insert a single document, wait for promise so we can read it back
         await col3.insertOne(elements[i]);
       }

       // UPDATE TEXT LINE -----------------------------------------------------
       const col4 = db.collection("text_line"); //table
       col4.drop()
       // read the info from the json file
       rawdata = fs.readFileSync('jsons_DB/textlineDB.json');
       elements = JSON.parse(rawdata);
       for(let i=0; i<elements.length;i++){
         // Insert a single document, wait for promise so we can read it back
         await col4.insertOne(elements[i]);
       }

       // UPDATE HANGMAN --------------------------------------------------------
       const col5 = db.collection("hangman"); //table
       col5.drop()
       // read the info from the json file
       rawdata = fs.readFileSync('jsons_DB/hangmanDB.json');
       elements = JSON.parse(rawdata);
       for(let i=0; i<elements.length;i++){
         // Insert a single document, wait for promise so we can read it back
         await col5.insertOne(elements[i]);
       }

       // UPDATE MULTIPLE CHOICE -----------------------------------------------
       const col6 = db.collection("multiple_choice"); //table
       col6.drop()
       // read the info from the json file
       rawdata = fs.readFileSync('jsons_DB/multiplechoiceDB.json');
       elements = JSON.parse(rawdata);
       for(let i=0; i<elements.length;i++){
         // Insert a single document, wait for promise so we can read it back
         await col6.insertOne(elements[i]);
       }

       // UPDATE MULTIPLE CHOICE TEXT ------------------------------------------
       const col7 = db.collection("multiple_choice_text"); //table
       col7.drop()
       // read the info from the json file
       rawdata = fs.readFileSync('jsons_DB/multiplechoicetextDB.json');
       elements = JSON.parse(rawdata);
       for(let i=0; i<elements.length;i++){
         // Insert a single document, wait for promise so we can read it back
         await col7.insertOne(elements[i]);
       }

       // UPDATE GROUPING --------------------------------------------------------
       const col8 = db.collection("grouping"); //table
       col8.drop()
       // read the info from the json file
       rawdata = fs.readFileSync('jsons_DB/groupingDB.json');
       elements = JSON.parse(rawdata);
       for(let i=0; i<elements.length;i++){
         // Insert a single document, wait for promise so we can read it back
         await col8.insertOne(elements[i]);
       }

       // UPDATE SOUNDS --------------------------------------------------------
       const col9 = db.collection("sounds"); //table
       col9.drop()
       // read the info from the json file
       rawdata = fs.readFileSync('jsons_DB/soundsDB.json');
       elements = JSON.parse(rawdata);
       for(let i=0; i<elements.length;i++){
         // Insert a single document, wait for promise so we can read it back
         await col9.insertOne(elements[i]);
       }

       // UPDATE PICTIONARY ----------------------------------------------------
       const col10 = db.collection("pictionary"); //table
       col10.drop()
       // read the info from the json file
       rawdata = fs.readFileSync('jsons_DB/pictionaryDB.json');
       elements = JSON.parse(rawdata);
       for(let i=0; i<elements.length;i++){
         // Insert a single document, wait for promise so we can read it back
         await col10.insertOne(elements[i]);
       }


   } catch (err) {
       console.log(err.stack);
   } finally {
     console.log('Everything done')
      await client.close();
  }
}

run().catch(console.dir);
