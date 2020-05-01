//To get the unit which we are gona do the exercise
var queryString = decodeURIComponent(window.location.search);
queryString = queryString.substring(1);
var params = queryString.split("=")[1];
var unitEx = params.split("&")[0]
var user_name = params.split("&")[1]
console.log('Unit: '+ unitEx +' and Username: '+ user_name);


// var descriptions = [[]];
var images_keys = [], names_keys = [], correct = [], imageloaded = [];
var images = {}, names = {};
// names = {
//   1 : 'dog',
//   2 : 'cat',
//   3 : 'frog',
//   4 : 'mouse'
// };
// names_keys = [1,2,3,4];
// images = {
//   1 : 'https://image.cnbcfm.com/api/v1/image/105992231-1561667465295gettyimages-521697453.jpeg?v=1561667497&w=678&h=381',
//   2 : 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
//   3 : 'https://images.unsplash.com/photo-1550853123-b81beb0b1449?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
//   4 : 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
// };
// images_keys = [1,2,3,4];

var check, but, restart; //buttons
var allcorrect=false, timer=0; //hide after 2 seconds message correct/incorrect

var overButton_text=[], overButton_image=[]; //indicators if the mouse is over the circles
var locked;
var connections={}; //diccionary with connections made
var numberwords, h_diff; //variables for number of elements and the distances between buttons

function setup(){
  console.log('setup');
  //collect words from database
  var namesDB = getData().then(async(response) =>{
    print(response)
    for(let i=0; i<response.result.length; i++){
      names[i+1] = response.result[i].word;
      names_keys[i] = i+1;
      images[i+1] = response.result[i].URL;
      images_keys[i] = i+1;
    }

    createCanvas(windowWidth,windowHeight);
    console.log('names: ');
    console.log(names);
    console.log('images: ');
    console.log(images);

    //define all texts images and buttons
    numberwords=names_keys.length;
    h_diff=windowHeight*18/(20*numberwords);
    locked = new Array(numberwords);
    locked.fill(false);
    overButton_text = new Array(numberwords);
    overButton_text.fill(false);
    overButton_image = new Array(numberwords);
    overButton_image.fill(false);

    //randomize positions
    names_rnd = shuffleList(names_keys);
    images_rnd = shuffleList(images_keys);

    // setTimeout(changeImageActual,1000);
    loadImages();
    resetCanvas();
    console.log('written');
    console.log(names_rnd);
    console.log(images_rnd);

  });

  loginOut();

  check=createButton('Check');
  check.position(windowWidth*(5/6+1/12-1/24),windowHeight*(3/4+1/12));
  check.size(80,windowHeight/20);
  check.mousePressed(checking);

  but=createButton('Return');
  but.position(windowWidth*(5/6+1/12-1/24),windowHeight*(3/4+2/12));
  but.size(80,windowHeight/20);
  but.mousePressed( response => window.location.href='/exercices.html?user='+ user_name);

  restart=createButton('Restart');
  restart.position(windowWidth*(5/6+1/12-1/24),windowHeight*(3/4+1/12));
  restart.size(80,windowHeight/20);
  restart.style("background-color", "red")
  restart.hide();
  restart.mousePressed( response => window.location.href='/7exerciceTextLineImage.html?unitEx='+unitEx);

}

function draw(){
  resetCanvas();

  for(i=0; i<numberwords;i++){
    let d = dist(mouseX, mouseY, windowWidth*2/6+windowHeight/28, h_diff*(i+1)-windowHeight/20)
    if ( d < windowHeight/30) {
     // console.log('inside'+i+names_rnd[i]);
      overButton_text[i]=true;
    }else{
      overButton_text[i]=false;
    }
    if (locked[i]){
      push();
      strokeWeight(4);
      line(mouseX, mouseY, windowWidth*2/6+windowHeight/28, h_diff*(i+1)-windowHeight/20);
      pop();
    }
  }
  for(i=0; i<numberwords;i++){
    let d = dist(mouseX, mouseY, windowWidth*3/6-windowHeight/28, h_diff*(i+1)-windowHeight/20)
    if ( d < windowHeight/30) {
     // console.log('inside'+i+names[i]);
      overButton_image[i]=true;
    }else{
      overButton_image[i]=false;
    }
  }
  for (var key in connections){
    key_value=int(key);
    push();
    if (allcorrect==false && correct[key_value]==false){
      stroke(200,0,0);
    }else if (allcorrect) {
      stroke(0,125,0);
    }else{
      stroke(0);
    }
    strokeWeight(3);
    line( windowWidth*2/6+windowHeight/28, h_diff*(key_value+1)-windowHeight/20,
          windowWidth*3/6-windowHeight/28, h_diff*(connections[key]+1)-windowHeight/20);
    pop();
  }

  if(allcorrect==true){ //print text indefinitely if it checked correct
    push();
    colorMode(HSL);
    rectMode(CENTER);
    fill(120, 60, 70);
    rect(windowWidth/6, windowHeight/2, windowWidth/6, windowHeight/6);
    fill(120, 60, 50);
    stroke(0);
    strokeWeight(3);
    textSize(35);
    textAlign(CENTER, CENTER);
    text('Correct!', windowWidth/6, windowHeight/2);
    pop();
  }
}

var o=null, f=null;//origen and final variables
function mousePressed() {
  if(locked.some(isTrue)){
    values=Object.values(connections);
    for(j=0; j<numberwords;j++){
      if(overButton_image[j] && !values.includes(j)){
        connections[o]=j;
      }
    }
    if(f==null){
      o=null;
    }
    locked.fill(false)
    console.log('unlocked text');
  }
  for(i=0; i<numberwords;i++){
    if (overButton_text[i] && !(i in connections)) {
      locked[i] = true;
      o=i;
      f=null;
      //rect.style("background-color", "red");
      console.log(i+' locked text');
    }
  }
  console.log(connections);
}

function isTrue(bulean){
  return bulean==true;
}

function loadImages(){
  for(let i=0; i<numberwords;i++){
    imageloaded[i]=loadImage(images[images_rnd[i]]);
  }
}

function resetCanvas(){
  clear();
  background(220);

  push();
  textSize(25);
  textAlign(LEFT);
  fill(0);
  textStyle(NORMAL);
  textStyle(BOLD);
  text('Connect the words with its images', windowWidth/25, windowHeight/20);
  pop();

  for(let i=0; i<numberwords; i++){
    circle(windowWidth*2/6+windowHeight/28, h_diff*(i+1)-windowHeight/20, windowHeight/30);
    circle(windowWidth*3/6-windowHeight/28, h_diff*(i+1)-windowHeight/20, windowHeight/30);
    push();
    textSize(20);
    textAlign(RIGHT, CENTER);
    if (allcorrect==false && correct[i]==false){
      fill(200,0,0);
    }else if (allcorrect) {
      fill(0,125,0);
    }
    text(names[names_rnd[i]], windowWidth*2/6, h_diff*(i+1)-windowHeight/20);
    pop();

    if( i%2 == 0 ){
      image(imageloaded[i], windowWidth*3/6, h_diff*(i+1)-windowHeight/20-h_diff/2, h_diff, h_diff );
    }else{
      image(imageloaded[i], windowWidth*4/6, h_diff*(i+1)-windowHeight/20-h_diff/2, h_diff, h_diff );
    }
  }
}

function checking(){
  console.log(connections);
  let numbercorrect=0;
  for (var key in connections){
    key_value=int(key);
    if(names_rnd[key_value] == images_rnd[connections[key_value]]){
      correct[key_value]=true;
      numbercorrect++;
    }else{
      correct[key_value]=false;
    }
  }
  if(numbercorrect==numberwords){
    allcorrect=true;
  }
  check.hide();
  restart.show();
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
  exercice = 'text_line'
  const response = await fetch('getDB/'+ exercice +'&'+ unitEx);
  const json = await response.json();
  console.log('DB received: '+ json)
  return json;
}
