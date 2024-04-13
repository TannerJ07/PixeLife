const boardWidth = 100
const boardHeight = boardWidth

const cellSize = 8
const canvasSize = boardWidth*cellSize

let grid = {}
let newGrid = {};
let context;
let board;
let selector
let mousedown = false;
let mouseSize = 1;
let mousex, mousey;
let element = "sand";
let doMouse = true;
const colors = {
    air: [200,200,200],
    sand: [255,230,179],
    water: [0,0,255],
    border: [255,0,255],
    fire: [255,0,0],
    lava: [255,133,0],
    steam: [80,80,80],
    dirt: [150,40,0],
    mud: [100,40,0],
    heatBlock: [200,0,0],
    duplicator: [150,0,255],

    solid: [70,70,70],
    liquid: [0,0,255],
    gas: [255,255,255],
    plasma: [255,100,0],
    special: [255,0,255],
};
const functions = {
    air: null,
    sand: moveSand,
    water: moveWater,
    lava: moveLava,
    fire: moveFire,
    steam: moveSteam,
    dirt: moveDirt,
    mud: moveMud,
    duplicator: moveDuplicator,
    heatBlock: null,
    border: null,
}
const type = {
    air: ["liquid","gas"],
    sand: [],
    water: ["liquid"],
    lava: ["liquid","hot","superHot"],
    fire: ["hot"],
    steam: ["gas","liquid"],
    heatBlock: ["hot"],
    dirt: [],
    mud: [],
    border: [],
    duplicator: [],
}
const elements = ["air","water","lava","fire","dirt","mud","sand","steam","heatBlock","border","duplicator"]

function moveSteam(x,y) {
    let direction = Math.floor(Math.random()*3)-1
    if (Math.random() >0.98) {
        newGrid[x][y] = "water";
        return
    } else if (type[newGrid[x+direction][y-1]].includes("liquid")) {
        newGrid[x][y] = newGrid[x+direction][y-1];
        newGrid[x+direction][y-1] = "steam"
    } else if (type[newGrid[x][y-1]].includes("liquid")) {
        newGrid[x][y] = newGrid[x][y-1];
        newGrid[x][y-1] = "steam"
    } else if (type[newGrid[x+direction][y]].includes("liquid")) {
        newGrid[x][y] = newGrid[x+direction][y];
        newGrid[x+direction][y] = "steam"
    }
}

function moveDirt(x,y) {
    for (let i = -1; i < 2; i ++) {
        for (let j = -1; j < 2; j++) {
            if (grid[i+x][j+y] === "water") {
                newGrid[x][y] = "mud";
                grid[i+x][j+y] = "air";
                return
            }
        }
    }
    let direction = Math.floor(Math.random()*3)-1
    if (type[newGrid[x][y+1]].includes("liquid") && type[newGrid[x+direction][y+1]].includes("gas")) {
        newGrid[x][y] = grid[x+direction][y+1];
        newGrid[x+direction][y+1] = grid[x][y+1];
        newGrid[x][y+1] = "dirt"
    } else if (type[newGrid[x][y+1]].includes("liquid")) {
        newGrid[x][y] = grid[x][y+1];
        newGrid[x][y+1] = "dirt"
    } else if (type[newGrid[x+direction][y+1]].includes("liquid")) {
        newGrid[x][y] = grid[x+direction][y+1];
        newGrid[x+direction][y+1] = "dirt"
    }
}

function moveMud(x,y) {
    for (let i = -1; i < 2; i ++) {
        for (let j = -1; j < 2; j++) {
            if (type[grid[i+x][j+y]].includes("hot")) {
                newGrid[x][y] = "dirt";
                return
            }
        }
    }
    let direction = Math.floor(Math.random()*3)-1
    if (type[newGrid[x][y+1]].includes("liquid") && type[newGrid[x+direction][y+1]].includes("gas")) {
        newGrid[x][y] = grid[x+direction][y+1];
        newGrid[x+direction][y+1] = grid[x][y+1];
        newGrid[x][y+1] = "mud"
    } else if (type[newGrid[x][y+1]].includes("liquid")) {
        newGrid[x][y] = grid[x][y+1];
        newGrid[x][y+1] = "mud" }
}

function moveFire(x,y) {
    let direction = Math.floor(Math.random()*3)-1
    if (Math.random() >0.93) {
        newGrid[x][y] = "air";
        return
    } else if (newGrid[x+direction][y-1] == "air") {
        newGrid[x][y] = "air";
        newGrid[x+direction][y-1] = "fire"
    }else if (newGrid[x][y-1] == "air") {
        newGrid[x][y] = "air";
        newGrid[x][y-1] = "fire"
    }
}

function moveWater(x,y) {
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            if (type[grid[x+i][y+j]].includes("hot")) {
                newGrid[x][y] = "steam";
                return
            }
        }
    }
    let direction = Math.floor(Math.random()*3)-1
    if (newGrid[x][y+1] == "air") {
        newGrid[x][y] = "air";
        newGrid[x][y+1] = "water"
    } else if (newGrid[x+direction][y] == "air") {
        newGrid[x][y] = "air";
        newGrid[x+direction][y] = "water"
    }
}

function moveLava(x,y) {
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            if (type[grid[x+i][y+j]].includes("superCold")) {
                newGrid[x][y] = "stone";
                return
            }
        }
    }
    let direction = Math.floor(Math.random()*3)-1
    if (newGrid[x][y+1] == "air") {
        newGrid[x][y] = "air";
        newGrid[x][y+1] = "lava"
    } else if (newGrid[x+direction][y] == "air") {
        newGrid[x][y] = "air";
        newGrid[x+direction][y] = "lava"
    }
}

function moveSand(x,y) {
    let direction = Math.floor(Math.random()*3)-1
    if (type[newGrid[x][y+1]].includes("liquid") && type[newGrid[x+direction][y+1]].includes("gas")) {
        newGrid[x][y] = grid[x+direction][y+1];
        newGrid[x+direction][y+1] = grid[x][y+1];
        newGrid[x][y+1] = "sand"
    } else 
    if (type[newGrid[x][y+1]].includes("liquid") && type[newGrid[x+direction][y+1]].includes("gas")) {
        newGrid[x][y] = grid[x+direction][y+1];
        newGrid[x+direction][y+1] = grid[x][y+1];
        newGrid[x][y+1] = "sand"
    } else if (type[newGrid[x][y+1]].includes("liquid")) {
        newGrid[x][y] = grid[x][y+1];
        newGrid[x][y+1] = "sand"
    } else if (type[newGrid[x+direction][y+1]].includes("liquid")&&type[newGrid[x+direction][y]].includes("liquid")) {
        newGrid[x][y] = grid[x+direction][y+1];
        newGrid[x+direction][y+1] = "sand"
    }
}

function moveDuplicator(x,y) {
    newGrid[x][y+1] = grid[x][y-1]
}

//-----No touchie-----//

window.onload = function() {
    board = document.getElementById("board")
    board.height = canvasSize
    board.width = canvasSize
    selector = document.getElementById("selector");
    context = board.getContext("2d")
    setGame();
    
    board.onmousedown = function(e) {
        mousex = e.offsetX/cellSize
        mousey = e.offsetY/cellSize
        mousedown = e.buttons;
    }
    board.onmousemove = function(e) {
        mousex = e.offsetX/cellSize
        mousey = e.offsetY/cellSize
    }
    board.onmouseup = function() {
        mousedown = null
    }
    board.oncontextmenu = function () { return false; }
    setInterval(update,1000/60);
}

function update() {
    if (mousedown==1&&doMouse) {
        for (let i = 0; i< mouseSize; i++) {
            for (let j=0; j < mouseSize; j++) {
                let placex = Math.floor(mousex+i-mouseSize/2+0.5);
                let placey = Math.floor(mousey+j-mouseSize/2+0.5);
                if (placex>0&&placex<boardWidth-1&&placey>0&&placey<boardHeight-1)
                {grid[placex][placey] = element}
            }
        }
    }
    if (mousedown==2&&doMouse) {
        for (let i = 0; i< mouseSize; i++) {
            for (let j=0; j < mouseSize; j++) {
                let placex = Math.floor(mousex+i-mouseSize/2);
                let placey = Math.floor(mousey+j-mouseSize/2);
                if (placex>0&&placex<boardWidth-1&&placey>0&&placey<boardHeight-1)
                {grid[placex][placey] = "air"}
            }
        }
    }
    if (doMouse) {
        doMouse = false;
    } else {
        doMouse = true;
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
    for (let j = 0; j<elements.length;j++) {
        
        button =  document.createElement("button");
        button.appendChild(document.createTextNode(elements[j].toUpperCase()));
        let color = `rgb(
            ${colors[elements[j]][0]},
            ${colors[elements[j]][1]},
            ${colors[elements[j]][2]})`;
            button.style.color = color;
        color = `rgba(
            ${colors[elements[j]][0]},
            ${colors[elements[j]][1]},
            ${colors[elements[j]][2]},
            0.5)`
        button.style.backgroundColor = `${color}`;
        button.style.backgroundColor.opacity = 0.2;
        button.addEventListener("click",function (event) {
            element = this.id;
        });
        button.setAttribute("id",elements[j]);
        selector.appendChild(button);
    }
    window.addEventListener("keydown", function (event) {
        switch(event.key) {
            case "=":
                mouseSize++;
                break;
                
            case "-":
                if (mouseSize > 1) {
                mouseSize--;}
                break;
        }
        //console.log(event)
    });
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