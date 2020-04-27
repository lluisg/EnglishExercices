function setup(){

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

function draw(){
  if(usuario){
    console.log('user correct');
    window.location.href='/exercices.html';
  }
}

function keyPressed() {
  if (keyCode === ENTER) {
    checkUser();
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
