//To get the unit which we are gona do the exercise
var queryString = decodeURIComponent(window.location.search);
queryString = queryString.substring(1);
var unitEx = queryString.split("=")[1];
console.log('Unit: '+unitEx);

var socket;
var connected = false; //if there's a pair connection or not
var turn = 1; //indicates which turn is, 1 turn to guess, 0 turn to draw
var written = ''; //where the text written is saved
var words = [], words_rnd = []; //where the words to guess will be saved
var actual_guess; //the word the person is tryong to draw

function setup(){

  var wordsDB = getData().then(async(response) =>{
    for(let i=0; i<response.result.length; i++){
      words[i] = response.result[i].word;
    }
    words_rnd = shuffleList(words);

  });
  createCanvas(windowWidth, windowHeight);
  background(220);


  socket = io.connect('http://localhost:3000');
  console.log('Im socket')
  console.log(socket);
  textAlign(CENTER);
  textSize(30);
  text('Waiting for a partner', windowWidth/2, windowHeight/2);

  socket.on('paired', connectUsers);
  socket.on('painted', newDrawing);
  socket.on('pair_disconnect', pairDisconnected);
  socket.on('written', newText);
  socket.on('get_actual_guess', function(guess){
    actual_guess = guess;
    console.log('get actual guess', actual_guess);
  });

  loginOut();

  but=createButton('Return');
  but.position(windowWidth*8/10,windowHeight*(3/4+2/12));
  but.size(80,windowHeight/20);
  but.mousePressed( response => window.location.href='/exercices.html');

  restart=createButton('Restart');
  restart.position(windowWidth*8/10,windowHeight*(3/4+1/12));
  restart.size(80,windowHeight/20);
  restart.style("background-color", "red")
  restart.hide();
  restart.mousePressed( response => window.location.href='/9exercicePinturillo.html?unitEx='+unitEx);

}

function draw(){
}

function connectUsers(partner_id, t){
  restart.hide();
  console.log('CONNECT USERS');
  console.log(socket.id+' connecting to', partner_id);
  socket.emit('conn_partner', partner_id);
  if(t == 1){
    turn = 1; // you guess
  }else{
    turn = 0; //you draw
    actual_guess = words_rnd[0];
    socket.emit('set_actual_guess', actual_guess);
    console.log('set actual guess', actual_guess);
  }
  connected = true;
  drawBlackboard();
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

function drawBlackboard(){
  //prepare the blackboard
  clear();
  createCanvas(windowWidth, windowHeight);
  background(220);
  push();
  stroke(50);
  fill(250);
  rect(windowWidth/10, windowHeight/10, windowWidth*8/10, windowHeight*7/10);
  pop();
  push();
  strokeWeight(2);
  line(windowWidth/4, windowHeight*9/10, windowWidth*3/4, windowHeight*9/10);
  pop();
}

function mouseDragged(){
  if(turn == 0){
    push();
    noStroke();
    fill(20);
    ellipse(mouseX, mouseY, 5, 5);
    pop();

    var data = {
      x:mouseX,
      y:mouseY,
    }
    socket.emit('paint', data)
  }
}
function newDrawing(data){
  push();
  noStroke();
  fill(20);
  ellipse(data.x, data.y, 5, 5);
  pop();
}

function keyTyped(){
  //if you are guessing you can write
  if(turn == 1){
    written = written + str(key).toUpperCase();
    write_text();
  }
}
function keyPressed() {
  if (keyCode === BACKSPACE && turn == 1) {
    written = written.slice(0, -1);
    write_text();
  }
}
function write_text(){
  push();
  strokeWeight(0)
  fill(220);
  rect(windowWidth/10, windowHeight*8/10, windowWidth*7/10, windowHeight*2/10);
  pop();
  push();
  fill(0);
  textAlign(CENTER);
  text(written, windowWidth/2, windowHeight*9/10);
  strokeWeight(2);
  line(windowWidth/4, windowHeight*9/10, windowWidth*3/4, windowHeight*9/10);
  pop();

  if(turn == 1){
    var data = {
      text:written,
    }
    socket.emit('write', guess)
  }
}
function newText(data){
  written = data.text;
  write_text();
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
