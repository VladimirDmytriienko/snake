const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "white";
const snakeColor = "lightgreen";
const snakeBorder = "black";
const foodColor = "red";
const unitSize = 20;
let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;
let snake = [
  { x: unitSize * 4, y: 0 },
  { x: unitSize * 3, y: 0 },
  { x: unitSize * 2, y: 0 },
  { x: unitSize, y: 0 },
  { x: 0, y: 0 },
];


const modal = document.getElementById("myModal");
function displayModal() {
  modal.style.display = "flex";
}
modal.style.display = "flex";

const openBtn = document.getElementById("openModal");
const closeBtn = document.getElementById("closeModal");
const startGameBtn = document.getElementById("startGame");

const playerNameInput = document.getElementById("playerName");
const difficultySelect = document.getElementById("difficulty");

var playerName = ""; 
const selectedDifficulty = ""; 


window.onload = function() {
    modal.style.display = "flex";
}

openBtn.onclick = function() {
    modal.style.display = "flex";
}

closeBtn.onclick = function() {
    modal.style.display = "none";
}

startGameBtn.onclick = function() {
  console.log("BTN PRESSED");
  playerName = playerNameInput.value; 
  currentDifficulty = difficultySelect.value; 

  if (playerName.trim() === "") {
      alert("Enter name!");
  } else {
      modal.style.display = "none";
      
      gameStart();
  }
}



window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);

const EASY_SPEED = 75; 
const MEDIUM_SPEED = 50;
const HARD_SPEED = 25; 





function gameStart() {
  running = true;
  
  renderPlayerData();
  const playerNameDisplay = document.getElementById("playerNameDisplay");
  const difficultyDisplay = document.getElementById("difficultyDisplay");

  playerNameDisplay.textContent = "Player Name: " + playerName;
  difficultyDisplay.textContent = "Difficulty: " + currentDifficulty
  scoreText.textContent = score;
  createFood();
  drawFood();
  nextTick();
}

//////////////
function nextTick() {
  if (running) {
    let speed;
    if (currentDifficulty === "easy") {
      speed = EASY_SPEED;
    } else if (currentDifficulty === "medium") {
      speed = MEDIUM_SPEED;
    } else if (currentDifficulty === "hard") {
      speed = HARD_SPEED;
    }

    setTimeout(() => {
      clearBoard();
      drawFood();
      moveSnake();
      drawSnake();
      checkGameOver();
      nextTick();
    }, speed);
  } else {
    displayGameOver();
  }
}


function clearBoard() {
  ctx.fillStyle = boardBackground;
  ctx.fillRect(0, 0, gameWidth, gameHeight);
}
function createFood() {
  function randomFood(min, max) {
    const randNum =
      Math.floor(Math.random() * ((max - min) / unitSize)) * unitSize;
    return randNum;
  }
  foodX = randomFood(0, gameWidth);
  foodY = randomFood(0, gameHeight);
}
function drawFood() {
  ctx.fillStyle = foodColor;
  ctx.fillRect(foodX, foodY, unitSize, unitSize);
}
function moveSnake() {
  const head = { x: snake[0].x + xVelocity, y: snake[0].y + yVelocity };

  snake.unshift(head);
  //if food is eaten
  if (snake[0].x == foodX && snake[0].y == foodY) {
    score += 1;
    scoreText.textContent = score;
    createFood();
  } else {
    snake.pop();
  }
}
function drawSnake() {
  ctx.fillStyle = "blue"; 
  ctx.strokeStyle = snakeBorder;
  snake.forEach((snakePart, index) => {
   
    if (index === 0) {
     
      ctx.fillStyle = "yellow";
    }
    ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
    ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
    
    ctx.fillStyle = snakeColor;
  });
}

function changeDirection(event) {
  const keyPressed = event.keyCode;
  const LEFT = 37;
  const UP = 38;
  const RIGHT = 39;
  const DOWN = 40;

  const goingUp = yVelocity == -unitSize;
  const goingDown = yVelocity == unitSize;
  const goingRight = xVelocity == unitSize;
  const goingLeft = xVelocity == -unitSize;

  switch (true) {
    case keyPressed == LEFT && !goingRight:
      xVelocity = -unitSize;
      yVelocity = 0;
      break;
    case keyPressed == UP && !goingDown:
      xVelocity = 0;
      yVelocity = -unitSize;
      break;
    case keyPressed == RIGHT && !goingLeft:
      xVelocity = unitSize;
      yVelocity = 0;
      break;
    case keyPressed == DOWN && !goingUp:
      xVelocity = 0;
      yVelocity = unitSize;
      break;
  }
}
function checkGameOver() {
  const maxX = gameWidth - unitSize;
  const maxY = gameHeight - unitSize;

  if (snake[0].x < 0) {
    snake[0].x = maxX;
  }
  if (snake[0].x > maxX) {
    snake[0].x = 0;
  }
  if (snake[0].y < 0) {
    snake[0].y = maxY;
  }
  if (snake[0].y > maxY) {
    snake[0].y = 0;
  }

  for (let i = 1; i < snake.length; i += 1) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      running = false;
    }
  }
}

function getPlayerDataFromLocalStorage() {
  const storedData = localStorage.getItem('playerData');
  return storedData ? JSON.parse(storedData) : [];
}


function savePlayerDataToLocalStorage(playerData) {
  const existingData = getPlayerDataFromLocalStorage();
  const existingPlayer = existingData.find(player => player.name === playerData.name);

  if (existingPlayer) {

    existingPlayer.score = playerData.score;
    existingPlayer.difficulty = playerData.difficulty;
  } else {

    existingData.push(playerData);
  }

  localStorage.setItem('playerData', JSON.stringify(existingData));
}

function displayGameOver() {
  ctx.font = "50px MV Boli";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER!", gameWidth / 2, gameHeight / 2);
  running = false;

  if (playerName) {
    const playerData = {
      name: playerName,
      difficulty: currentDifficulty,
      score: score
    };


    savePlayerDataToLocalStorage(playerData);


    renderPlayerData();
  }

  resetGame(); 
}



const allPlayerData = getPlayerDataFromLocalStorage();
console.log(allPlayerData);

// ...

// Функция для очистки холста
function clearBoard() {
  ctx.fillStyle = boardBackground;
  ctx.fillRect(0, 0, gameWidth, gameHeight);
}
function resetGame() {
  score = 0;
  xVelocity = unitSize;
  yVelocity = 0;
  snake = [
    { x: unitSize * 4, y: 0 },
    { x: unitSize * 3, y: 0 },
    { x: unitSize * 2, y: 0 },
    { x: unitSize, y: 0 },
    { x: 0, y: 0 },
  ];
  gameStart();
}


function getPlayerDataFromLocalStorage() {
  const storedData = localStorage.getItem('playerData');
  return storedData ? JSON.parse(storedData) : [];
}


function renderPlayerData() {
  const playerData = getPlayerDataFromLocalStorage();
  const container = document.getElementById('playerDataContainer'); 
  const selectedDifficulty = difficultySelect.value; 
  const filteredAndSortedPlayers = playerData
    .filter((player) => player.difficulty === selectedDifficulty)
    .sort((a, b) => b.score - a.score); 
  container.innerHTML = '';

 
  filteredAndSortedPlayers.forEach((player, index) => {
    const playerElement = document.createElement('div');
    playerElement.innerHTML = `${index + 1}: ${player.name}, Difficulty: ${player.difficulty}, Score: ${player.score}`;
    container.appendChild(playerElement);
  });
}
function resetGame() {
  score = 0;
  xVelocity = unitSize;
  yVelocity = 0;
  snake = [
    { x: unitSize * 4, y: 0 },
    { x: unitSize * 3, y: 0 },
    { x: unitSize * 2, y: 0 },
    { x: unitSize, y: 0 },
    { x: 0, y: 0 },
  ];
  clearBoard();
  displayModal(); 
}



