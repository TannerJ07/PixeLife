const boardWidth = 50
const boardHeight = boardWidth

const cellSize = 12
const canvasSize = boardWidth*cellSize

let grid = {}
let newGrid = {}
let context
let board
let mousedown = false

const colors = {
    air: "rgb(200,200,200)",
    sand: "yellow",
};
const functions = {
    air: null,
    sand: moveSand
}

function moveSand(x,y) {

    //newGrid[1][2] = "sand"
    //grid[x][2] = "sand";
    let direction = Math.floor(Math.random()*3)-1
    if (newGrid[x][y+1] == "air") {
        newGrid[x][y] = "air";
        newGrid[x][y+1] = "sand"
    } else if (newGrid[x+direction][y+1] == "air") {
        newGrid[x][y] = "air";
        newGrid[x+direction][y+1] = "sand"
    }
    
    
    //*/
}
window.onload = function() {
    board = document.getElementById("board")
    board.height = canvasSize
    board.width = canvasSize
    context = board.getContext("2d")
    setGame();
    
    board.onmousedown = function(event) {
        mousedown = true;
        grid[Math.floor(event.offsetX/cellSize)][Math.floor(event.offsetY/cellSize)] = "sand"
    }
    board.onmousemove = function(event) {
        if (mousedown) {
            grid[Math.floor(event.offsetX/cellSize)][Math.floor(event.offsetY/cellSize)] = "sand"
        }
    }
    board.onmouseup = function(event) {
        mousedown = false
        newGrid[Math.floor(event.offsetX/cellSize)][Math.floor(event.offsetY/cellSize)] = "sand"
        //console.log(grid)
    }
    document.addEventListener("contextmenu", event => event.preventDefault());
    
    setInterval(update,1000/60);
}

function update() {
    updateGrid();
    displayBoard();
}

function updateGrid() {
    for (let i = 0; i < boardHeight; i++) {
        newGrid[i] = {};
        for (let j = 0; j < boardWidth; j++) {
            newGrid[i][j] = grid[i][j];
        }
    }//*/
    //newGrid = grid
    for (let j = 0; j < boardHeight; j++) {
        for (let i = 0; i < boardWidth; i++) {
            if (functions[grid[i][j]] && grid[i][j] !== "air") {
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