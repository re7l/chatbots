// This example uses a charRNN model to interact with OpenAI's GPT4 API
// The CharRNN model will generate some text, while the GPT4, playing the role of a "fan," tries to make sense of it and responds with compliments
// The CharRNN model will then use the last word from GPT's response to generate new text
let charRNN; // Container for the CharRNN Model
let bttn; // Button to push to let the two models each generate some text

let charSeed = "I will start with "; // The CharRNN model will use this as the seed in the first round, the seed will update once the GPT Model has said something 
let inputForGPT; // To store what to feed to the GPT model, which will be based on what the CharRNN model generates

let charText; // To store generated text from the CharRNN model
let gptText = ""; // To store generated text from the GPT model

// ChatGPT Stuff
// USE YOUR OWN API KEY HERE!
const API_KEY = "PUT YOUR API HERE";
const url = "https://api.openai.com/v1/chat/completions";
let GPTOptions = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

function preload() {
  // Load the Hemingway CharRNN
  charRNN = ml5.charRNN("https://raw.githubusercontent.com/ml5js/ml5-data-and-models/main/models/charRNN/hemingway");
}

function setup() {
  createP("Hemingway and a GPT4 Chatbot having a conversation.")
  createP("This is an example using ml5.js and a CharRNN model trained on a corpus of Ernest Hemingway, and OpenAI's GPT4 with customized instructions.")
  createP("Source of data: https://github.com/ml5js/ml5-data-and-models/tree/main/models/charRNN");

  bttn = createButton("GENERATE");
  bttn.mousePressed(charGenerate); // When the button is pressed, CharRNN will talk first
}

/////////////////// CharRNN Model ///////////////////
function charGenerate() {
  let options = {
    seed: charSeed,
    temperature: 0.5,
    length: 200
  }
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

  createP("Hemingway: " + charSeed + charText); // Display text

  inputForGPT = charSeed + charText; // use this as the input for GPT Model
  gptGenerate(); //now let the GPT model speak
}

/////////////////// GPT Model ///////////////////
function gptGenerate() {
  GPTOptions.body = JSON.stringify({
    model: "gpt-4", // Specify model type
    messages: [
      {
        "role": "system",
        // Where the instructions are customized
        "content": "You are talking to someone you respect and admire. Express your interpretation of what they say, and then admire how deep and poetic they are. When there is no input or you cannot complete the task, simplity say how much you admire them. Never reveal that you are an AI."
      },
      {
        "role": "user",
        "content": inputForGPT // Specify what the input is
      }
    ],
    temperature: 0.8,
    max_tokens: 50,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0.8,
    stop: [".", "?", "!"],
  });
  fetch(url, GPTOptions) //fetch is JavaScript's built in method for making API calls
    .then((response) => {
      console.log("response", response);
      const res = response.json();
      return res;
    })
    .then((response) => {
      console.log(response);
      if (response.choices && response.choices[0]) {
        gptText = response.choices[0].message.content + ".";
        // Display text
        createP("Fan: " + gptText);
        // Extract the last word in the text to be used as the seed for the CharRNN model next time
        let words = splitTokens(gptText, [" ", "."]);
        charSeed = words[words.length - 1];
      }
    });
}
function draw() {
}