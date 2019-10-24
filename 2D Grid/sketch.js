//2D grid demo
//Donovan Simmons.
//Sept 25, 2019.
//
//Extra For Experts.


let grid;
let rows = 30;
let cols = 30;

function setup() {
  if (windowWidth>windowHeight){
    createCanvas(windowHeight, windowHeight);
  }
  else {
    createCanvas(windowWidth, windowWidth)
  }
  grid = createRandom2dArray(cols, rows);
}

function draw() {
  background(220);
  displayGrid(grid, rows, cols);
}

function windowResized(){
  if (windowWidth>windowHeight){
    createCanvas(windowHeight, windowHeight);
  }
  else {
    createCanvas(windowWidth, windowWidth)
  }
}
function mousePressed() {
  let cellSize = width/cols;

  let xCoord = floor(mouseX / cellSize);
  let yCoord = floor(mouseY / cellSize);
  
  if (grid[yCoord][xCoord] === 1) {
    grid[yCoord][xCoord] = 0;
  }
  else {
    grid[yCoord][xCoord] = 1;
  }
}

function displayGrid(grid, rows, cols) {
  let cellSize = width / cols;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x] === 0) {
        fill(0);
      }
      else {
        fill(255);
      }
      rect(x*cellSize, y*cellSize, cellSize, cellSize);
    }
  }
}

function createRandom2dArray(cols, rows) {
  let randomGrid = [];
  for (let x = 0; x < cols; x++) {
    randomGrid.push([]);
    for (let y = 0; y < rows; y++) {
      if (random(100) < 50) {
        randomGrid[x].push(1);
      }
      else {
        randomGrid[x].push(0);
      }
    }
  }
  return randomGrid;
}

function keyTyped(){
  if (key === "c"){
    for (let x = 0; x < cols; x++){
      for (let y = 0; y < rows; y++){
        if (grid[x][y] === 0){
          grid[x][y] = 1;
        }
      }
    }
  }
  if (key === "r"){
    grid = createRandom2dArray(cols, rows);
  }
}
// let grid = [];


// function setup() {
//   createCanvas(windowWidth, windowHeight);
//   grid = create2dArray(20, 20);
// }

// function draw() {
//   background(220);
//   displayGrid(grid);
  
// }

// function displayGrid(theGrid){
//   //assumes the grid is a square..
//   for (let y = 0; y <theGrid[0].length; y++){
//     for (let x = 0; x < theGrid[0].length; x++){
//       if (theGrid[y][x] === 0){
//         fill(255);
//       }
//       else{
//         fill(0);
//       }
//       let cellSize = width/theGrid[0].length;
//       rect(x*cellSize, y*cellSize, cellSize, cellSize)
//     }
//   }
// }

// function create2dArray(cols, rows){
//   let someArray = [];
//   for (let i = 0; i <cols; i++) {
//     someArray.push([]);
//     for (let j = 0; j < rows; j++){
//       if (random(100) < 50){

//         someArray[i].push(1);
//       }
//       else{
//         someArray[i].push(0);
//       }  
//     }
//   }
//   return someArray
// }


