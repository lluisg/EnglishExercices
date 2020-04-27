async function getData(){
  exercice = 'search_puzzle'
  const response = await fetch('getDB/'+ exercice +'&'+ unitEx);
  const json = await response.json();
  console.log('DB received: '+ json)
  return json;
}


//
//
//
//
// function createButtonsInterval(x,y,n,vector, startingPointX,startingPointY, writing){
//   //function to create n buttons uniformously inside x*y and save them in the vector array that will show as input the writing
//   var grupos, initial;
//
//   for(var j=1;j<=2;j++){
//     if(j==1){ //starts at 0 until the less #/2
//       grupos=n-floor(n/2);
//       initial=0;
//     }else{ //starts on the other until the end
//       grupos=floor(n/2);
//       initial=n-grupos;
//     }
//     for(let i=0;i<grupos;i++){
//       vector[i+initial] = createButton(writing[i+initial]);
//       vector[i+initial].position((((j-1)*3)+1)*x+startingPointX, ((2*i)+1)*y+startingPointY);
//       vector[i+initial].size(2*x,y);
//       vector[i+initial].value(0);
//     }
//   }
// }
//
// async function checkUser(){
//   //retrieve if the user is in the database or not
//   console.log('function checkuser');
//   let sql= "SELECT * FROM users WHERE name = \""+passwordname.value()+"\" AND password = \""+password.value()+"\"";
//   const data2 = { sql };
//
//   //POST
//   const options = {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(data2)
//   };
//   const posting = await fetch('/checkUsr', options);
//   const checkpass = await posting.json();
//   console.log('checkpass: '+checkpass.status);
//
//   if(checkpass.status == 'succes'){
//     usuario=true;
//   }else if(checkpass.status == 'wrong'){
//     button.style('border-color', '#ff0000');
//     usuario=false;
//   }else{
//     console.log('An error appeared!');
//   }
// }
//
// function putExBlue(){
//   //put the exercises buttons in blue when you click them and its value to 1
//   exercices.forEach(function(ex){
//     //hide all the unit buttons until one exercice is pressed
//     ex.style('background-color','');
//     ex.value(0);
//   });
//   this.value(1);
//   this.style('background-color','#5064ad');
//   for(let i=0;i<numberUnits;i++){
//     units[i].show();
//   }
// }
// function putUnitsBlue(){
//   //put the unit buttons in blue when you click them and its value to 1
//   this.value(1);
//   this.style('background-color','#5064ad');
// }
//
// function loginOut(){
//   state=login;
//   reset();
// }
//
//
// //GET AND POST
// async function getData(sql){
//   //GET
//   const data3 = 'other/'+sql;
//   const response = await fetch('db/'+sql);
//   const json = await response.json();
//   console.log('Get data: '+json);
//   return json;
// }
//
// async function postData(sql){
//   const data2 = { sql };
//   //POST
//   const options = {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(data2)
//   };
//   const posting = await fetch('/checkUsr', options);
//   const postresult = await posting.json();
//   console.log('postdata: '+postresult.status);
//   // return postresult;
// }
