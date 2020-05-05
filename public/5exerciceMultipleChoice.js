//To get the unit which we are gona do the exercise
var queryString = decodeURIComponent(window.location.search);
queryString = queryString.substring(1);
var params = queryString.split("=")[1];
var unitEx = params.split("&")[0]
var user_name = params.split("&")[1]
console.log('Unit: '+ unitEx +' and Username: '+ user_name);


var parragraf, text2complete; //paragraf parametre and base text

//initialize buttons, options, word and solutions
var buttons = new Array();
// buttons[0] = new Array();
// buttons[1] = new Array();
// buttons[2] = new Array();
var shuffled_options = new Array(); //same as options, but they have randomized positions
var options = new Array();
// var options = [['girl', 'boy', 'racoon', 'apache helicopte'],
//           ['play football', 'do nothing', 'sing', 'fuck'],
//           ['you', 'me', 'we', 'the crusaders']
// ];
var words = new Array();
// var words = ['1', '2', '3'];
var solutions = new Array();
// var solutions = ['boy', 'sing', 'we'];
var correct=false; //if the checking is good or not

async function setup(){

  var auxDB = getData().then(response =>{

    for(let i=0; i<response.result.length;i++){
      solutions[i] = response.result[i].correct_answer;

      options[i] = new Array();
      options[i][0] = response.result[i].option1;
      options[i][1] = response.result[i].option2;
      options[i][2] = response.result[i].option3;
      options[i][3] = response.result[i].option4;
      shuffled_options[i] = shuffleArray(options[i])

      buttons[i] = new Array();

      words[i] = i+1;
    }

    var textDB = getText().then(response2 =>{

      text2complete=response2.result[0].text.split('@');

      createButtonsOptions(windowWidth/2, windowHeight/2, 4, words.length, buttons, windowWidth/4, windowHeight/2 );
      resetParragraf();
      resetCanvas();

    });
  });

  loginOut();

  check=createButton('Check');
  check.position(windowWidth*(3/4+1/12),windowHeight*(3/4));
  check.size(80,windowHeight/20);
  check.mousePressed(checking);

  ret=createButton('Return');
  ret.position(windowWidth*(3/4+1/12),windowHeight*(3/4+1/12));
  ret.size(80,windowHeight/20);
  ret.mousePressed( response => window.location.href='/exercices.html?user='+ user_name);

  restart=createButton('Restart');
  restart.position(windowWidth*(3/4+1/12),windowHeight*(3/4-1/12));
  restart.size(80,windowHeight/20);
  restart.style("background-color", "red")
  restart.hide();
  restart.mousePressed( response => window.location.href='/5exerciceMultipleChoice.html?unitEx='+unitEx +'&'+ user_name);

}

function draw(){
  for(let i=0; i<buttons.length; i++){
    for(let j=0; j<buttons[i].length; j++){
      buttons[i][j].mousePressed(selectButton);
    }
  }
}

function checking(){
  var numbercorrect=0; //number of corrects answers

  for(let i=0;i<buttons.length;i++){
    buttons[i].forEach(function(bp){
      if(bp.value()==1){
        if(words[i]==solutions[i]){
          bp.style('background-color', 'green');
          numbercorrect++;
        }else{
          bp.style('background-color', 'red');
        }
      }
    });
  }
  if(numbercorrect==words.length){
    correct=true;
    resetCanvas();
  }
}

function selectButton(){
  console.log('button selected');
  [indx, indy] = getIndexOfK(buttons, this);
  words[indx]=shuffled_options[indx][indy];

  var posy=this.y
  // resetCanvas();

  //put the exercises buttons in blue when you click them and its value to 1
  buttons.forEach(function(ex){
      ex.forEach(function(bp){
        if(posy==bp.y){ //if it is in the same line
          bp.style('background-color', '');
          bp.value(0);
        }
      });
  });
  this.style("background-color", "blue");
  this.value(1);

  resetParragraf();
  resetCanvas();
}

function createButtonsOptions(x,y,n,g,buttons, startingPointX,startingPointY, writing){
  //function to create g groups with n options any uniformously inside x*y and save them in the vector array that will show as input the writing

  //each button will be 2x*y, with distance x and y
  //this x and y will be distw and disth
  distw=x/((3*n)+1);
  disth=y/((2*g)+1);
  console.log('111', n, g, distw, disth)

  for(let i=1; i <= g; i++){
    for(let j=1;j <= n; j++){
      buttons[i-1][j-1] = createButton(shuffled_options[i-1][j-1]);
      buttons[i-1][j-1].position((((j-1)*3)+1)*distw+startingPointX, ((2*i)-1)*disth+startingPointY);
      buttons[i-1][j-1].size(2*distw+5,disth);
      buttons[i-1][j-1].value(0);
    }
  }
  console.log('222')
}

function resetParragraf(){
  var parr='', w=0;
  console.log('res par')
  console.log(text2complete)

  text2complete.forEach(function(textParts){
    console.log(textParts)
    parr=parr+textParts;
    if(words[w]!=undefined){
      parr=parr+words[w];
    }
    w++;
  });

  // 'I\'m a ('+word[0]+') studing blablabla, I like to ('+word[1]+') too, so... Who are ('+word[2]+') ?';
  parragraf=parr;
}

function resetCanvas(){
  clear();
  createCanvas(windowWidth,windowHeight);
  background(220);

  textSize(20);
  textAlign(CENTER, CENTER);
  if(correct){
    check.hide();
    restart.show();
    fill(0,140,0);

  }else{
    fill(0);
  }
  rectMode(CENTER);
  text(parragraf, windowWidth/2, 100, windowWidth/1.5, windowHeight/2);

  for(let i=0; i < buttons.length; i++){
    initPosition=buttons[i][0].position();
    text((i+1)+')',initPosition.x-50, initPosition.y);
  }
}


function getIndexOfK(arr, k) { //finder multidimensional array
  for (var i = 0; i < arr.length; i++) {
    var index = arr[i].indexOf(k);
    if (index > -1) {
      return [i, index];
    }
  }
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
  exercice = 'multiple_choice'
  const response = await fetch('getDB/'+ exercice +'&'+ unitEx);
  const json = await response.json();
  console.log('DB received: '+ json)
  console.log(json)
  return json;
}

async function getText(){
  exercice = 'multiple_choice_text'
  const response = await fetch('getDB/'+ exercice +'&'+ unitEx);
  const json = await response.json();
  console.log('DB received: '+ json)
  console.log(json)
  return json;
}
