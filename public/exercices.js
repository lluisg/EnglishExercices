var exercices = [], units = []; //arrays to save buttons
var unitEx; //variable to save the actual unit
var queryString; //variable to send variables between html
var nameEx=[  'Word Search Puzzle',
              'Crossword',
              'What did you hear?',
              'Image Description',
              'Multiple Choice',
              'Grouping',
              'Select the image',
              'Hanged',
              'Pinturillo',
              'Not implemented']
var nameUnits=[ 'Unit 1',
                'Unit 2',
                'Unit 3',
                'Unit 4',
                'Unit 5',
                'Unit 6',
                'All',];
var numberEx=nameEx.length, numberUnits=nameUnits.length; //values # exercices and units


function setup(){
  removeElements();
  clear();
  createCanvas(windowWidth, windowHeight);
  background(220);

  initSelect();

  logOut=createImg('images/logout.png');
  logOut.size(25,25);
  logOut.position(windowWidth-40,25);
  logOut.mousePressed(response => {
    window.location.href='/index.html';
  });
}

async function draw(){
  for(let i=0;i<numberUnits;i++){ //check all units buttons
    units[i].mousePressed(putUnitsBlue);
  }
  for(let i=0;i<numberEx;i++){ //check all exercices buttons
   exercices[i].mousePressed(putExBlue);
  }

  //when an exercice and a unit are selected, the state change to that information
  for(let j=0;j<numberUnits;j++){ //check all units buttons
    if(units[j].value()=="1"){
      for(let i=0;i<numberEx;i++){ //check all exercices buttons
        if(exercices[i].value()=="1"){
          unitEx=j+1;
          let exercice=i+11;
          console.log('game state: '+(i+11)+' Unit: '+unitEx);
          if (unitEx==units.length){
            unitEx='*';
          }
          queryString = "?unitEx=" + unitEx;
          switch(exercice){
            case 11:
              window.location.href='/1exerciceWS.html' + queryString;
              break;
            case 12:
              window.location.href='/2exerciceCrossW.html' + queryString;
              break;
            case 13:
              window.location.href='/3exerciceAudio.html' + queryString;
              break;
            case 14:
              window.location.href='/4exerciceImageD.html' + queryString;
              break;
            case 15:
              window.location.href='/5exerciceMultipleChoice.html' + queryString;
              break;
            case 16:
              window.location.href='/6exerciceGrouping.html' + queryString;
              break;
            case 17:
              window.location.href='/7exerciceTextLineImage.html' + queryString;
              break;
            case 18:
              window.location.href='/8exerciceHanged.html' + queryString;
              break;
            case 19:
              window.location.href='/9exercicePinturillo.html' + queryString;
              break;
            case 19:
              window.location.href='/91exerciceLetterGame.html' + queryString;
              break;
            default:
              window.location.href='/exercices.html';
              break;
          }
        }
      }
    }
  }
}

function initSelect(){
  //start all the buttons to select the exercices and the units
  console.log('function initSelect');
  let disth,distw;

  disth=windowHeight/(2*(numberUnits-floor(numberUnits/2))+1);
  distw=windowWidth/(14);
  createButtonsInterval(distw,disth,numberUnits,units,0,0,nameUnits);

  disth=windowHeight/(2*(numberEx-floor(numberEx/2))+1);
  distw=windowWidth/(14);
  createButtonsInterval(distw,disth,numberEx,exercices,windowWidth/2,0, nameEx);
  exercices.forEach(function(exercice){
    //hide all the unit buttons until one exercice is pressed
    exercice.hide();
  });
}

function createButtonsInterval(x,y,n,vector, startingPointX,startingPointY, writing){
  //function to create n buttons uniformously inside x*y and save them in the vector array that will show as input the writing
  var grupos, initial;

  for(var j=1;j<=2;j++){
    if(j==1){ //starts at 0 until the less #/2
      grupos=n-floor(n/2);
      initial=0;
    }else{ //starts on the other until the end
      grupos=floor(n/2);
      initial=n-grupos;
    }
    for(let i=0;i<grupos;i++){
      vector[i+initial] = createButton(writing[i+initial]);
      vector[i+initial].position((((j-1)*3)+1)*x+startingPointX, ((2*i)+1)*y+startingPointY);
      vector[i+initial].size(2*x,y);
      vector[i+initial].value(0);
    }
  }
}

function putExBlue(){
  //put the exercises buttons in blue when you click them and its value to 1
  this.value(1);
  this.style('background-color','#5064ad');
}

function putUnitsBlue(){
  units.forEach(function(unit){
    unit.style('background-color','');
    unit.value(0);
  });
  //put the unit buttons in blue when you click them and its value to 1
  this.value(1);
  this.style('background-color','#5064ad');

  //show the exercices buttons
  for(let i=0;i<numberEx;i++){
    exercices[i].show();
  }
}
