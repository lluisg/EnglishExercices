//To get the unit which we are gona do the exercise
var queryString = decodeURIComponent(window.location.search);
queryString = queryString.substring(1);
var params = queryString.split("=")[1];
var unitEx = params.split("&")[0]
var user_name = params.split("&")[1]
console.log('Unit: '+ unitEx +' and Username: '+ user_name);


//web in: http://shtooka.net/overview.php?lang=eng
// https://fsi-languages.yojik.eu/audiocollections/audiocollections.html

var words = [], phrases = [], references=[];
let audios = [];

var button = []; //button play
var inputs = []; //inputs
var inputvalue = []; //value of the inputs
var phrases_dinamic = []; //where the changing part of the phrases will go
var correct = false;

var timer=0;
var correct = [], allcorrect=false;
var MAX_LENGTH = 7;
async function setup(){

  var auxGroup = getData().then(async(response) =>{
   for(let i=0; i<(response.result.length || MAX_LENGTH); i++){
     words[i] = response.result[i].word;
     phrases[i] = response.result[i].phrase;
     references[i] = response.result[i].directory;
   }

   await definePlayInputButtons();
   for(let i=0; i<words.length; i++){
     audios[i] = loadSound(references[i]);
   }

   correct = new Array(words.length).fill(false);
   resetCanvas();
  });

  loginOut();

  check=createButton('Check');
  check.position(windowWidth*(3/4+1/12),windowHeight*(4/5));
  check.size(80,windowHeight/20);
  check.mousePressed(checking);

  ret=createButton('Return');
  ret.position(windowWidth*(3/4+1/12),windowHeight*(4/5+1/12));
  ret.size(80,windowHeight/20);
  ret.mousePressed( response => window.location.href='/exercices.html?user='+ user_name);

  restart=createButton('Restart');
  restart.position(windowWidth*(3/4+1/12),windowHeight*(4/5));
  restart.size(80,windowHeight/20);
  restart.style("background-color", "red")
  restart.hide();
  restart.mousePressed( response => window.location.href='/3exerciceAudio.html?unitEx='+unitEx +'&'+ user_name);
}

function draw(){
  resetCanvas();

  for(let i=0; i<phrases.length; i++){
    if(inputs[i].value()==''){
    // if(inputs[i] == undefined){
      inputvalue[i] = '??';
    }else{
      inputvalue[i] = inputs[i].value();
    }
    phrases_dinamic[i] = phrases[i].replace("XX", inputvalue[i]);

    push();
    textSize(20);
    textAlign(LEFT, TOP);
    if (allcorrect==false && correct[i]==false){
      fill(200,0,0);
    }else if (allcorrect) {
      fill(0,125,0);
    }else{
      fill(0);
    }
    text(phrases_dinamic[i], windowWidth/6, windowHeight/5+i*4*windowHeight/(5*words.length));
    pop();
  }

  if(timer==0){
    for(let i=0; i<audios.length;i++){
      correct[i]='a';
    }
  }else if(frameCount % 60 == 0){
    timer--;
  }

  if(allcorrect==true){ //print text indefinitely if it checked correct
    push();
    colorMode(HSL);
    fill(120, 60, 60);
    stroke(0);
    textSize(30);
    textAlign(CENTER, CENTER);
    text('You have filled all the gaps correctly', windowWidth/18+(5*windowWidth/7/2), windowHeight*0.8+(windowHeight*0.15/2));
    pop();
  }
}


function resetCanvas(){
  clear();
  createCanvas(windowWidth,windowHeight);
  background(220);

  textSize(28);
  textAlign(CENTER, CENTER);
  text('Listen the audios and fill the gaps', windowWidth/2, windowHeight/20);
}

function definePlayInputButtons(){
  console.log(words);
  for(let i=0; i<words.length;i++){
    button[i]=createImg('images/play.png');
    button[i].position(3.5*windowWidth/5, windowHeight/5+i*4*windowHeight/(5*words.length));
    button[i].size(windowWidth/20,windowHeight/20);
    button[i].mouseClicked(() => {
      playAudio(i)
    });
  }
  for(let i=0; i<words.length;i++){
    inputs[i]=createInput('');
    inputs[i].position(3.5*windowWidth/5-windowWidth/6, windowHeight/5+i*4*windowHeight/(5*words.length));
    inputs[i].size(windowWidth/7,windowHeight/25);
  }
}

function playAudio(track){
  console.log('entered playing');
  audios[track].play();

}

function checking(){
  var howmany=0;
  for(i=0; i<words.length; i++){
    console.log(inputvalue[i]+' - '+words[i]);
    if (inputvalue[i]==words[i]) {
      correct[i]=true;
      howmany++;
    }else {
      correct[i]=false;
    }
  }
  if(howmany==words.length){
    allcorrect=true;
    check.hide();
    restart.show();
  }else{
    allcorrect=false;
    timer=2;
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

async function getData(){
  exercice = 'sounds'
  const response = await fetch('getDB/'+ exercice +'&'+ unitEx);
  const json = await response.json();
  console.log('DB received: '+ json)
  console.log(json);
  return json;
}
