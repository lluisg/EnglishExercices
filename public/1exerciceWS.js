var game

//To get the unit which we are gona do the exercise
var queryString = decodeURIComponent(window.location.search);
queryString = queryString.substring(1);
var params = queryString.split("=")[1];
var unitEx = params.split("&")[0]
var user_name = params.split("&")[1]
console.log('Unit: '+ unitEx +' and Username: '+ user_name);
var MIN_LENGTH = 10; //min size the grid will have
var max_length = MIN_LENGTH; //variable to know the length necesary

var names = [], namesNoShuffled=[];
var MAX_WORDS=10; //how many words from all the vocabulary will be shuffled

async function setup(){
  logOut=createImg('images/logout.png');
  logOut.size(25,25);
  logOut.position(windowWidth-40,25);
  logOut.mousePressed(response => {
    window.location.href='/index.html';
  });

  //collect words from database
  var namesDB = await getData();
  maxlength = 0;
  for(let i=0;i<namesDB.result.length;i++){
    namesNoShuffled.push(namesDB.result[i].word);
    if(namesDB.result[i].word.length > max_length){
      max_length = namesDB.result[i].word.length;
    }
  }

  // in order to reestart the list of words of eevry soup
  var listed = $( "li" ).not( "#add-word" );
  listed.remove();
  names = shuffleList(namesNoShuffled).slice(0,MAX_WORDS); //to select N random words
  console.log(names);
  names.map(word => WordFindGame.insertWordAfter($('#add-word').parent(), word));
  recreate();
  $('#create-grid').click(recreate);
  $('#solve').click(() => game.solve());
  $('#get-back').click(() => window.location.href='/exercices.html?user='+ user_name);
}

// Start a basic word game without customization !
function recreate() {

  $('#result-message').removeClass();
  var fillBlanks, game;
  try {
    console.log('the grid will have size '+max_length+'x'+max_length);
    game = new WordFindGame('#puzzle', {
      // height: desired height of the puzzle, default: smallest possible
      // * width:  desired width of the puzzle, default: smallest possible
      // * orientations: list of orientations to use, default: all orientations
      // * fillBlanks: true to fill in the blanks, default: true
      // * maxAttempts: number of tries before increasing puzzle size, default:3
      // * maxGridGrowth: number of puzzle grid increases, default:10
      // * preferOverlap: maximize word overlap or not, default: true
      height: max_length,
      width:  max_length,
      orientations: ['horizontal','horizontalBack','vertical','verticalUp'],
      fillBlanks: true,
      maxAttempts: 20,
      maxGridGrowth: 1,
      preferOverlap: true,
      allowedMissingWords: 0,
    });
  } catch (error) {
    $('#result-message').text('We couldn\'t put all the words into the soup').css({color: 'red'});
    // `😞 ${error}, try to specify less ones`).css({color: 'red'});
    return;
  }
  wordfind.print(game);
  if (window.game) {
    // var emptySquaresCount = WordFindGame.emptySquaresCount();
    $('#result-message').text('The soup is ready!').css({color: ''});
    // `😃 ${emptySquaresCount ? 'but there are empty squares' : ''}`).css({color: ''});
    var timeOut = setTimeout(function() {
      $('#result-message').hide();
    }, 5000);
  }
  window.game = game;
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

async function getData(){
  exercice = 'search_puzzle'
  const response = await fetch('getDB/'+ exercice +'&'+ unitEx);
  const json = await response.json();
  console.log('DB received: '+ json)
  return json;
}
