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
  update();
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

function createEmptyGrid(){
  let emptyGrid = [];
  for (let x = 0; x < cols; x++){
    emptyGrid.push([]);
    for (let y = 0; y < rows; y++){
      emptyGrid[x].push(0)
    }
    }
    return emptyGrid;
  }


function update(){
  let nextTurn = createEmptyGrid();

  for (let x = 0; x < cols; x++){
    for (let y = 0; y < rows; y++){
      let neighbors = 0;
      //loop around the neighbor spots...
      for (let i = -1; i <= 1; i++){
        for (let j = -1; j <= 1; j++){
          //deal with edge cases
          if (x+i >= 0 && x+i < cols && y+j >= 0 && y+j < rows){
            neighbors += grid[y+j][x+i];
          }
        }
      }
      //don't count self as a neighbor
      neighbors -= grid[y][x];

      //apply rules!
      if (grid[y][x] === 1){ //currently alive
        if (neighbors === 2 || neighbors === 3){
          nextTurn[y][x] = 1;
        }
        else {
          nextTurn[y][x] = 0;
        }
      }
      if (grid[y][x] === 0){//currently dead
        if (neighbors === 3){
          nextTurn[y][x] = 1;
        }
        else{
          nextTurn[y][x] = 0;
        }
      }
    }
  }
  grid = nextTurn;
}

function displayGrid(grid, rows, cols) {
  let cellSize = width / cols;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x] === 0) {
        fill(255);
      }
      else {
        fill(0);
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
    grid = createEmptyGrid();
  }
  if (key === "r"){
    grid = createRandom2dArray(cols, rows);
  }

  if (key === " "){
    update();
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



