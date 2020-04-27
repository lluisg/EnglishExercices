//To get the unit which we are gona do the exercise
var queryString = decodeURIComponent(window.location.search);
queryString = queryString.substring(1);
var unitEx = queryString.split("=")[1];
console.log('Unit: '+unitEx);

var numberwords, numberoptions; //number of blankwords in the text and its options
var parragraf, text2complete; //paragraf parametre and base text
// var parragraf='I\'m a '+word[0]+' studing blablabla, I like to '+word[1]+' too, so... Who are '+word[2]+' ?';

//initialize buttons, options, word and solutions
var buttons = new Array();
// buttons[0] = new Array();
// buttons[1] = new Array();
// buttons[2] = new Array();
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
  // var lengthOptions=Array.from(flatten(options)).length;
  // console.log(JSON.parse(JSON.stringify(buttons)));

  //it will be scalated in order to mantain order
  //select number of words
  var sql='SELECT word FROM multiplechoice WHERE unit= '+unitEx;
  ///////// GETS THE WORDS NUMBER TO SUBSTITUTE
  var auxDB = getData().then(response =>{
    numberwords=response.rows[response.rows.length-1].word+1; //index start 0
    console.log('# words: '+numberwords);

    for(let i=0; i<numberwords; i++){
      buttons[i] = new Array();
      options[i] = new Array();
      words[i]=i+1;
    }

    //select the options
    for(let i=0; i<numberwords; i++){
      var sql='SELECT options FROM multiplechoice WHERE unit= '+unitEx+' AND word= '+i+' ORDER BY RAND()';
      //////////// GETS ALL THE POSSIBLE WORDS THAT HAVE THAT NUMBER WORD SUBSTITUTE
      var optionsDB = getData(sql).then(response =>{
        for(let j =0; j<response.rows.length; j++){
          options[i][j] = response.rows[j].options;
        }
        // console.log('options');
        // console.log(options);

        //select the solutions
        // for(let i=0; i<numberwords; i++){
          var sql='SELECT options FROM multiplechoice WHERE unit= '+unitEx+' AND word= '+i+' AND correct = "true"';
          ////////////// GETS THE CORRECT OPTION AMONG THEM
          var solutionsDB = getData(sql).then(response =>{
            solutions[i] = response.rows[0].options;
            // console.log('solutions');
            // console.log(solutions);

            //select the text
            var sql='SELECT text FROM multiplechoice WHERE unit= '+unitEx+' AND text IS NOT NULL';
            ////////////// GETS THE DIFFERENTS PARTS OF THE TEXT
            var textDB = getData(sql).then( async(response) =>{
              text2complete=response.rows;

              await createButtonsOptions(windowWidth/2, windowHeight/2,4,3,buttons, windowWidth/4, windowHeight/2 );
              resetParragraf();
              resetCanvas();
            });
          });
      });
    }
  });


  loginOut();

  check=createButton('Check');
  check.position(windowWidth*(3/4+1/12),windowHeight*(3/4));
  check.size(80,windowHeight/20);
  check.mousePressed(checking);

  ret=createButton('Return');
  ret.position(windowWidth*(3/4+1/12),windowHeight*(3/4+1/12));
  ret.size(80,windowHeight/20);
  ret.mousePressed( response => window.location.href='/exercices.html');

  restart=createButton('Restart');
  restart.position(windowWidth*(3/4+1/12),windowHeight*(3/4-1/12));
  restart.size(80,windowHeight/20);
  restart.style("background-color", "red")
  restart.hide();
  restart.mousePressed( response => window.location.href='/5exerciceMultipleChoice.html?unitEx='+unitEx);

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
  if(numbercorrect==numberwords){
    correct=true;
    resetCanvas();
  }
}

function selectButton(){
  console.log('button selected');
  [indx, indy] = getIndexOfK(buttons, this);
  words[indx]=options[indx][indy];

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

  for(let i=1; i <= g; i++){
    for(let j=1;j <= n; j++){
      buttons[i-1][j-1] = createButton(options[i-1][j-1]);
      buttons[i-1][j-1].position((((j-1)*3)+1)*distw+startingPointX, ((2*i)-1)*disth+startingPointY);
      buttons[i-1][j-1].size(2*distw+5,disth);
      buttons[i-1][j-1].value(0);
    }
  }
}

function resetParragraf(){
  var parr='', w=0;

  text2complete.forEach(function(textParts){
    parr=parr+textParts.text;
    if(words[w]!=undefined){
      parr=parr+words[w];
    }
    w++;
  });

  parragraf=parr;
  // 'I\'m a ('+word[0]+') studing blablabla, I like to ('+word[1]+') too, so... Who are ('+word[2]+') ?';
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



function *flatten(array) {
  for (elt of array)
    if (Array.isArray(elt)) yield *flatten(elt);
    else yield elt;
}

function getIndexOfK(arr, k) { //finder multidimensional array
  for (var i = 0; i < arr.length; i++) {
    var index = arr[i].indexOf(k);
    if (index > -1) {
      return [i, index];
    }
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
  exercice = 'multiple_choice'
  const response = await fetch('getDB/'+ exercice +'&'+ unitEx);
  const json = await response.json();
  console.log('DB received: '+ json)
  return json;
}

async function getText(){
  exercice = 'multiple_choice_text'
  const response = await fetch('getDB/'+ exercice +'&'+ unitEx);
  const json = await response.json();
  console.log('DB received: '+ json)
  return json;
}
