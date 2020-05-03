//To get the unit which we are gona do the exercise
var queryString = decodeURIComponent(window.location.search);
queryString = queryString.substring(1);
var params = queryString.split("=")[1];
var unitEx = params.split("&")[0]
var user_name = params.split("&")[1]
console.log('Unit: '+ unitEx +' and Username: '+ user_name);

var socket;
var connected = false; //if there's a pair connection or not
var turn = 1; //indicates which turn is, 1 turn to guess, 0 turn to draw
var written = ''; //where the text written is saved
var correct_word=false, timer=0; //if the word written is correct
var words = [], words_rnd = []; //where the words to guess will be saved
var actual_guess; //the word the person is tryong to draw
var drawing = new Array(); //where the positions of the drawings will be saved
var rival_name = '';
var completed = false; //all words have been done
var number_correct_words = 0, total_words; //follow the number of correct guesses

function setup(){

  var wordsDB = getData().then(async(response) =>{
    for(let i=0; i<response.result.length; i++){
      words[i] = response.result[i].word.toUpperCase();
    }
    total_words = words.length;
    words_rnd = shuffleList(words);

  });
  resetAllCanvas();

  socket = io.connect('http://localhost:3000');
  console.log('Im socket')
  console.log(socket);
  push();
  textAlign(CENTER);
  textSize(30);
  fill(0,100,200);
  text('Waiting for a partner', windowWidth/2, windowHeight/2);
  pop();

  socket.on('paired', connectUsers);
  socket.on('named_rival', function(data){
    rival_name = data;
    console.log('rival = ', rival_name);
  });
  socket.on('pair_disconnect', pairDisconnected);
  socket.on('painted', addPointDrawing);
  socket.on('written', newText);
  socket.on('get_actual_guess', function(guess){
    actual_guess = guess;
    console.log('get actual guess', actual_guess);
  });
  socket.on('cleanedBlackboard', resetBlackboard);
  socket.on('get_words_completed', function(){
    completed = true;
    console.log('get words completed', completed);
  });
  socket.on('passed_next_word', nextWord);

  loginOut();

  but=createButton('Return');
  but.position(windowWidth*8/10,windowHeight*(3/4+2/12));
  but.size(80,windowHeight/20);
  but.mousePressed( response => window.location.href='/exercices.html?user='+ user_name);

  restart=createButton('Restart');
  restart.position(windowWidth*8/10,windowHeight*(3/4+1/12));
  restart.size(80,windowHeight/20);
  restart.style("background-color", "red")
  restart.hide();
  restart.mousePressed( response => window.location.href='/9exercicePinturillo.html?unitEx='+unitEx +'&'+ user_name);

  buttonCleanBlackboard=createButton('Clean');
  buttonCleanBlackboard.position(windowWidth*17/20,windowHeight*5/40);
  buttonCleanBlackboard.size(windowWidth/20, windowHeight/20);
  buttonCleanBlackboard.style("background-color", "white")
  buttonCleanBlackboard.hide();
  buttonCleanBlackboard.mousePressed(resetBlackboard);

  buttonNextWord=createButton('Next Word');
  buttonNextWord.position(windowWidth*17/20,windowHeight*15/20);
  buttonNextWord.size(windowWidth/20, windowHeight/20);
  buttonNextWord.style("background-color", "red")
  buttonNextWord.hide();
  buttonNextWord.mousePressed(passNextWord);

}

function draw(){
  if(connected){
    push();
    resetAllCanvas();
    fill(0);
    textSize(25)
    textStyle(BOLD)
    textAlign(CENTER);
    text(written, windowWidth/2, windowHeight*9/10);
    pop();

    for(let i=0; i<drawing.length; i++){
      push();
      noStroke();
      fill(256);
      ellipse(drawing[i][0], drawing[i][1], 5, 5);
      pop();
    }
    if(turn == 0){
      // if you draw, you will have the word to draw on the upper left
      push();
      w = textWidth(actual_guess) + windowWidth/20;
      h = windowHeight*0.8/10;
      strokeWeight(3);
      fill(220);
      rect(windowWidth/10, windowHeight/10, w, h);

      textSize(20);
      textStyle(BOLD);
      textAlign(CENTER, CENTER);
      fill(0);
      text(actual_guess, windowWidth/10 + w/2, windowHeight/10 + h/2);

      if(rival_name.length > 0){
        // your name on blackboard
        textSize(20);
        textStyle(BOLD);
        textAlign(CENTER, CENTER);
        fill(0);
        text(user_name.toUpperCase() +':', windowWidth/20, windowHeight*3/20);
        // rival name on line text
        textSize(20);
        textStyle(BOLD);
        textAlign(RIGHT, BASELINE);
        fill(0);
        text(rival_name.toUpperCase() +':', windowWidth*(1/4-1/20), windowHeight*9/10);
      }
      pop();

    }else if(turn == 1){
      if(rival_name.length > 0){
        push();
        // rival name on blackboard
        textSize(20);
        textStyle(BOLD);
        textAlign(CENTER, CENTER);
        fill(0);
        text(rival_name.toUpperCase() +':', windowWidth/20, windowHeight*3/20);
        // your name on line text
        textSize(20);
        textStyle(BOLD);
        textAlign(RIGHT, BASELINE);
        fill(0);
        text(user_name.toUpperCase() +':', windowWidth*(1/4-1/20), windowHeight*9/10);
        pop();
      }
    }

    if(correct_word){
      //if you have the word right you will wait for 3 seconds
      // when you can't write
      push();
      translate(windowWidth*7/10, windowHeight*7/10);
      angleMode(DEGREES);
      rotate(-45);
      fill(256);
      rect(-windowWidth*3/10, -windowHeight*0.5/10, windowWidth*6/10, windowHeight*1/10);

      textSize(40);
      textAlign(CENTER, CENTER);
      fill(0, 220, 0);
      text('CORRECT',0,0);
      pop();

      w = textWidth(actual_guess) + windowWidth/20;
      h = windowHeight*0.8/10;
      strokeWeight(3);
      fill(0);
      rect(windowWidth/10, windowHeight/10, w, h);

      if(timer==0){
        correct_word=false;
        written='';
        if(turn == 0){ //if you were drawing, you will next write
          resetBlackboard(); //clean the blackboard for the next drawing
          buttonCleanBlackboard.hide();
          buttonNextWord.hide();
          words_rnd.splice(0, 1);
          turn = 1;
        }else if(turn == 1){ //if you were writing, you will draw next
          buttonCleanBlackboard.show();
          buttonNextWord.show();
          const index = words_rnd.indexOf(actual_guess); //remove the element we were guessing
          if (index > -1) {
            words_rnd.splice(index, 1);
          }
          if(words_rnd.length > 0){
            actual_guess = words_rnd[0];
            socket.emit('set_actual_guess', actual_guess);
            console.log('set actual guess', actual_guess);
          }else{ //if all words have been done
            w = textWidth(actual_guess) + windowWidth/20;
            h = windowHeight*0.8/10;
            strokeWeight(3);
            fill(0);
            rect(windowWidth/10, windowHeight/10, w, h);
            buttonCleanBlackboard.hide();
            buttonNextWord.hide();

            socket.emit('set_words_completed')
            completed = true;
          }
          turn = 0;
        }

      }else if(frameCount % 60 == 0){
        console.log('timer: ', timer);
        timer--;
      }
    }

    if(completed){
      //draw completed text and count correct words
      push();
      textSize(50);
      textStyle(BOLD);
      textAlign(CENTER, CENTER);
      if(number_correct_words == total_words){ //if guessed all right
        fill(0, 220, 0);
      }else if(number_correct_words > total_words/2){ //if guessed half or more right
        fill(0, 0, 220);
      }else{ //if guessed right less than a half
        fill(220, 0, 0);
      }
      text('COMPLETED', windowWidth/2, windowHeight/2);
      pop();
    }

  }
}



function connectUsers(partner_id, t){
  restart.hide();
  console.log('CONNECT USERS');
  console.log(socket.id+' connecting to', partner_id);
  socket.emit('conn_partner', partner_id);
  socket.emit('name_rival', user_name);
  if(t == 1){
    turn = 1; // you guess
    console.log('you write');
  }else{
    turn = 0; //you draw
    console.log('you draw');
    actual_guess = words_rnd[0];
    socket.emit('set_actual_guess', actual_guess);
    console.log('set actual guess', actual_guess);
    buttonCleanBlackboard.show();
    buttonNextWord.show();
  }
  connected = true;
}
function pairDisconnected(){
  connected=false;
  rival_name = '';
  buttonCleanBlackboard.hide();
  buttonNextWord.hide();
  clear();
  push();
  textSize(20);
  textAlign(CENTER);
  fill(220, 10, 10);
  text('Your partner disconnected, click restart button to find a new partner', windowWidth/2, windowHeight/2);
  pop();
  restart.show();
}
function resetAllCanvas(){
  // will reset the canvas but not the values of drawing and text
  clear();
  createCanvas(windowWidth, windowHeight);
  background(220);

  push();
  stroke(0);
  fill(20);
  rect(windowWidth/10, windowHeight/10, windowWidth*8/10, windowHeight*7/10);
  fill(0);
  strokeWeight(2);
  line(windowWidth/4, windowHeight*9/10, windowWidth*3/4, windowHeight*9/10);
  pop();
}

function mouseDragged(){
  if(turn == 0){
    drawing.push([mouseX, mouseY]);

    var data = {
      x:mouseX,
      y:mouseY,
    }
    socket.emit('paint', data);
  }
}
function addPointDrawing(data){
  drawing.push([data.x, data.y]);
}

function resetBlackboard(){
  // will reset the blackboard and the value of the drawing
  drawing = new Array();
  console.log('blackboard cleaned');
  if(turn == 0){
    // if you are drawing, will warn the writer that you cleaned the blackboard
    socket.emit('cleanBlackboard');
    console.log('send clean Blackboard');
  }
  resetAllCanvas();
}



function keyTyped(){
  //if you are guessing you can write, unless you already guessed right
  if(turn == 1 && correct_word == false){
    written = written + str(key).toUpperCase();
    sendText();
  }
}
function keyPressed() {
  if (keyCode === BACKSPACE && turn == 1 && correct_word == false) {
    written = written.slice(0, -1);
    sendText();
  }
}
function sendText(){
  if( written == actual_guess){
    nextWord(true);
  }
  var data = {
    text:written,
  }
  socket.emit('write', data);
}
function newText(data){
  if(correct_word == false){
    written = data.text;

    if(written == actual_guess){
      nextWord(true);
    }
  }
}
function nextWord(guessed_right){
  if(guessed_right == true){
    number_correct_words += 1;
    console.log(number_correct_words +'correct words guessed');
  }
  correct_word = true;
  timer = 3;
}
function passNextWord(){
  console.log('NEXT WORRD IMPLEMENTEEED');
  socket.emit('pass_next_word');
  nextWord(false);
}



function shuffleList(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function loginOut(){
  logOut=createImg('images/logout.png');
  logOut.size(25,25);
  logOut.position(windowWidth-40,25);
  logOut.mousePressed(response => {
    window.location.href='/index.html';
	});
}

async function getData(){
  exercice = 'pinturillo'
  const response = await fetch('getDB/'+ exercice +'&'+ unitEx);
  const json = await response.json();
  console.log('DB received: '+ json)
  return json;
}
