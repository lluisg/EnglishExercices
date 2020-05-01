//To get the unit which we are gona do the exercise
var queryString = decodeURIComponent(window.location.search);
queryString = queryString.substring(1);
var params = queryString.split("=")[1];
var unitEx = params.split("&")[0]
var user_name = params.split("&")[1]
console.log('Unit: '+ unitEx +' and Username: '+ user_name);


var num_groups; //number of differents groups
var correct=false, correction='a'; //if the checking is good or not
var timer;
var names = new Array();
var groups_name = new Array();
var values; //values of the rectangles to check if correct classified

var elementsButtons = []; //here we will save the buttons
var locked, overButton; //indicate if the mouse is over the buttons

var name2group = {};
// name2group={
//   Red: 0,
//   Blue: 0,
//   Green: 0,
//   One: 1,
//   Two: 1,
//   Fifteen: 1,
//   Ei: 2,
//   Bi: 2,
//   Ci: 2
// }

var coord = [], coord2 = new Array(); //variables of x, y, width and weight of the rectangles
var coordClass = []; //same of the class rectangles


async function setup(){

 var auxGroup = getData().then(response =>{
   previous_theme = ''; // save the theme only if it's different from the previous one
   j=0;
   for(let i=0; i<response.result.length; i++){
     if( response.result[i].theme != previous_theme){
       groups_name[j] = response.result[i].theme;
       previous_theme = response.result[i].theme;
       j+=1;
     }
     names[i] = response.result[i].word;
     name2group[response.result[i].word]=groups_name.indexOf(response.result[i].theme);
     //dictionary between words and their theme
   }
   num_groups=groups_name.length;
   //get the array with the names of the groups and its length
   names = shuffleArray(names)

   for(let i=0;i<names.length;i++){
     coord2[i] = new Array();
   }
   createButtons3rows(5*windowWidth/7, windowHeight*0.15, names.length, coord2, windowWidth/18, windowHeight*0.8);
     //function to create n buttons uniformously inside x*y and save them in the vector array that will show as input the writing
   resetCanvas();

  });

  // rectMode(CORNER);
  // rect(windowWidth/18, windowHeight*0.8, 5*windowWidth/7, windowHeight*0.15);
  coord = [windowWidth/16, windowHeight*0.9, 100, 20];

  values = new Array(names.length);
  values.fill(5); //put the values to 5, 0 is the first class rectangle
  locked = new Array(names.length);
  locked.fill(false);
  overButton = new Array(names.length);
  overButton.fill(false);

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
  restart.mousePressed( response => window.location.href='/6exerciceGrouping.html?unitEx='+unitEx);
}

function draw(){
  // console.log(mouseX, mouseY);
  resetCanvas();
  for(i=0; i<coord2.length;i++){
    if (mouseX > coord2[i][0] && mouseX < coord2[i][0] + coord2[i][2] &&
          mouseY > coord2[i][1] && mouseY < coord2[i][1] + coord2[i][3]) {
     // console.log('inside'+i+names[i]);
      overButton[i]=true;
    }else{
    overButton[i]=false;
    }
  }

  if (correction=='incorrect'){
    push();
    colorMode(HSL);
    fill(0, 75, 45);
    stroke(0);
    textSize(30);
    textAlign(CENTER, CENTER);
    text('There\'s some word where it doesn\'t belong', windowWidth/18+(5*windowWidth/7/2), windowHeight*0.8+(windowHeight*0.15/2));
    pop();

    if(timer==0){
      correction='a';
    }else if(frameCount % 60 == 0){
      timer--;
    }
  }else if(correction=='correct'){
    correction='a';
    correct=true;
  }else if(correct==true){ //print text indefinitely if it checked correct
    push();
    colorMode(HSL);
    fill(120, 60, 60);
    stroke(0);
    textSize(30);
    textAlign(CENTER, CENTER);
    text('You have put all the words correctly', windowWidth/18+(5*windowWidth/7/2), windowHeight*0.8+(windowHeight*0.15/2));
    pop();
  }
}


function resetCanvas(){
  clear();
  createCanvas(windowWidth,windowHeight);
  background(220);

  textSize(28);
  textAlign(CENTER, CENTER);
  text('Put the words into their respective group', windowWidth/2, windowHeight/20);
  drawRectClass(num_groups);
  rect(windowWidth/18, windowHeight*0.8, 5*windowWidth/7, windowHeight*0.15);
  rectMode(CORNER);
  updateRect();
  }

//functions to move the buttons
function mousePressed() {
  for(i=0; i<coord2.length;i++){
    if (overButton[i]) {
      locked[i] = true;
      //rect.style("background-color", "red");
      console.log(i+' locked');
    }
  }
}

function mouseDragged() {
  for(i=0; i<coord2.length;i++){
    if (locked[i]){
      coord2[i][0]=mouseX-coord2[i][2]/2;
      coord2[i][1]=mouseY-coord2[i][3]/2;
      resetCanvas();
    }
  }
}

function mouseReleased() {
  for(i=0; i<coord2.length;i++){
    if(locked[i]){
      locked[i] = false;
      console.log(i+' unlocked');
    }
  }
}

function drawRectClass(numg){

  div=windowWidth/((3*numg)+1);
  //console.log(windowWidth, div, windowWidth/10);
  for (i=0; i<num_groups; i++){
    coordClass[i] = new Array();
    push();
    rectMode(CORNER);
    colorMode(HSL);
    fill(180+30*(i+1), 50,80);
    //save the coordinates of the big
    coordClass[i][0] = div*((3*(i+1))-2);// X coordinate
    coordClass[i][1] = windowHeight/10;// Y coordinate
    coordClass[i][2] = 2*div;// Width
    coordClass[i][3] = 0.65*windowHeight;// Heigth
    rect(coordClass[i][0], coordClass[i][1], coordClass[i][2], coordClass[i][3], 5); //large one
    rectMode(CENTER);
    rect(div*((3*(i+1))-2)+div,  windowHeight/8, div*3/2, 0.05*windowHeight, 5); //title
    fill(0);
    textSize(22);
    textAlign(CENTER, CENTER);
    text(groups_name[i], div*((3*(i+1))-2)+div,  windowHeight/8);
    pop();
  }
}



function checking(){
  var howmany=0;
  for(i=0; i<coord2.length; i++){
    console.log(names[i]+' - '+values[i]+' - '+name2group[names[i]]);
    if (values[i]==name2group[names[i]]) {
      howmany++;
    }
  }
  if(howmany==coord2.length){
    correction='correct';
    check.hide();
    restart.show();
  }else{
    correction='incorrect';
    timer=3;
  }
}

function createButtons3rows(x,y,n,saveCoord, startingX,startingY){

  // console.log('x:'+x);
  // console.log('y:'+y);
  // console.log('n:'+n);
  // console.log('sX:'+startingX);
  // console.log('sY:'+startingY);
  //retorna la x, y, width, height
  //crea n quadrats dins de startingX+x, startingY+y, guarda les coordenades a saveCoord
  //function to create n buttons uniformously inside x*y and save them in the vector array that will show as input the writing
  var rows_div, positionx, positionY;

  rows_div=y/10;
  positionX=startingX+startingX/2;
  positionY=startingY+rows_div;

  for(let i=0;i<n;i++){
    // console.log('vectorIn:'+saveCoord[i]);
    widthRect=textWidth(names[i])+10;
    heightRect=rows_div*2+5;
    if(positionX+widthRect > x+startingX){ //check if we are out of x
      console.log('entered if for '+i)
      positionX=startingX+startingX/2;
      positionY=positionY+heightRect+rows_div*2;
    }

    saveCoord[i][0] = positionX; //location X
    saveCoord[i][1] = positionY; //location Y
    saveCoord[i][2] = widthRect; //width
    saveCoord[i][3] = heightRect; //height
    rect(saveCoord[i][0], saveCoord[i][1], saveCoord[i][2], saveCoord[i][3], 2);

    positionX = positionX + widthRect + windowWidth/30;
    // console.log('vectorOut:'+saveCoord[i]);
  }
}

function updateRect(){
  //update where and which color are all the rectangles with the words to classify
  var inside;
  push();
  for(i=0; i<coord2.length;i++){
    inside=5;
    for(j=0; j<coordClass.length;j++){
      //check for every rectangle if it's inside every class rectangle
      if(coord2[i][0] > coordClass[j][0]-coord2[i][2] && coord2[i][0] < coordClass[j][0]+coordClass[j][2] &&
          coord2[i][1] > coordClass[j][1]-coord2[i][3] && coord2[i][1] < coordClass[j][1]+coordClass[j][3]){
        // console.log('inside '+j);
        inside=j;
        values[i]=j;
      }
    }
    colorMode(HSL);
    if(correct){
      fill(119,58,61); //if all are correct
    }else if(inside!=5){
      fill(180+30*(inside+1), 50,80);
    }else{
      fill(255);
    }

    rectMode(CORNER);
    rect(coord2[i][0], coord2[i][1], coord2[i][2], coord2[i][3], 2); //large one
    fill(0);
    textSize(16);
    textAlign(CENTER, CENTER);
    text(names[i], coord2[i][0]+coord2[i][2]/2, coord2[i][1]+coord2[i][3]/2);
  }
  pop();
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

function loginOut(){
  logOut=createImg('images/logout.png');
  logOut.size(25,25);
  logOut.position(windowWidth-40,25);
  logOut.mousePressed(response => {
    window.location.href='/index.html';
	});
}

async function getData(){
  exercice = 'grouping'
  const response = await fetch('getDB/'+ exercice +'&'+ unitEx);
  const json = await response.json();
  console.log('DB received: '+ json)
  return json;
}
