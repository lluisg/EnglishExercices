//To get the unit which we are gona do the exercise
var queryString = decodeURIComponent(window.location.search);
queryString = queryString.substring(1);
var params = queryString.split("=")[1];
var unitEx = params.split("&")[0]
var user_name = params.split("&")[1]
console.log('Unit: '+ unitEx +' and Username: '+ user_name);


var descriptions = [[]];

var img, numberimg=0; //image abd number images correctly
var desc, check, but, restart; //buttons
var correction; //hide after 2 seconds message correct/incorrect
var numberWordsWS=10; //number of words to guess
var win=false; //once winned hide the buttons and input

function setup(){
  console.log('setup');
  //collect words from database
  var namesDB = getData().then(response =>{
    for(let i =0;i<numberWordsWS;i++){
      descriptions[i] = [response.result[i].word, response.result[i].URL];
    }
    descriptions = shuffleArray(descriptions); // shuffle it so not everytime get the same order
    console.log(descriptions);
    createCanvas(windowWidth,windowHeight);
    changeImageActual();
  });

  // createCanvas(windowWidth,windowHeight);
  // setTimeout(changeImageActual,5000);
  // setTimeout(resetCanvas,1500);
  loginOut();

  desc = createInput('','text');
  desc.position(windowWidth/2-windowWidth/8,windowHeight*3/4+windowHeight/12);
  desc.size(windowWidth/4, windowHeight/20);

  check=createButton('Check');
  check.position(windowWidth*(1/2+1/8+1/12),windowHeight*(3/4+1/12));
  check.size(80,windowHeight/20);
  check.mousePressed(checkInput);

  but=createButton('Return');
  but.position(windowWidth*(1/2+1/8+1/12),windowHeight*(3/4+2/12));
  but.size(80,windowHeight/20);
  but.mousePressed( response => window.location.href='/exercices.html?user='+ user_name);

  restart=createButton('Restart');
  restart.position(windowWidth*(1/2+1/8+1/12),windowHeight*(3/4+1/12));
  restart.size(80,windowHeight/20);
  restart.style("background-color", "red")
  restart.hide();
  restart.mousePressed( response => window.location.href='/4exerciceImageD.html?unitEx='+unitEx);
}

function draw(){

  if (correction=='incorrect'){
    console.log('incorrect text ' +timer);
    textSize(20);
    textAlign(LEFT);
    fill(220, 0, 0);
    text('  Incorrect', windowWidth*3/4, windowHeight/2 );

    if(timer==0){
      correction='a';
      resetCanvas();
    }else if(frameCount % 60 == 0){
      timer--;
    }

  }else if (correction=='correct'){
    textSize(20);
    textAlign(LEFT);
    fill(0, 220, 0);
    text('  Correct', windowWidth*3/4, windowHeight/2 );

    if(timer==0){
      correction='a';
      numberimg++;
      //actualitzar marcador
      if(numberimg<descriptions.length){
        changeImageActual();
      }else{
        win=true;
        img=loadImage('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwxS2VeYntXCWsjdaiQxNhCAofZhbrDv41Lb4NrdhR6G8Z-BMJ&s', resetCanvas);
      }

      // img=loadImage('https://images.unsplash.com/photo-1511216113906-8f57bb83e776?ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80', resetCanvas);
    }else if(frameCount % 60 == 0){
      console.log(timer);
      timer--;
    }
  }
}

function keyPressed() {
  if (keyCode === ENTER) {
    checkInput();
  }
}

function changeImageActual(){
  console.log(descriptions[numberimg][1]);
  img=loadImage(descriptions[numberimg][1], resetCanvas);
  desc.value('');
}

function resetCanvas(){
  clear();
  background(220);
  textSize(20);
  textAlign(CENTER);
  fill(0);
  textStyle(NORMAL);
  text('What is this? (1 word only)', windowWidth/2, 100);
  textStyle(BOLD);
  text(numberimg+' / '+descriptions.length, windowWidth*(1-1/5), windowHeight/2-windowHeight/4);
  image(img, windowWidth/2-windowWidth/4, windowHeight/2-windowHeight/4, windowWidth/2, windowHeight/2 );
  if(win){
    win=false;
    check.hide();
    desc.hide();
    restart.show();
  }
}

function checkInput(){
  var inp = desc.value();
  if(inp==descriptions[numberimg][0]){
    timer=1;
    correction='correct';
  }else{
    console.log('incorrect check');
    timer=2;
    correction='incorrect';
  }
}

function loginOut(){
  logOut=createImg('images/logout.png');
  logOut.size(25,25);
  logOut.position(windowWidth-40,25);
  logOut.mousePressed(response => {
    window.location.href='/index.html';
	});
}

function shuffleArray(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

async function getData(){
  exercice = 'images'
  const response = await fetch('getDB/'+ exercice +'&'+ unitEx);
  const json = await response.json();
  console.log('DB received: '+ json)
  return json;
}
