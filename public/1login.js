function setup(){
  // TUTORIAL:
  //   https://firebase.google.com/docs/database/admin/retrieve-data#nodejs_5
  // https://console.firebase.google.com/u/0/project/database-example-2743f/database/database-example-2743f/data

  //   // Your web app's Firebase configuration
  // var firebaseConfig = {
  //   apiKey: "AIzaSyAS4ihMkN3HgkSadHETVCJyc7JA5Nfo2Z0",
  //   authDomain: "database-example-2743f.firebaseapp.com",
  //   databaseURL: "https://database-example-2743f.firebaseio.com",
  //   projectId: "database-example-2743f",
  //   storageBucket: "database-example-2743f.appspot.com",
  //   messagingSenderId: "160589104484",
  //   appId: "1:160589104484:web:a50c1bc85e047b1477e671",
  //   measurementId: "G-PM9BHW7QS5"
  // };
  // // Initialize Firebase
  // firebase.initializeApp(firebaseConfig);
  // firebase.analytics();
  //
  // console.log(firebase)
  // var db = firebase.database();
  // var usersdb = db.ref('usersdb');
  //
  // // save data
  // var users = [
  //  {
  //    "name": "lluis",
  //    "password": "1"
  //  },
  //  {
  //    "name": "maria",
  //    "password": "1234"
  //  }
  // ]
  //
  // for(let i=0; i<users.length;i++){
  //   usersdb.push(users[i], finished);
  // }
  // function finished(error) {
  //   if (error) {
  //     console.log('ooops');
  //   } else {
  //     console.log('data saved!');
  //   }
  // }

  // // get data, receive again when there's changes
  // // usersdb.on('value', getData, errData);
  // // only read once
  // usersdb.once("value", getData, errData);

  removeElements();
  clear();
  createCanvas(windowWidth, windowHeight);
  background(220);
  usuario=false;
  console.log('Login Page');

  username = createInput('', 'text'); //username input element
  username.position(150,150);
  username.size(200,20);
  textSize(15); //text next to username ekement
  textAlign(RIGHT, TOP);
  text('Username', 130, 150);

  password = createInput('', 'password'); //password input element
  password.position(150, 190);
  password.size(200, 20);
  textSize(15); //text next to password ekement
  textAlign(RIGHT, TOP);
  text('Password', 130, 190);

  login_button = createButton("Login"); //button element
  login_button.position(370 ,190);
  login_button.size(80, 30);
  login_button.mousePressed(checkUser);

}

// function getData(data){
//   var users = data.val();
//   // Grab the keys to iterate over the object
//   var keys = Object.keys(users);
//
//   for (var i = 0; i < keys.length; i++) {
//     var key = keys[i];
//     // Look at each fruit object!
//     var user = users[key];
//     print('name '+user.name)
//     print('pass '+user.password)
//   }
// }
// function errData(err){
//   console.log('error: '+err)
// }

function draw(){
  if(usuario){
    console.log('user correct');
    window.location.href='/2exercices.html';
  }
}

async function checkUser(){
  //retrieve if the user is in the database or not
  console.log('function checkuser');
  let user = {
    username:username.value(),
    password: password.value()
  };
  const data2 = {user};

  //POST
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data2)
  };
  const posting = await fetch('/checkUsr', options);
  const checkpass = await posting.json();
  console.log('checkpass: '+checkpass.status);

  if(checkpass.status == 'succes'){
    console.log('succesfull');
    usuario=true;
  }else if(checkpass.status == 'wrong'){
    console.log('wrongly');
    login_button.style('border-color', '#ff0000');
    usuario=false;
  }else{
    console.log('An error appeared!');
  }
}
