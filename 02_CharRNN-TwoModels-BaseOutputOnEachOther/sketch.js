// This example uses two charRNN models, and asks them to generate sentences using the other model's previous output as a seed
let charRNNOne; // Container for the first model
let charRNNTwo; // Container for the second model

let bttn; // Button to push to let the two models each generate one sentence

let seedOne = "I will start with "; // The first model will use this as the seed in the first round, the seed will update once Model Two has said something 
let seedTwo; // To store seeds for Model Two, which is based on what Model One said in the previous round

let textOne; // To store generated text from the first model
let textTwo; // To store generated text from the second model

function preload() {
  // Load the Hemingway model into the first one
  charRNNOne = ml5.charRNN("https://raw.githubusercontent.com/ml5js/ml5-data-and-models/main/models/charRNN/hemingway");
  // Load the Woolf model into the second one
  charRNNTwo = ml5.charRNN("https://raw.githubusercontent.com/ml5js/ml5-data-and-models/main/models/charRNN/woolf");
}

function setup() {
  // Some explainer text
  createP("Woolf and Hemingway take turns saying things based on each other's sentences.")
  createP("This is an example using ml5.js and CharRNN models trained on a corpus of Virginia Woolf and a corpus of Ernest Hemingway.")
  createP("Source of data: https://github.com/ml5js/ml5-data-and-models/tree/main/models/charRNN");

  bttn = createButton("GENERATE");
  bttn.mousePressed(generateTextOne); // when the button is pressed, Model One will first generate something
}

/////////////////// Model One ///////////////////
function generateTextOne() {
  let options = {
    seed: seedOne,
    temperature: 0.5,
    length: 200
  }
  //let the first model generate some text
  charRNNOne.generate(options, gotDataOne);
}
function gotDataOne(err, result) {
  console.log(err); // send the error to the console if there's any error
  console.log(result); // look at the result in the console
  textOne = result.sample; // pass the result to the global variable, the text is nested under "sample"

  // We can refine the result by telling it to show text before the first period, to avoid incomplete sentences (most of the time) 
  let periodIndex = textOne.indexOf('.'); // indexOf is a javascript method for finding the index number of a specific element
  // If a period is found, truncate the text up to that point
  if (periodIndex !== -1) { // -1 means the element is not found
    textOne = textOne.substring(0, periodIndex + 1); //The substring method in JavaScript is used to extract a portion of a string 
    // and return a new string. It takes two arguments: the starting index and the ending index (optional). 
  }

  createP("Hemingway: " + seedOne + textOne); // Hemingway is the first model
  seedTwo = textOne; // Pass what the first model says into the seed for Model Two
  generateTextTwo(); //now let the second model speak
}

/////////////////// Model Two ///////////////////
function generateTextTwo() {
  let options = {
    seed: seedTwo,
    temperature: 0.5,
    length: 200
  }
  //let the second model generate some text
  charRNNTwo.generate(options, gotDataTwo);
}
function gotDataTwo(err, result) {
  console.log(err); // send the error to the console if there's any error
  console.log(result); // look at the result in the console
  textTwo = result.sample; // pass the result to the global variable, the text is nested under "sample"

  // We can refine the result by telling it to show text before the first period, to avoid incomplete sentences (most of the time) 
  let periodIndex = textTwo.indexOf('.'); // indexOf is a javascript method for finding the index number of a specific element
  // If a period is found, truncate the text up to that point
  if (periodIndex !== -1) { // -1 means the element is not found
    textTwo = textTwo.substring(0, periodIndex + 1); //The substring method in JavaScript is used to extract a portion of a string 
    // and return a new string. It takes two arguments: the starting index and the ending index (optional). 
  }

  createP("Woolf: " + seedTwo + textTwo); // Woolf is the second model
  seedOne = textTwo; // Update seedOne with what Model Two says
}
function draw() {
}