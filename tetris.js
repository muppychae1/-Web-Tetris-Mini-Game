let row = 7 // 행
let col = 5 // 열
let blocks = null;
let blockLoc = 0;
let timerID =  null;

let table = null;

let curRow; // 현재 행
let curCol; // 현재 열

class Block {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
    }

    draw() {
        blocks[this.x * col + this.y].style.backgroundColor = this.color;
    }
}

function drawTable() {
    table = document.getElementsByTagName("table")[0];
    
    for(let i=0; i<row; i++){
        let newRow = table.insertRow(-1); // table의 맨 마지막에 생성
        // 열 추가
        for (let j = 0; j < col; j++) {
            // 행에 열(셀) 추가
            let newCell = newRow.insertCell(j);

            let blockDiv = document.createElement('div');
            blockDiv.className = 'bgBlock';
            newCell.appendChild(blockDiv);
        }
    }
}

function init() {
    // row x col 2차원 배열 만들기
    blockArray = new Array(row);
    for(let i = 0; i<row ; i++) {
        blockArray[i] = new Array(col);
        for(let j = 0; j<col ; j++)
            blockArray[i][j] = null;
    }
}

window.onload = function() {
    drawTable();
    init();

    blocks = document.getElementsByClassName("bgBlock");
    blocks[blockLoc].style.backgroundColor = "skyblue";

    timerID = setInterval("moveDown()", 300);
}

window.onkeydown = function (e) {
    if(e.key == "ArrowRight") 
        moveRight();
    else if(e.key == "ArrowLeft") 
        moveLeft();		
}

function moveRight() {

    if(canRight()) {
        blocks[blockLoc].style.backgroundColor = "white";		
        blockLoc += 1;
        blocks[blockLoc].style.backgroundColor = "skyblue";
    }

}

function moveLeft() {
    if(canLeft()) {
        blocks[blockLoc].style.backgroundColor = "white";		
        blockLoc -= 1;
        blocks[blockLoc].style.backgroundColor = "skyblue";
    }		
}

function canRight() {
    let curPoint = getCurrentRowCol();
    
    // 벽인지 check + 공간이 있는지 check
    if(curPoint.curCol+1 < col &&
        blockArray[curPoint.curRow][curPoint.curCol+1] == null )
        return true;
    else 
        return false;
}

function canLeft() {
    let curPoint = getCurrentRowCol();
    
    // 벽인지 check + 공간이 있는지 check
    if(curPoint.curCol-1 >= 0 &&
        blockArray[curPoint.curRow][curPoint.curCol-1] == null )
        return true;
    else 
        return false;
}


function moveDown() {
    // 수정되어야 함
    if(canDown()) {
        blocks[blockLoc].style.backgroundColor = "white";		
        blockLoc += col;
        blocks[blockLoc].style.backgroundColor = "skyblue";
    }
    else {
        // 더 이상 내려 갈 수 없는 경우, 블록 객체를 배열에 삽입함
        let i = Math.floor(blockLoc/col); // 소수점 이하 버림
        let j = blockLoc%col;

        blockArray[i][j] = new Block(i,j, "skyblue");
        blockArray[i][j].draw();
        startNew();
    }
}	

function startNew() {
    // new start
    blockLoc = 0;
    blocks[blockLoc].style.backgroundColor = "skyblue";
}

// 현재 블록의 row, col
function getCurrentRowCol() {
    let Point = {
        curRow: Math.floor(blockLoc/col),
        curCol: blockLoc%col
    };

    return Point;
}

function canDown() {
    let lastRow = (row-1)*col;
    let curPoint = getCurrentRowCol();

    // 체크1. 바닥인가?
    // 체크2. 아래에 block이 있는가?
    if ( blockLoc >= lastRow 
        || blockArray[curPoint.curRow+1][curPoint.curCol]!=null) 
        return false;
    else 
        return true;
}