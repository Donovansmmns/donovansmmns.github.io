// WASD in Grid Demo

let grid;
let rows = 9;
let cols = 9;
let playerX = 0;
let playerY = 0;

function setup() {
  if (windowWidth > windowHeight) {
    createCanvas(windowHeight, windowHeight);
  }
  else {
    createCanvas(windowWidth, windowWidth);
  }
  grid = createEmptyGrid(cols, rows);
  grid[playerY][playerX] = "the guy";
}

function draw() {
  background(220);
  displayGrid(grid, rows, cols);
}

function windowResized() {
  if (windowWidth > windowHeight) {
    createCanvas(windowHeight, windowHeight);
  }
  else {
    createCanvas(windowWidth, windowWidth);
  }
}

function keyTyped() {
  // remove player from current spot
  grid[playerY][playerX] = 0;

  // move the player
  if (key === "w" && playerY > 0) { 
    playerY -= 1;
  }
  if (key === "s" && playerY < rows - 1) {
    playerY += 1;
  }
  if (key === "d" && playerX < cols - 1) {
    playerX += 1;
  }
  if (key === "a" && playerX > 0) {
    playerX -= 1;
  }

  // put player back into grid
  grid[playerY][playerX] = "the guy";
}

function createEmptyGrid() {
  let emptyGrid = [];
  for (let x = 0; x < cols; x++) {
    emptyGrid.push([]);
    for (let y = 0; y < rows; y++) {
      emptyGrid[x].push(0);
    }
  }
  return emptyGrid;
}

function displayGrid(grid, rows, cols) {
  let cellSize = width / cols;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (y === playerY && x === playerX) {
        fill("green");
      }
      else if (y % 2 !== 0 && x % 2 !== 0){
        grid[y][x] = 1;
        fill(0);
      }
      else{
        fill(255);
      }
      rect(x*cellSize, y*cellSize, cellSize, cellSize);
    }
  }
}