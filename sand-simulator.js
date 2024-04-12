const boardWidth = 50
const boardHeight = boardWidth

const cellSize = 12
const canvasSize = boardWidth*cellSize

let grid = {}
let newGrid = {};
let context;
let board;
let mousedown = false;
let mousex, mousey;
let element = "sand";

const colors = {
    air: "rgb(200,200,200)",
    sand: "yellow",
    water: "blue",
    border: "palevioletred",
};
const functions = {
    air: null,
    sand: moveSand,
    water: moveWater,
    border: null,
}
function moveWater(x,y) {
    let direction = Math.floor(Math.random()*3)-1
    if (newGrid[x][y+1] == "air") {
        newGrid[x][y] = "air";
        newGrid[x][y+1] = "water"
    } else if (newGrid[x+direction][y] == "air") {
        newGrid[x][y] = "air";
        newGrid[x+direction][y] = "water"
    }
}

function moveSand(x,y) {
    let direction = Math.floor(Math.random()*3)-1
    if (newGrid[x][y+1] == "air") {
        newGrid[x][y] = "air";
        newGrid[x][y+1] = "sand"
    } else if (newGrid[x+direction][y+1] == "air") {
        newGrid[x][y] = "air";
        newGrid[x+direction][y+1] = "sand"
    }
}
window.onload = function() {
    board = document.getElementById("board")
    board.height = canvasSize
    board.width = canvasSize
    context = board.getContext("2d")
    setGame();
    
    board.onmousedown = function(e) {
        mousex = e.offsetX
        mousey = e.offsetY
        mousedown = e.buttons;
    }
    board.onmousemove = function(e) {
        mousex = e.offsetX
        mousey = e.offsetY
    }
    board.onmouseup = function() {
        mousedown = false
    }
    window.oncontextmenu = function () { return false; }
    setInterval(update,1000/60);
}

function update() {
    if (mousedown==1) {
        grid[Math.floor(mousex/cellSize)][Math.floor(mousey/cellSize)] = element
    }
    if (mousedown==2) {
        grid[Math.floor(mousex/cellSize)][Math.floor(mousey/cellSize)] = "air"
    }
    updateGrid();
    displayBoard();
}

function updateGrid() {
    for (let i = 0; i < boardHeight; i++) {
        newGrid[i] = {};
        for (let j = 0; j < boardWidth; j++) {
            if (i==0||j==0||i==boardWidth-1||j==boardHeight-1) {
                newGrid[i][j] = "border";
            } else {
                newGrid[i][j] = grid[i][j];
            }
        }
    }//*/
    //newGrid = grid
    for (let j = 0; j < boardHeight; j++) {
        for (let i = 0; i < boardWidth; i++) {
            if (functions[grid[i][j]]) {
                functions[grid[i][j]](i,j);
            }
        }
    }
    for (let i = 0; i < boardHeight; i++) {
        grid[i] = {};
        for (let j = 0; j < boardWidth; j++) {
            grid[i][j] = newGrid[i][j];
        }
    }
}

function setGame (){
    board = document.getElementById("board")
    context = board.getContext("2d")
    for(let i = 0;i<boardWidth;i++) {
        grid[i] = {};
        for(let j =0;j<boardHeight;j++) {
            grid[i][j] = "air";
        }
    }
}

function displayBoard () {
    context.fillRect(0,0,20,20);
    for (let i = 0; i<boardWidth; i++) {
        for (let j = 0; j < boardHeight; j++) {
            context.fillStyle= colors[grid[i][j]];
            context.fillRect(i*cellSize,j*cellSize,cellSize,cellSize);
        }
    }
}