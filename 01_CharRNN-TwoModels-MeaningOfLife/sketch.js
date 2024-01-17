// This example compares two charRNN models, and asks them to generate sentences starting with "The meaninf of life is "
let charRNNOne; // Container for the first model
let charRNNTwo; // Container for the second model
let bttnOne; // Button for the first model to generate text
let bttnTwo; // Button for the second model to generate text
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
  createP("Woolf and Hemingway on the Meaning of Life")
  createP("This is an example using ml5.js and CharRNN models trained on a corpus of Virginia Woolf and a corpus of Ernest Hemingway.")
  createP("Source of data: https://github.com/ml5js/ml5-data-and-models/tree/main/models/charRNN");
  createP("What's the meaning of life?");
  // Model One
  bttnOne = createButton("Hemingway");
  bttnOne.mousePressed(generateTextOne);
  // Model Two
  bttnTwo = createButton("Woolf");
  bttnTwo.mousePressed(generateTextTwo)
}

/////////////////// Model One ///////////////////
function generateTextOne() {
  let options = {
    seed: "The meaning of life is ", // the begining of the text generation
    temperature: 0.5, // 200 characters
    length: 200 // lower temperature =  more deterministic result, higher temp = more random
  }
  charRNNOne.generate(options, gotDataOne); // generate text based on the options and go to a callback function when there's result
}
function gotDataOne(err, result) { // the first parameter is the error (if any), the second one is the result generated
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
  createP("Hemingway thinks the meaning of life is " + textOne); // display the text in a paragraph, you can also create a canvas and display it in draw
}

/////////////////// Model Two ///////////////////
function generateTextTwo() {
  let options = {
    seed: "The meaning of life is ", // the begining of the text generation
    temperature: 0.5, // 200 characters
    length: 200 // lower temperature =  more deterministic result, higher temp = more random
  }
  charRNNTwo.generate(options, gotDataTwo); // generate text based on the options and go to a callback function when there's result
}
function gotDataTwo(err, result) { // the first parameter is the error (if any), the second one is the result generated
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
  createP("Woolf thinks the meaning of life is " + textTwo); // display the text in a paragraph, you can also create a canvas and display it in draw

}

function draw() {
}
