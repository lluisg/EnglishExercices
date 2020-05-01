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
var words = [], words_rnd = []; //where the words to guess will be saved
var actual_guess; //the word the person is tryong to draw
var drawing = new Array(); //where the positions of the drawings will be saved

function setup(){

  var wordsDB = getData().then(async(response) =>{
    for(let i=0; i<response.result.length; i++){
      words[i] = response.result[i].word;
    }
    words_rnd = shuffleList(words);

  });
  resetBlackboard();

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
  socket.on('pair_disconnect', pairDisconnected);
  socket.on('painted', addPointDrawing);
  socket.on('written', newText);
  socket.on('get_actual_guess', function(guess){
    actual_guess = guess;
    console.log('get actual guess', actual_guess);
  });

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
  restart.mousePressed( response => window.location.href='/9exercicePinturillo.html?unitEx='+unitEx);

}

function draw(){
  if(connected){
    resetBlackboard();
    fill(0);
    textAlign(CENTER);
    text(written, windowWidth/2, windowHeight*9/10);

    for(let i=0; i<drawing.length; i++){
      push();
      noStroke();
      fill(256);
      ellipse(drawing[i][0], drawing[i][1], 5, 5);
      pop();
    }
    if(turn == 0){
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

      pop();
      // push();
      // stroke(0);
      // noFill();
      // rect(windowWidth/10, windowHeight/10, windowWidth*8/10, windowHeight*7/10);
      //
      // fill(0);
      // textAlign(CENTER);
      // text(written, windowWidth/2, windowHeight*9/10);


    }
  }

  //
  //
  // if (correction=='incorrect'){
  //   console.log('incorrect text ' +timer);
  //   textSize(20);
  //   textAlign(LEFT);
  //   fill(220, 0, 0);
  //   text('  Incorrect', windowWidth*3/4, windowHeight/2 );
  //
  //   if(timer==0){
  //     correction='a';
  //     resetCanvas();
  //   }else if(frameCount % 60 == 0){
  //     timer--;
  //   }
  //
  // }else if (correction=='correct'){
  //   textSize(20);
  //   textAlign(LEFT);
  //   fill(0, 220, 0);
  //   text('  Correct', windowWidth*3/4, windowHeight/2 );
  //
  //   if(timer==0){
  //     correction='a';
  //     numberimg++;
  //     //actualitzar marcador
  //     if(numberimg<descriptions.length){
  //       changeImageActual();
  //     }else{
  //       win=true;
  //       img=loadImage('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwxS2VeYntXCWsjdaiQxNhCAofZhbrDv41Lb4NrdhR6G8Z-BMJ&s', resetCanvas);
  //     }
  //
  //     // img=loadImage('https://images.unsplash.com/photo-1511216113906-8f57bb83e776?ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80', resetCanvas);
  //   }else if(frameCount % 60 == 0){
  //     console.log(timer);
  //     timer--;
  //   }
  // }

}

function connectUsers(partner_id, t){
  restart.hide();
  console.log('CONNECT USERS');
  console.log(socket.id+' connecting to', partner_id);
  socket.emit('conn_partner', partner_id);
  if(t == 1){
    turn = 1; // you guess
    console.log('you write');
  }else{
    turn = 0; //you draw
    console.log('you draw');
    actual_guess = words_rnd[0];
    socket.emit('set_actual_guess', actual_guess);
    console.log('set actual guess', actual_guess);
  }
  connected = true;
}
function pairDisconnected(){
  connected=false;
  clear();
  push();
  textSize(20);
  textAlign(CENTER);
  fill(220, 10, 10);
  text('Your partner disconnected, click restart button to find a new partner', windowWidth/2, windowHeight/2);
  pop();
  restart.show();
}
function resetBlackboard(){
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
    socket.emit('paint', data)
  }
}
function addPointDrawing(data){
  drawing.push([data.x, data.y]);
}

function keyTyped(){
  //if you are guessing you can write
  if(turn == 1){
    written = written + str(key).toUpperCase();
    sendText();
  }
}
function keyPressed() {
  if (keyCode === BACKSPACE && turn == 1) {
    written = written.slice(0, -1);
    sendText();
  }
}
function sendText(){
  var data = {
    text:written,
  }
  socket.emit('write', data);
}
function newText(data){
  written = data.text;
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
