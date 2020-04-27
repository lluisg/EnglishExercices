//based on https://jsfiddle.net/7arnuq3y/2/

//To get the unit which we are gona do the exercise
var queryString = decodeURIComponent(window.location.search);
queryString = queryString.substring(1);
var unitEx = queryString.split("=")[1];
console.log('Unit: '+unitEx);

var grid = [];
if(unitEx==1){
	grid = [	[0, 0, 0, 0, 0, '1', 0, 0, 0, '2', 0, 0],
				[0, 0, 0, 0, '3', '1,3', '3', '3', '3', '2,3', '3', '3'],
				['4', 0, 0, 0, 0, '1', 0, 0, 0, '2', 0, 0],
				['4,5', '5', '5', '5', '5', '1,5', '5', 0, '6', '2,6', '6', '6'],
				['4', 0, 0, 0, 0, '1', 0, 0, 0, '2', 0, 0],
				['4', 0, 0, '7', 0, '1', 0, '12,8', '8', '2,8', '8', '8'],
				['4', 0, '9', '7,9', '9', '1,9', 0, '12', 0, '2', 0, 0],
				['4', 0, 0, '7', 0, '1', 0, '12', 0, 0, 0, '10'],
				['4', 0, 0, '7', 0, 0, 0, 0, 0, 0, 0, '10'],
				['4', 0, 0, '7,11', '11', '11', '11', '11', '1', '11', '11', '10,11'],
        [0, 0, 0, '7', 0, 0, 0, 0, 0, 0, 0, '10'],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '10']
			];
}else{
	console.log('You have to fill the adecuated table')
}
var clues = [];
var answers = [];
var correct_words=0; //number of correct words

async function setup(){
  createCanvas(windowWidth,windowHeight);
  background(220);
  logOut=createImg('images/logout.png');
  logOut.size(25,25);
  logOut.position(windowWidth-40,25);
  logOut.mousePressed(response => {
    window.location.href='/index.html';
	});

	var answers2=[],clues2=[];
	dataDB = await getData();
	for(let i=0;i<dataDB.result.length;i++){
		answers[i] = dataDB.result[i].word;
		clues[i] = dataDB.result[i].description;
	}

	//Draw hints
	var vertical_hints = $('<div id="vertical_hints"></div>');
	var horizontal_hints = $('<div id="horizontal_hints"></div>');
	$.each(clues,function(index){

	    var direction = get_direction(index+1);

	    if(direction == "horizontal"){
	        $(horizontal_hints).append('<div class="hint"><b>'+(index+1)+'</b>.-'+clues[index]+'</hint>');
	    }
	    else if(direction == "vertical"){
	    	$(vertical_hints).append('<div class="hint"><b>'+(index+1)+'</b>.-'+clues[index]+'</hint>');
	    }
	});
	$("#vertical_hints_container").append(vertical_hints);
	$("#horizontal_hints_container").append(horizontal_hints);
}


//Draw grid
$.each(grid,function(i){
    var row = $('<tr></tr>');
	$.each(this,function(j){
        if(this == 0){
        	$(row).append('<td class="square empty"></td>');
        }
        else{
					var question_number = String(grid[i][j]).split(",");
            var starting_number = '';
            var question_number_span = '';

            for(var k = 0;k < question_number.length;k++){
                var direction = get_direction(question_number[k]);
                var startpos = get_startpos(question_number[k],direction);

                if(direction == "horizontal" && startpos[0] == i && startpos[1] == j){
                    starting_number += question_number[k]+",";

                }
                else if(direction == "vertical" && startpos[0] == i && startpos[1] == j){
                    starting_number += question_number[k]+",";
                }

            }
            if(starting_number != ""){
                question_number_span = '<span class="question_number">'+starting_number.replace(/(^,)|(,$)/g, "")+'</span>';
            }

            $(row).append('<td>'+question_number_span+'<div class="square letter" data-number="'+this+'" contenteditable="true"></div></td>');
        }
    });
    $("#puzzle").append(row);
});


$(".letter").keyup(function(){
    var this_text = $(this).text();
    if(this_text.length > 1){
    	$(this).text(this_text.slice(0,1));
    }
});

$(".letter").click(function(){
    document.execCommand('selectAll',false,null);

    $(".letter").removeClass("active");
    $(this).addClass("active");

    $(".hint").css("color","initial");

    var question_numbers = String($(this).data("number")).split(",");

    $.each(question_numbers,function(){
        $("#hints .hint:nth-child("+this+")").css("color","red");
    });
});

$("#solve").click(function(){
    if(!$(".letter.active").length)
       return;
	var question_numbers = String($(".letter.active").data("number")).split(",");
    $.each(question_numbers,function(){
        fillAnswer(this);
    });
});

$("#clear_all").click(function(){
    if(!$(".letter.active").length)
       return;
	var question_numbers = String($(".letter.active").data("number")).split(",");
    $.each(question_numbers,function(){
        clearAnswer(this);
    });
});

$("#check").click(function(){
  correct_words=0;
    $("#puzzle td div").css("color","initial");
    for(var i = 0;i < answers.length;i++){
        checkAnswer(i+1);
    }
    console.log("correct words: "+correct_words);
    if(correct_words==answers.length){
      console.log('all correct');
      document.execCommand('selectAll',true,null);
      $(".letter").addClass("solved");
    }
});

$("#clue").click(function(){
    if(!$(".letter.active").length)
       return;
	var question_numbers = String($(".letter.active").data("number")).split(",");
    showClue(question_numbers[0],$(".letter.active").parent().index(),$(".letter.active").parent().parent().index());
});

$("#return").click(function(){
  window.location.href='/exercices.html'
});

function get_direction(question_number){
    for(var i=0;i < grid.length;i++){
    	for(var j=0;j < grid[i].length;j++){
            if(String(grid[i][j]).indexOf(question_number) != -1){
              if(i!=0){
                if(grid[i-1][j] == question_number){
                  return "vertical";
                }
              }
              if(i!=grid.length){
                if(grid[i+1][j] == question_number){
                  return "vertical";
                }
              }
              if(j!=0){
                if(grid[i][j-1] == question_number){
                    return "horizontal";
                }
              }
              if(j!=grid[i].length){
                if(grid[i][j+1] == question_number){
                    return "horizontal";
                }
              }
            }
      }
  }
}

function get_startpos(question_number,direction){
	if(direction == "horizontal"){
       for(var i=0;i < grid.length;i++){
            for(var j=0;j < grid[i].length;j++){

                if(String(grid[i][j]).indexOf(question_number) != -1){
                    return [i,j];
                }
            }
        }
    }

    else if(direction == "vertical"){
       for(var i=0;i < grid.length;i++){
            for(var j=0;j < grid[i].length;j++){
              if(String(grid[i][j]).indexOf(question_number) != -1){
                  return [i,j];
              }
            }
        }
    }
}

function fillAnswer(question_number){
    $("#puzzle td div").css("color","initial");

    var question_answer = answers[question_number-1];
    var direction = get_direction(question_number);
    var startpos = get_startpos(question_number,direction);
    var answer_letters = question_answer.split("");

    if(direction == "horizontal"){
        for(var i = 0; i < answer_letters.length; i++){
            $("#puzzle tr:nth-child("+(startpos[0]+1)+") td:nth-child("+(startpos[1]+1+i)+") div").text(answer_letters[i]);
        }

    }
    else if(direction == "vertical"){
        for(var i = 0; i < answer_letters.length; i++){
          $("#puzzle tr:nth-child("+(startpos[0]+1+i)+") td:nth-child("+(startpos[1]+1)+") div").text(answer_letters[i]);
            // $("#puzzle tr:nth-child("+(startpos[1]+1+i)+") td:nth-child("+(startpos[0]+1)+") div").text(answer_letters[i]);
        }

    }
}

function clearAnswer(question_number){
    $("#puzzle td div").css("color","initial");

    var question_answer = answers[question_number-1];
    var direction = get_direction(question_number);
    var startpos = get_startpos(question_number,direction);
    var answer_letters = question_answer.split("");

    if(direction == "horizontal"){
        for(var i = 0; i < answer_letters.length; i++){
            $("#puzzle tr:nth-child("+(startpos[0]+1)+") td:nth-child("+(startpos[1]+1+i)+") div").text('');
        }
    }
    else if(direction == "vertical"){
        for(var i = 0; i < answer_letters.length; i++){
            $("#puzzle tr:nth-child("+(startpos[0]+1+i)+") td:nth-child("+(startpos[1]+1)+") div").text('');
        }
    }
}

function checkAnswer(question_number){
    var question_answer = answers[question_number-1];
    var direction = get_direction(question_number);
    var startpos = get_startpos(question_number,direction);
    var answer_letters = question_answer.split("");
    var correct_letters=0;

    if(direction == "horizontal"){
        for(var i = 0; i < answer_letters.length; i++){
            if($("#puzzle tr:nth-child("+(startpos[0]+1)+") td:nth-child("+(startpos[1]+1+i)+") div").text() != question_answer[i] && $("#puzzle tr:nth-child("+(startpos[0]+1)+") td:nth-child("+(startpos[1]+1+i)+") div").text() != ""){
                $("#puzzle tr:nth-child("+(startpos[0]+1)+") td:nth-child("+(startpos[1]+1+i)+") div").css("color","red");
            }else{
              correct_letters++;
            }
        }
    }
    else if(direction == "vertical"){
        for(var i = 0; i < answer_letters.length; i++){
          if($("#puzzle tr:nth-child("+(startpos[0]+1+i)+") td:nth-child("+(startpos[1]+1)+") div").text() != question_answer[i] && $("#puzzle tr:nth-child("+(startpos[0]+1+i)+") td:nth-child("+(startpos[1]+1)+") div").text() != ""){
              $("#puzzle tr:nth-child("+(startpos[0]+1+i)+") td:nth-child("+(startpos[1]+1)+") div").css("color","red");
            // if($("#puzzle tr:nth-child("+(startpos[1]+1+i)+") td:nth-child("+(startpos[0]+1)+") div").text() != question_answer[i] && $("#puzzle tr:nth-child("+(startpos[1]+1+i)+") td:nth-child("+(startpos[0]+1)+") div").text() != ""){
            //     $("#puzzle tr:nth-child("+(startpos[1]+1+i)+") td:nth-child("+(startpos[0]+1)+") div").css("color","red");
            }else{
              correct_letters++;
            }
        }
    }
    if(correct_letters==answer_letters.length){
      correct_words++;
    }
}

function showClue(question_number,i,j){
    var question_answer = answers[question_number-1];
    var direction = get_direction(question_number);
    var startpos = get_startpos(question_number,direction);
    var answer_letters = question_answer.split("");

    if(direction == "horizontal"){
        $("#puzzle tr:nth-child("+(j+1)+") td:nth-child("+(i+1)+") div").text(answer_letters[i - startpos[1]]).css("color","initial");
    }
    else if(direction == "vertical"){
       $("#puzzle tr:nth-child("+(j+1)+") td:nth-child("+(i+1)+") div").text(answer_letters[j - startpos[0]]).css("color","initial");
    }
}


async function getData(){
  exercice = 'crossword'
  const response = await fetch('getDB/'+ exercice +'&'+ unitEx);
  const json = await response.json();
  console.log('DB received: '+ json)
  return json;
}
