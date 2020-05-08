//To get the unit which we are gona do the exercise
var queryString = decodeURIComponent(window.location.search);
queryString = queryString.substring(1);
var params = queryString.split("=")[1];
var unitEx = params.split("&")[0]
var user_name = params.split("&")[1]
console.log('Unit: '+ unitEx +' and Username: '+ user_name);


//THE EXERCICE PHRASES/WORDS MUST BE ALL IN MINUS!

var words = [], letters_actual = [], letters_right = [], letters_wrong=[];
//arrays for the words, letter of the actual word, letters rightly guessed and letters wrongly guessed
var count = 0; //number words to guess
// words = ['frog', 'onomatopeya', 'esternocleidomastoideo', 'two words', 'three words examples'];
var errors=0, correct_end=false, wrong_end=false; //number of errors and if it has correctly ended or wrongly ended
var dist_letters=[]; //distance between the lines of the letters
var nextword_shown = false;
var correctly_guessed = 0;
var nextword, but, restart; //buttons
var MAX_WORDS = 5;

function setup(){
  console.log('setup');

  //collect words from database
  var namesDB = getData().then(async(response) =>{
    for(let i=0; i<(response.result.length || MAX_WORDS); i++){
      words[i] = response.result[i].word;
      console.log('response word: '+response.result[i].word);
    }

    createCanvas(windowWidth,windowHeight);
    resetCanvas();

    words_rnd = shuffleList(words);
    nextWord();
  });

  loginOut();

  nextword=createButton('Next Word');
  nextword.position(windowWidth*3/4,windowHeight/2);
  nextword.size(windowWidth/8, windowHeight/4);
  nextword.mousePressed(nextWord);

  but=createButton('Return');
  but.position(windowWidth*(5/6+1/12-1/24),windowHeight*(3/4+2/12));
  but.size(80,windowHeight/20);
  but.mousePressed( response => window.location.href='/exercices.html?user='+ user_name);

  restart=createButton('Restart');
  restart.position(windowWidth*(5/6+1/12-1/24),windowHeight*(3/4+1/12));
  restart.size(80,windowHeight/20);
  restart.style("background-color", "red")
  restart.hide();
  restart.mousePressed( response => window.location.href='/8exerciceHanged.html?unitEx='+unitEx +'&'+ user_name);
}

function draw(){
  resetCanvas();
  drawHang();
  showwrongguessed();
  showletters();

  //show number of words guessed
  push();
  textSize(30);
  text(count+' / '+words.length, windowWidth*6/8, windowHeight*3/8);
  pop();

  // show or not the next image button
  if( (correct_end || wrong_end) &&  !_.isEqual(letters_actual, words_rnd[words_rnd.length-1].split('')) ){
    if (correct_end){
      nextword.style("background-color", "green")
      nextword.show();
      nextword_shown = true;
    };
    if (wrong_end){
      nextword.style("background-color", "red")};
      nextword.show();
      nextword_shown = true;

  } else if( (correct_end || wrong_end) && _.isEqual(letters_actual, words_rnd[words_rnd.length-1].split('')) ){
    push();
    textSize(15);
    textStyle(BOLD);
    textAlign(CENTER);
    if(correctly_guessed < words.length/2){
      fill(220,0,0);
      text('You guessed a lot wrong,\nyou should review the unit', windowWidth*13/16, windowHeight*4/8);
    }else if(correctly_guessed == words.length){
      fill(0,220,0);
      text('Great job,\n you guessed all right!', windowWidth*13/16, windowHeight*4/8);
    }else{
      fill(0,100,100);
      text('You almost had it!', windowWidth*13/16, windowHeight*4/8);
    }
    pop();
    restart.show();
  }
}

function keyPressed() {
  if (keyCode === ENTER && nextword_shown) {
    nextWord();
  }
}

//draws the hanging man
function drawHang(){
  push();
  strokeWeight(3);
  if(errors>0){
    line(windowWidth*(3/8-1/16),  windowHeight*5/8, windowWidth*(3/8+1/16), windowHeight*5/8);
  }
  if(errors>1){
    line(3*windowWidth/8,         windowHeight/8,   3*windowWidth/8,        5*windowHeight/8);
  }
  if(errors>2){
    line(3*windowWidth/8,         windowHeight/8,   5*windowWidth/8,        windowHeight/8);
  }
  if(errors>3){
    line(3*windowWidth/8,         2*windowHeight/8, 7*windowWidth/16,       windowHeight/8);
  }
  if(errors>4){
    line(5*windowWidth/8,         windowHeight/8,   5*windowWidth/8,        3*windowHeight/16);
  }
  if(errors>5 && !correct_end){
    if(wrong_end){
      fill(220,0,0);
    }else{
      noFill();
    }
    circle(5*windowWidth/8, 3*windowHeight/16 + windowHeight/24, windowHeight/12);
  }
  if(errors>6 && !correct_end){
    line(5*windowWidth/8, 3*windowHeight/16 + windowHeight/12, 5*windowWidth/8, 7*windowHeight/16);
  }
  if(errors>7 && !correct_end){
    line(5*windowWidth/8,         7*windowHeight/16, windowWidth*19/32, 8*windowHeight/16);
  }
  if(errors>8 && !correct_end){
    line(5*windowWidth/8,         7*windowHeight/16, windowWidth*21/32, 8*windowHeight/16);
  }
  if(errors>9 && !correct_end){
    line(5*windowWidth/8,         5*windowHeight/16, windowWidth*19/32, 11*windowHeight/32);
  }
  if(errors>10 && !correct_end){
    line(5*windowWidth/8,         5*windowHeight/16, windowWidth*21/32, 11*windowHeight/32);
    line(windowWidth*5/8-windowHeight/30, windowHeight*(3/16+1/30), windowWidth*5/8+windowHeight/30, windowHeight*(3/16+1/12-1/30));
    line(windowWidth*5/8-windowHeight/30, windowHeight*(3/16+1/12-1/30), windowWidth*5/8+windowHeight/30, windowHeight*(3/16+1/30));
    wrong_end = true; //as we have more than permitted
  }
  if(correct_end){
    fill(0,250,0);
    circle(5*windowWidth/8,       6*windowHeight/16 + windowHeight/24, windowHeight/12);
    line(5*windowWidth/8,         6*windowHeight/16 + windowHeight/12, 5*windowWidth/8,    10*windowHeight/16);
    line(5*windowWidth/8,         10*windowHeight/16,                   windowWidth*19/32,  11*windowHeight/16);
    line(5*windowWidth/8,         10*windowHeight/16,                   windowWidth*21/32,  11*windowHeight/16);
    line(5*windowWidth/8,         8*windowHeight/16,                   windowWidth*19/32,  17*windowHeight/32);
    line(5*windowWidth/8,         8*windowHeight/16,                   windowWidth*21/32,  17*windowHeight/32);
  }
  pop();
}

function keyTyped(){
  if(!(wrong_end || correct_end) && isLetter(key)){
    console.log(key);
    inside = checkletter(key);
    if(inside == true){
      writeletter(key);
    }else if(inside == false && _.indexOf(letters_wrong, key)==-1){
      errors++;
      letters_wrong[letters_wrong.length]=key;
    }
    var letters_right_lowercase = tolowercase(letters_right);
    if(_.isEqual(letters_right_lowercase, letters_actual)){
      correct_end=true;
      correctly_guessed += 1;
    }
  }
}

//function to pass an array into all lowercases
function tolowercase(array){ //transform the array into lowercase taking into account the spaces
  auxiliar_array = [];
  for(let i=0; i<array.length; i++){
    // if(array[i]=='' || array[i]==undefined){
    if(array[i]==undefined){
      auxiliar_array[i]=' ';
    }else{
      auxiliar_array[i] = array[i].toLowerCase();
    }
  }
  return auxiliar_array;
}

//function to check if the letter typed is one of the word
function checkletter(letter){
  var inside = false;
  for(let i=0; i<letters_actual.length; i++){
    if(letters_actual[i]==letter){
      inside=true;
    }
  }
  return inside;
}

//function to write the letters into the array of the actual word into screen if there are any match
function writeletter(letter){
  for(let i=0; i<letters_actual.length; i++){
    if(letters_actual[i]==letter){
      letters_right[i] = letter.toUpperCase();
    }
  }
}

//function to show the letters into the screen
function showletters(){
  var index=0;
  //check if the word is to large and consist of more than one word, it separates into two lines
  if(letters_actual.length >= 20 && numWords(letters_actual)>1){
    let endline1 = divideTwoLines(letters_actual);
    dist_letters[0]=((windowWidth*4/8) / endline1) - windowWidth/90;
    dist_letters[1]=((windowWidth*4/8) / (letters_actual.length-endline1-1)) - windowWidth/90;

    for(let j=0; j<2; j++){
      for(let i=0;i<letters_actual.length; i++){
        if( j==0 && i<endline1 && letters_actual[i]!=' '){
          // console.log('index1');
          index = i;
          line(windowWidth*2/8+windowWidth/90*(index+1)+dist_letters[j]*index, windowHeight*(7/8-1/16), windowWidth*2/8+(windowWidth/90+dist_letters[j])*(index+1), windowHeight*(7/8-1/16));
          if(letters_right[i]!=undefined){ //if not will advise its empty and its irritating
            push();
            textAlign(CENTER);
            textSize(30);
            text(letters_right[i], windowWidth*2/8+windowWidth/90*(index+1)+dist_letters[j]*index+dist_letters[j]/2, windowHeight*(7/8-1/16));
            pop();
          }else if(wrong_end){ //print in red when failed
            push();
            textAlign(CENTER);
            textSize(30);
            fill(200,0,0);
            text(letters_actual[i].toUpperCase(), windowWidth*2/8+windowWidth/90*(index+1)+dist_letters[j]*index+dist_letters[j]/2, windowHeight*(7/8-1/16));
            pop();
          }
        }else if( j==1 && i>endline1 && letters_actual[i]!=' '){
          // console.log('index2');
          index = i-endline1-1;
          line(windowWidth*2/8+windowWidth/90*(index+1)+dist_letters[j]*index, windowHeight*(7/8), windowWidth*2/8+(windowWidth/90+dist_letters[j])*(index+1), windowHeight*(7/8));          // line(windowWidth*2/8+windowWidth/90*(index+1)+dist_letters[j]*i, windowHeight*(7/8), windowWidth*2/8+(windowWidth/90+dist_letters[j])*(index+1), windowHeight*(7/8));
          if(letters_right[i]!=undefined){ //if not will advise its empty and its irritating
            push();
            textAlign(CENTER);
            textSize(30);
            text(letters_right[i], windowWidth*2/8+windowWidth/90*(index+1)+dist_letters[j]*index+dist_letters[j]/2, windowHeight*7/8);
            pop();
          }else if(wrong_end){ //print in red when failed
            push();
            textAlign(CENTER);
            textSize(30);
            fill(200,0,0);
            text(letters_actual[i].toUpperCase(), windowWidth*2/8+windowWidth/90*(index+1)+dist_letters[j]*index+dist_letters[j]/2, windowHeight*7/8);
            pop();
          }
        }
      }
    }
  }else{
    for(let i=0;i<letters_actual.length; i++){
      dist_letters[0]=((windowWidth*4/8) / letters_actual.length) - windowWidth/90;
      if(letters_actual[i]!=' '){
        line(windowWidth*2/8+windowWidth/90*(i+1)+dist_letters[0]*i, windowHeight*7/8, windowWidth*2/8+(windowWidth/90+dist_letters[0])*(i+1), windowHeight*7/8);

        if(letters_right[i]!=undefined){ //if not will advise its empty and its irritating
          push();
          textAlign(CENTER);
          textSize(30);
          text(letters_right[i], windowWidth*2/8+windowWidth/90*(i+1)+dist_letters[0]*i+dist_letters[0]/2, windowHeight*7/8);
          pop();
        }else if(wrong_end){ //print in red when failed
          push();
          textAlign(CENTER);
          textSize(30);
          fill(200,0,0);
          text(letters_actual[i].toUpperCase(), windowWidth*2/8+windowWidth/90*(i+1)+dist_letters[0]*i+dist_letters[0]/2, windowHeight*7/8);
          pop();
        }
      }
    }
  }
}

//function to show the wrongly used
function showwrongguessed(){
  push();
  rectMode(CORNER);
  line(windowWidth/16, windowHeight/8, windowWidth/16, windowHeight*7/8);
  line(windowWidth*3/16, windowHeight/8, windowWidth*3/16, windowHeight*7/8);
  line(windowWidth/16, windowHeight*7/8, windowWidth*3/16, windowHeight*7/8);

  textAlign(CENTER);
  textStyle(BOLD);
  textSize(12);
  text('LETTERS USED', windowWidth*2/16, windowHeight/8);

  textSize(20);
  for(let i=0; i<letters_wrong.length;i++){
    let ind=(Math.floor(i/3))%12;
    if(i%3==0){
      text(letters_wrong[i].toUpperCase(),windowWidth*(1/16+1/32), windowHeight*(1/8+(ind+1)*1/16));
    }else if(i%3==1){
      text(letters_wrong[i].toUpperCase(),windowWidth*(1/16+2/32), windowHeight*(1/8+(ind+1)*1/16));
    }else if (i%3==2) {
      text(letters_wrong[i].toUpperCase(),windowWidth*(1/16+3/32), windowHeight*(1/8+(ind+1)*1/16));
    }
  }
  pop();
}
//function that returns the array separated in two lines trying to adapt the better posible
function divideTwoLines(phrase){
  var word_endings = [];
  var differences = [];
  for (let i=0; i<letters_actual.length;i++){
    if(letters_actual[i]==' '){
      word_endings[word_endings.length]=i;
      differences[differences.length] = Math.abs(word_endings[word_endings.length-1] - phrase.length/2);
    }
  }
  var min=Math.min(...differences); //where the distance is minimum
  return word_endings[_.indexOf(differences, min)];
}

//function that returns the number of words in the phrase
function numWords(array){
  var number=1;
  for(let i=0; i<array.length;i++){
    if(array[i]==' '){
      number++;
    }
  }
  return number;
}
//function to check if its a letter
function isLetter(c) {
  return c.toLowerCase() != c.toUpperCase();
}

//function to pass to the next word
function nextWord(){
  console.log(words_rnd);
  if (letters_actual.length != 0){
    for(let i=0; i<words_rnd.length-1; i++){
      // take the next word of the equal one, if there is one
      if( _.isEqual(words_rnd[i].split(''), letters_actual) ){
        letters_actual = words_rnd[i+1].split('');
        break;
      }
    }
  }else{
    letters_actual = words_rnd[0].split('');
  }
  console.log(letters_actual);
  nextword.hide();
  count++;
  letters_right = [];
  letters_wrong = [];
  errors=0;
  correct_end=false;
  wrong_end=false;
  nextword_shown=false;
}


function resetCanvas(){
  clear();
  background(220);

  push();
  textSize(25);
  textAlign(CENTER);
  fill(0);
  textStyle(NORMAL);
  textStyle(BOLD);
  text('Guess the right word', windowWidth/2, windowHeight/18);
  pop();
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
  exercice = 'hangman'
  const response = await fetch('getDB/'+ exercice +'&'+ unitEx);
  const json = await response.json();
  console.log('DB received: '+ json)
  return json;
}
