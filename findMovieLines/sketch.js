let database;
//the character i'm looking for:
//let charID = 'u6523'; //Neo from The Matrix, his ID is u6523
let charID = 'u8950'; //Dorothy from The Wizard of the Oz
//we only need the lines the character say, 
//so we need to remove all the characters before the actual line.
//to do that, we need to find the delimiter before the line
//let del = 'NEO +++$+++ ';
let del = 'DOROTHY +++$+++ ';
let outPutAry = [];
function preload() {
  database = loadStrings('movie_lines.txt', loaded);
}
function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
}

function loaded() {
  for (let i = 0; i < database.length; i++) {
    if (database[i].indexOf(charID) !== -1) {
      let cleanLine = database[i].split(del).pop();
      outPutAry.push(cleanLine);
      //console.log(database[i]);
    }
  }
  console.log(outPutAry);
  saveStrings(outPutAry, 'lines.txt');
}