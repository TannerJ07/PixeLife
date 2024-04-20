const canvasSize = 500
const cellSize = 4
const boardHeight = canvasSize/cellSize
const boardWidth = canvasSize/cellSize

/*const boardWidth = 100
const boardHeight = boardWidth

const cellSize = 8
const canvasSize = boardWidth*cellSize*/


let grid = {}
let newGrid = {};
let board = document.getElementById("board");
let context = board.getContext("2d")
const bufferImage = context.createImageData(canvasSize,canvasSize)


let selector
let mousedown = false;
let freezeMouse = false
let mouseSize = 1;
let mousex, mousey;
let ogMousex, ogMousey;
let lock;
let element = "sand";
let doMouse = true;

const colors = {
    fuse:[200,50,0],
    coal: [30,30,30],
    air: [200,200,200],
    sand: [255,230,179],
    dust: [255,133,0],
    stone: [90,90,90],
    rock: [110,100,100],
    glass: [200,250,255],
    ice: [100,200,255],
    water: [0,0,255],
    oil: [30,30,20],
    border: [255,0,255],
    fire: [255,0,0],
    lava: [255,133,0],
    steam: [80,80,80],
    dirt: [150,40,0],
    mud: [100,40,0],
    slug: [64,84,16],
    heatBlock: [200,0,0],
    coldBlock: [50,150,255],
    blackHole: [15,15,15],
    duplicator: [150,0,255],

    solid: [70,70,70],
    liquid: [0,0,255],
    gas: [255,255,255],
    plasma: [255,100,0],
    special: [255,0,255],
};
const functions = {
    fuse: moveFuse,
    coal: moveCoal,
    air: null,
    sand: moveSand,
    dust: moveDust,
    stone: null,
    ice: moveIce,
    rock: blockFall,
    glass: moveGlass,
    water: moveWater,
    oil: moveOil,
    slug: moveSlug,
    lava: moveLava,
    fire: moveFire,
    steam: moveSteam,
    dirt: moveDirt,
    mud: moveMud,
    duplicator: moveDuplicator,
    blackHole: moveBlackHole,
    heatBlock: null,
    coldBlock: null,
    border: null,
}
const type = {
    fuse: [],
    coal: [],
    air: ["liquid","gas","light","weightless",],
    sand: [],
    ice: ["cold"],
    dust: [],
    glass: [],
    water: ["liquid","cold"],
    oil: ["liquid",],
    lava: ["liquid","hot","superHot"],
    fire: ["hot","liquid",],
    steam: ["gas","liquid",],
    heatBlock: ["hot","superHot"],
    coldBlock: ["cold","superCold"],
    dirt: [],
    mud: [],
    slug: [],
    stone: [],
    rock: [],
    border: [],
    blackHole: [],
    duplicator: [],
}
const density = {
    fuse: undefined,
    air: -3,
    sand: 1,
    rock: 2,
    dust: 1,
    coal: 1,
    glass: -1,
    ice: -1,
    water: 0,
    oil: -2,
    slug: 1,
    lava: 0,
    fire: -5,
    steam: -4,
    heatBlock: undefined,
    coldBlock: undefined,
    dirt: 0,
    mud: 0,
    stone:undefined,
    border:undefined,
    blackHole:undefined,
    duplicator:undefined,
}
const elements = ["air","water","lava","fire","fuse","dirt","slug","mud","sand","dust","stone","coal","rock","glass","ice","steam","oil","heatBlock","coldBlock","border","blackHole","duplicator"]

function moveSteam(x,y) {
    if (Math.random() >0.98) {
        newGrid[x][y] = "water";
        return
    } else if(!blockClimb(x,y)) {blockSlide(x,y)}
}

function moveFuse(x,y) {
    if (typeDetect(x,y,"hot")) {
        newGrid[x][y] = "fire"
    }
}

function moveCoal(x,y) {
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            if (type[grid[x+i][y+j]].includes("hot")) {
                newGrid[x][y] = "fire";
                return
            }
        }
    }
    if (!blockFall(x,y)) {blockTumble(x,y);}
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
    if (!blockFall(x,y)) {blockTumble(x,y)}
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
    blockFall(x,y)
}

function moveSlug(x,y) {
    let i = Math.floor(Math.random()*3)-1+x
    let j = Math.floor(Math.random()*3)-1+y
    if (newGrid[i][j]==="dirt") {
        newGrid[x][y] = "dirt";
        newGrid[i][j] = "slug"
        return
    }
    if (!blockFall(x,y)) {
        !blockTumble(x,y)
    }
}

function moveFire(x,y) {
    if (Math.random() >0.93) {
        newGrid[x][y] = "air";
        return
    } else if (!blockClimb(x,y)) {blockRise(x,y)}
}

function moveWater(x,y) {
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            if (type[grid[x+i][y+j]].includes("hot")) {
                newGrid[x][y] = "steam";
                return
            }
            if (type[grid[x+i][y+j]].includes("superCold")) {
                newGrid[x][y] = "ice";
                return
            }
        }
    }
    if (!blockFall(x,y)) {blockSlide(x,y)}
}

function moveOil(x,y) {
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            if (type[grid[x+i][y+j]].includes("hot")) {
                newGrid[x][y] = "fire";
                return
            }
        }
    }
    if (!blockFall(x,y)) {blockSlide(x,y)}
}

function moveLava(x,y) {
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            if (type[grid[x+i][y+j]].includes("cold")) {
                newGrid[x][y] = "stone";
                return
            }
        }
    }
    if (!blockFall(x,y)) {blockSlide(x,y)}
}

function moveIce(x,y) {
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            if (type[grid[x+i][y+j]].includes("hot")) {
                newGrid[x][y] = "water";
                return
            }
        }
    }
    if (!blockFall(x,y)) {blockRise(x,y)}
}

function moveSand(x,y) {
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            if (type[grid[x+i][y+j]].includes("superHot")) {
                newGrid[x][y] = "glass";
                return
            }
        }
    }
    if (!blockFall(x,y)) {blockTumble(x,y);}
}

function moveDust(x,y) {
    if (!blockTumble(x,y)) {blockFall(x,y)}
}

function moveGlass(x,y) {
    if (blockFall(x,y)&&!type[grid[x][y+2]].includes("liquid")) {newGrid[x][y+1]="air"}
}

function moveBlackHole(x,y) {
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            if (newGrid[x+i][y+j] !== "blackHole"&&newGrid[x+i][y+j] !== "border") {
                newGrid[x+i][y+j] = "air";
            }
        }
    }
}

function moveDuplicator(x,y) {
    if (newGrid[x][y+1] !== "border") {
        newGrid[x][y+1] = grid[x][y-1]
    }
}

//-----No touchie-----//

function blockFall(x,y) {
    let direction = Math.floor(Math.random()*2)*2-1
    if (type[newGrid[x][y+1]].includes("liquid")&&density[newGrid[x][y+1]]<density[grid[x][y]]&&density[newGrid[x+direction][y+1]]<=density[grid[x][y+1]]) {
        newGrid[x][y] = newGrid[x+direction][y+1];
        newGrid[x+direction][y+1] = newGrid[x][y+1];
        newGrid[x][y+1] = grid[x][y]
        return true;
    } else if (type[newGrid[x][y+1]].includes("liquid")&&density[newGrid[x][y+1]]<density[grid[x][y]]) {
        newGrid[x][y] = newGrid[x][y+1];
        newGrid[x][y+1] = grid[x][y];
        return true;
    } 
}

function blockRise(x,y) {
    let direction = Math.floor(Math.random()*2)*2-1
    if (type[newGrid[x][y-1]].includes("liquid")&&density[newGrid[x][y-1]]>density[grid[x][y]]&&density[newGrid[x+direction][y-1]]>=density[grid[x][y-1]]) {
        newGrid[x][y] = newGrid[x+direction][y-1];
        newGrid[x+direction][y-1] = newGrid[x][y-1];
        newGrid[x][y-1] = grid[x][y]
        return true;
    } else if (type[newGrid[x][y-1]].includes("liquid")&&density[newGrid[x][y-1]]>density[grid[x][y]]) {
        newGrid[x][y] = newGrid[x][y-1];
        newGrid[x][y-1] = grid[x][y];
        return true;
    } 
}

function blockTumble(x,y) {
    let direction = Math.floor(Math.random()*2)*2-1
    if (type[newGrid[x+direction][y+1]].includes("liquid")&&density[newGrid[x+direction][y+1]]<density[grid[x][y]]&&density[newGrid[x+direction][y]]<density[grid[x][y]]) {
        newGrid[x][y] = newGrid[x+direction][y+1];
        newGrid[x+direction][y+1] = grid[x][y];
        return true;
    } 
}

function blockClimb(x,y) {
    let direction = Math.floor(Math.random()*2)*2-1
    if (type[newGrid[x+direction][y-1]].includes("liquid")&&density[newGrid[x+direction][y-1]]>density[grid[x][y]]&&density[newGrid[x+direction][y]]>density[grid[x][y]]) {
        newGrid[x][y] = newGrid[x+direction][y-1];
        newGrid[x+direction][y-1] = grid[x][y];
        return true;
    } 
}

function blockSlide(x,y) {
    let direction = Math.floor(Math.random()*2)*2-1
    if (type[newGrid[x+direction][y]].includes("liquid")&&density[newGrid[x+direction][y]]<density[grid[x][y]]) {
        newGrid[x][y] = newGrid[x+direction][y];
        newGrid[x+direction][y] = grid[x][y]
        return true;
    }
}

function typeDetect(x,y,elementType) {
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            if (type[grid[x+i][y+j]].includes(elementType)) {
                return true
            }
        }
    }
}

function blockDetect(x,y,block) {
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            if ([grid[x+i][y+j]]==block) {
                return true
            }
        }
    }
}

window.onload = function() {
    board.height = canvasSize
    board.width = canvasSize
    selector = document.getElementById("selector");
    setGame();
    
    board.onmousedown = function(e) {
        lock = null;
        mousex = e.offsetX/cellSize
        mousey = e.offsetY/cellSize
        ogMousex = e.offsetX
        ogMousey = e.offsetY
        mousedown = e.buttons;
    }
    board.onmousemove = function(e) {
        if (e.shiftKey) {
            if (lock===0||(lock!==1&&Math.abs(e.offsetX-ogMousex)>cellSize)) {
                mousex = e.offsetX/cellSize;
                lock = 0;
            }
            if (lock===1||(lock!==0&&Math.abs(e.offsetY-ogMousey)>cellSize)){
                mousey = e.offsetY/cellSize;
                lock = 1;
            }
        } else{
        mousex = e.offsetX/cellSize
        mousey = e.offsetY/cellSize}
    }
    window.onmouseup = function() {
        mousedown = null
        lock = null;
    }
    board.ontouchstart = function(e) {
        lock = null;
        mousex = e.offsetX/cellSize
        mousey = e.offsetY/cellSize
        mousedown = 1;
    }
    board.ontouchmove = function(e) {
        mousex = e.offsetX/cellSize
        mousey = e.offsetY/cellSize
    }
    window.ontouchend = function(e) {
        mousedown = null;
        lock = null
    }
    window.oncontextmenu = function () { return false; }
    setInterval(update,1000/60);
}

function update() {
    
    updateGrid();
    if (mousedown==1&&doMouse) {
        for (let i = 0; i< mouseSize; i++) {
            for (let j=0; j < mouseSize; j++) {
                let placex = Math.floor(mousex+i-mouseSize/2+0.5);
                let placey = Math.floor(mousey+j-mouseSize/2+0.5);
                if (placex>0&&placex<boardWidth-1&&placey>0&&placey<boardHeight-1)
                {newGrid[placex][placey] = element}
            }
        }
    }
    if (mousedown==2&&doMouse) {
        for (let i = 0; i< mouseSize; i++) {
            for (let j=0; j < mouseSize; j++) {
                let placex = Math.floor(mousex+i-mouseSize/2+0.5);
                let placey = Math.floor(mousey+j-mouseSize/2+0.5);
                if (placex>0&&placex<boardWidth-1&&placey>0&&placey<boardHeight-1)
                {newGrid[placex][placey] = "air"}
            }
        }
    }
    if (doMouse) {
        doMouse = false;
    } else {
        doMouse = true;
    }
    
    displayBoard();
}

function updateGrid() {
    //newGrid = grid
    for (let j = 0; j < boardHeight; j++) {
        for (let i = 0; i < boardWidth; i++) {
            if (functions[grid[i][j]] && grid[i][j] == newGrid[i][j]) {
                functions[grid[i][j]](i,j);
            }
        }
    }
}

function setGame (){
    board = document.getElementById("board")
    context = board.getContext("2d")
    for(let i = 0;i<boardWidth;i++) {
        grid[i] = {};
        newGrid[i] = {};
        for(let j =0;j<boardHeight;j++) {
            if (i==0||j==0||i==boardWidth-1||j==boardHeight-1) {
                grid[i][j] = "border";
                newGrid[i][j] = "border";
            } else{
            grid[i][j] = "air";
            newGrid[i][j] = "air";}
        }
    }
    for (let j = 0; j<elements.length;j++) {
        
        button =  document.createElement("button");
        button.appendChild(document.createTextNode(elements[j].toUpperCase()));
        let color = `rgba(
            ${colors[elements[j]][0]},
            ${colors[elements[j]][1]},
            ${colors[elements[j]][2]},
            0.5)`
        button.style.backgroundColor = `${color}`;
        if ((colors[elements[j]][0]+colors[elements[j]][1]+colors[elements[j]][2])<100) {
            color = `rgb(100,100,100)`;
        } else {
            color = `rgb(
            ${colors[elements[j]][0]},
            ${colors[elements[j]][1]},
            ${colors[elements[j]][2]})`;}
        button.style.color = color;
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
    for (let i = 0; i < canvasSize*canvasSize; i++) {
        let x = Math.floor(i/cellSize)%boardWidth
        let y = Math.floor(i/canvasSize/cellSize)
        bufferImage.data[4*i] = colors[newGrid[x][y]][0]; // Red
        bufferImage.data[4*i + 1] = colors[newGrid[x][y]][1]; // Green
        bufferImage.data[4*i + 2] = colors[newGrid[x][y]][2]; // Blue
        bufferImage.data[4*i + 3] = 255//[Math.floor(i/cellSize)%boardWidth][Math.floor(i/canvasSize)]; // Alpha (fully opaque)}
        grid[x][y] = newGrid[x][y]
        }
    context.putImageData(bufferImage,0,0)
}