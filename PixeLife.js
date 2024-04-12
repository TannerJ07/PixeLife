const boardWidth = 50
const boardHeight = 50

const cellSize = 12
const canvasSize = boardWidth*cellSize

let grid = {}
let newGrid = {};
let context;
let board;
let selector
let mousedown = false;
let mousex, mousey;
let element = "sand";
let catagory = "solid";
const colors = {
    air: [200,200,200],
    sand: [255,230,179],
    water: [0,0,255],
    border: [255,0,255],


    solid: [70,70,70],
    liquid: [0,0,255],
};
const functions = {
    air: null,
    sand: moveSand,
    water: moveWater,
    border: null,
}
const type = {
    air: ["liquid","gas"],
    sand: [],
    water: ["liquid"],
    border: [],
}
const elementCatagory = {
    solid: ["sand"],
    liquid: ["water"],
}
const catagories = ["solid","liquid",]

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
    if (type[newGrid[x][y+1]].includes("liquid") && type[newGrid[x+direction][y+1]].includes("gas")) {
        newGrid[x][y] = grid[x+direction][y+1];
        newGrid[x+direction][y+1] = grid[x][y+1];
        newGrid[x][y+1] = "sand"
    } else if (type[newGrid[x][y+1]].includes("liquid")) {
        newGrid[x][y] = grid[x][y+1];
        newGrid[x][y+1] = "sand"
    } else if (type[newGrid[x+direction][y+1]].includes("liquid")) {
        newGrid[x][y] = grid[x+direction][y+1];
        newGrid[x+direction][y+1] = "sand"
    }
}
window.onload = function() {
    board = document.getElementById("board")
    board.height = canvasSize
    board.width = canvasSize
    context = board.getContext("2d")
    selector = document.getElementById("selector")
    setGame();
    
    board.onmousedown = function(e) {
        mousex = Math.floor(e.offsetX/cellSize)
        mousey = Math.floor(e.offsetY/cellSize)
        mousedown = e.buttons;
    }
    board.onmousemove = function(e) {
        mousex = Math.floor(e.offsetX/cellSize)
        mousey = Math.floor(e.offsetY/cellSize)
    }
    board.onmouseup = function() {
        mousedown = null
    }
    board.oncontextmenu = function () { return false; }
    setInterval(update,1000/60);
}

function update() {
    if (mousex > 0 && mousex < boardWidth && mousey > 0 && mousey < boardHeight) {
        if (mousedown==1) {
            grid[mousex][mousey] = element
        }
        if (mousedown==2) {
            grid[mousex][mousey] = "air"
        }
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
            if (functions[grid[i][j]] && grid[i][j] == newGrid[i][j]) {
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
    let catagoryButton;
    for (let i = 0;i<catagories.length;i++) {
        catagoryButton =  document.createElement("button");
        catagoryButton.appendChild(document.createTextNode(catagories[i].toUpperCase()));
        let color = `rgb(
            ${colors[catagories[i]][0]},
            ${colors[catagories[i]][1]},
            ${colors[catagories[i]][2]})`;
        catagoryButton.style.color = color;
        color = `rgba(
            ${colors[catagories[i]][0]},
            ${colors[catagories[i]][1]},
            ${colors[catagories[i]][2]},
            0.5)`
        catagoryButton.style.backgroundColor = `${color}`;
        catagoryButton.style.backgroundColor.opacity = 0.2;
        catagoryButton.addEventListener("click",switchCatagory)
        catagoryButton.setAttribute("id",catagories[i])
        let button;
        for (let j = 0; j<elementCatagory[catagories[i]].length;j++) {
            
            button =  document.createElement("button");
            button.appendChild(document.createTextNode(elementCatagory[catagories[i]][j].toUpperCase()));
            let color = `rgb(
                ${colors[elementCatagory[catagories[i]][j]][0]},
                ${colors[elementCatagory[catagories[i]][j]][1]},
                ${colors[elementCatagory[catagories[i]][j]][2]})`;
                button.style.color = color;
            color = `rgba(
                ${colors[elementCatagory[catagories[i]][j]][0]},
                ${colors[elementCatagory[catagories[i]][j]][1]},
                ${colors[elementCatagory[catagories[i]][j]][2]},
                0.5)`
            button.style.backgroundColor = `${color}`;
            button.style.backgroundColor.opacity = 0.2;
            button.addEventListener("click",switchElement);
            button.setAttribute("id",elementCatagory[catagories[i]][j]);
            button.style.display = "none"
            catagoryButton.appendChild(button);
        }
        selector.appendChild(catagoryButton);
    }
}

function switchCatagory() {
    let children = document.getElementById(catagory).children
    for (let i = 0; i < children.length;i++) {
        children[i].style.display = "none"
    }
    children = this.children
    for (let i = 0; i < children.length;i++) {
        children[i].style.display = "block"
    }
    catagory = this.id;
}

function switchElement() {
    element = this.id;
}

function displayBoard () {
    context.fillRect(0,0,20,20);
    for (let i = 0; i<boardWidth; i++) {
        for (let j = 0; j < boardHeight; j++) {
            context.fillStyle= `rgb(
                ${colors[grid[i][j]][0]},
                ${colors[grid[i][j]][1]},
                ${colors[grid[i][j]][2]})`;
            context.fillRect(i*cellSize,j*cellSize,cellSize,cellSize);
        }
    }
}