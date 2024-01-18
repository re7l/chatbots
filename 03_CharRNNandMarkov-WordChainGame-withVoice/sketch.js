// This example uses one charRNN model and one Markov Chain
// Each model will generate text starting with the LAST WORD the other model said.
// p5.speech is used to give each model a voice
let charRNN; // Container for the CharRNN Model
let rm;  // Container for the Markov Chain Model
let data; // Container for the text data used in Markov Chain

let bttn; // Button to push to let the two models each generate some text

let seedOne = "I will start with "; // The CharRNN model will use this as the seed in the first round, the seed will update once the Markov Model has said something 
let seedTwo; // To store seeds for the Markov Model, which will be the LAST WORD the CharRNN model said in the previous round

let charText; // To store generated text from the CharRNN model
let markovText; // To store generated text from the Markov model

let voice = new p5.Speech(); // for p5 speech synthesis

function preload() {
  // Load the Hemingway CharRNN
  charRNN = ml5.charRNN("https://raw.githubusercontent.com/ml5js/ml5-data-and-models/main/models/charRNN/hemingway");
  // Load the text data (Grimms' Fairy Tales) for Markov Chain 
  data = loadStrings("data.txt"); //markov chain
}

function setup() {
  createP("Hemingway and the Grimms' Fairy Tales take turns saying things based on each other's words.")
  createP("This is an example using ml5.js and CharRNN model trained on a corpus of Ernest Hemingway, and a Markov Chain model based on The Project Gutenberg eBook of Grimms’ Fairy Tales.")
  createP("Sources of data: https://github.com/ml5js/ml5-data-and-models/tree/main/models/charRNN");
  createP("https://www.gutenberg.org/ebooks/2591");

  rm = RiTa.markov(3); // Create a RiTa Markov Chain Model with a specified N-Value
  rm.addText(data.join(" ")); // Add data to the Markov Chain, the text is "joined" into one text string

  bttn = createButton("GENERATE");
  bttn.mousePressed(charGenerate); // When the button is pressed, CharRNN will talk first
}
/////////////////// CharRNN Model ///////////////////
function charGenerate() {
  let options = {
    seed: seedOne,
    temperature: 0.5,
    length: 200
  }
  //let the first model generate some text
  charRNN.generate(options, charGotData);
}
function charGotData(err, result) {
  console.log(err); // send the error to the console if there's any error
  console.log(result); // look at the result in the console
  charText = result.sample; // pass the result to the global variable, the text is nested under "sample"

  // We can refine the result by telling it to show text before the first period, to avoid incomplete sentences (most of the time) 
  let periodIndex = charText.indexOf('.'); // indexOf is a javascript method for finding the index number of a specific element
  // If a period is found, truncate the text up to that point
  if (periodIndex !== -1) { // -1 means the element is not found
    charText = charText.substring(0, periodIndex + 1); //The substring method in JavaScript is used to extract a portion of a string 
    // and return a new string. It takes two arguments: the starting index and the ending index (optional). 
  }

  createP("Hemingway: " + seedOne + charText); // Display text
  voice.stop(); // stop any current utterance if any (to avoid adding too much to the queue)
  voice.setVoice("Bad News");
  voice.speak(seedOne + charText);

  // Now we need to extract the last word from the sentence
  // And use it as the seed for the Markov Model
  let words = splitTokens(charText, [" ", "."]); // splitTokens turn a text string into an array of words using specified delimeters
  seedTwo = words[words.length - 1]; // Feed the last word in the array into seedTwo
  setTimeout(markovGenerate, 10000); // After ten seconds, let markov generate
}

/////////////////// Markov Chain ///////////////////
function markovGenerate() {
  try { // Use the RiTa method to try generating text using seedTwo
    markovText = rm.generate({
      seed: seedTwo,
    });
    if (!markovText) { // If it's impossible to generate text using the specific seed
      throw new Error("failed");
    }
  } catch (error) { // Console log the error and output a "catchall" message
    console.log(error.message);
    markovText =
      "I just do not understand you.";
  }
  createP("Grimms: " + markovText); // Display the text
  voice.stop(); // stop any current utterance if any (to avoid adding too much to the queue)
  voice.setVoice("Google US English");
  voice.speak(markovText);
  // Extract the last word in the text to be used as the seed for the CharRNN model next time
  let words = splitTokens(markovText, [" ", "."]);
  seedOne = words[words.length - 1];
}

function draw() {
}