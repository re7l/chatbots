let data; //variable for json data
let input; //variable for input field
let sendBttn; //variable for send button
let answer = ""; //variable for the answer from the chatbot

//load the JSON file
function preload() {
  data = loadJSON("chatbots.json");
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  //input field
  input = createInput("");
  input.size(width / 2, 40);
  input.position(width / 4, height / 4);
  //button to send input
  sendBttn = createButton("send");
  sendBttn.size(100, 30);
  sendBttn.position(width / 4, height / 4 + input.height + 10);
  sendBttn.mousePressed(answerMe); //callback to let the chatbot respond
  textAlign(CENTER, CENTER);
  rectMode(CENTER);
  console.log(data);
}
function keyPressed(){
  if(keyCode===ENTER){
    answerMe(); //let the chatbot respond when enter key pressed
  }
}

function draw() {
  background("IndianRed");
  fill("black");
  textSize(20);
  text("Ask me about the class Chatbots for Art's Sake", width / 2, 50);

  //display the answer from the chatbot
  fill("Ivory");
  text(answer, width / 2, (height / 3) * 2, width - 20);
}

function answerMe() {
  //prepare the input string for analysis
  let inputStr = input.value();
  inputStr = inputStr.toLowerCase();

  //loop through the answers array and match responses to triggers
  loop1: for (let i = 0; i < data.brain.length; i++) {
    loop2: for (let j = 0; j < data.brain[i].triggers.length; j++) {
      if (inputStr.indexOf(data.brain[i].triggers[j]) !== -1) {
        answer = random(data.brain[i].responses);
        break loop1; //break out of the loop once a match is found to prevent the program to keep looping to the last group
      } else {
        answer = random(data.catchall);
      }
    }
  }
  input.value("");//clears the input field once an answer occurs
}
