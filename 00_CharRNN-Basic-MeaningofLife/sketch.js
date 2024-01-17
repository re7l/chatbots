let charRNN; // variable to contain the CharRNN model
let bttn; // a button to push to generate text
let generatedText; // global variable to store the generated content

function preload() {
  charRNN = ml5.charRNN("https://raw.githubusercontent.com/ml5js/ml5-data-and-models/main/models/charRNN/hemingway");
}

function setup() {
  createP("This is an example using ml5.js and CharRNN model trained on a corpus of Ernest Hemingway.")
  createP("What's the meaning of life?");
  createP("Source of data: https://github.com/ml5js/ml5-data-and-models/tree/main/models/charRNN");
  bttn = createButton("GENERATE");
  bttn.mousePressed(generateText);
}

function generateText() {
  let options = {
    seed: "The meaning of life is ", // the begining of the text generation
    length: 200, // 200 characters
    temperature: 0.5 // lower temperature =  more deterministic result, higher temp = more random
  }
  charRNN.generate(options, gotData); // generate text based on the options and go to a callback function when there's result
}

function gotData(err, result) { // the first parameter is the error (if any), the second one is the result generated
  console.log(err); // send the error to the console if there's any error
  console.log(result); // look at the result in the console
  generatedText = result.sample; // pass the result to the global variable, the text is nested under "sample"

  // We can refine the result by telling it to show text before the first period, to avoid incomplete sentences (most of the time) 
  let periodIndex = generatedText.indexOf('.'); // indexOf is a javascript method for finding the index number of a specific element

  // If a period is found, truncate the text up to that point
  if (periodIndex !== -1) { // -1 means the element is not found
    generatedText = generatedText.substring(0, periodIndex + 1); //The substring method in JavaScript is used to extract a portion of a string 
    // and return a new string. It takes two arguments: the starting index and the ending index (optional). 
  }
  createP("The meaning of life is " + generatedText); // display the text in a paragraph, you can also create a canvas and display it in draw
}
function draw() {
}