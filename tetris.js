let ROW = 10 // 행
let COL = 10 // 열
let blocks = null;
let blockLoc = 0;
let timerID =  null;

let table = null;

let curRow; // 현재 행
let curCol; // 현재 열

// let colors = ["#F09EA7", "#F6CA94", "#FAFABE", "#C1EBC0", "#C7CAFF", "#CDABEB", "#F6C2F3"];//
let colors = ["#F09EA7"];
let blockColor = null;

class Block {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
    }

    draw() {
        blocks[this.x * COL + this.y].style.backgroundColor = this.color;
    }
}

function drawTable() {
    table = document.getElementsByTagName("table")[0];
    
    for(let i=0; i<ROW; i++){
        let newRow = table.insertRow(-1); // table의 맨 마지막에 생성
        // 열 추가
        for (let j = 0; j < COL; j++) {
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
    blockArray = new Array(ROW);
    for(let i = 0; i<ROW ; i++) {
        blockArray[i] = new Array(COL);
        for(let j = 0; j<COL ; j++)
            blockArray[i][j] = null;
    }

    blockLoc = Math.floor(Math.random() * (COL + 1));
}

window.onload = function() {
    drawTable();
    init();

    blocks = document.getElementsByClassName("bgBlock");
    blockColor = colors[Math.floor(Math.random() * colors.length)];
    blocks[blockLoc].style.backgroundColor = blockColor;

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
        blocks[blockLoc].style.backgroundColor = blockColor;
    }
}

function moveLeft() {
    if(canLeft()) {
        blocks[blockLoc].style.backgroundColor = "white";		
        blockLoc -= 1;
        blocks[blockLoc].style.backgroundColor = blockColor;
    }		
}

function moveDown() {
    if(canDown()) {
        blocks[blockLoc].style.backgroundColor = "white";		
        blockLoc += COL;
        blocks[blockLoc].style.backgroundColor = blockColor;
    }
    else {
        // 더 이상 내려 갈 수 없는 경우, 블록 객체를 배열에 삽입함

        let i = Math.floor(blockLoc/COL); // 소수점 이하 버림
        let j = blockLoc%COL;

        blockArray[i][j] = new Block(i,j, blockColor);
        blockArray[i][j].draw();
        startNew();

        //TODO: 블록 객체를 배열에 삽입하기 전, 3개 이상의 블록이 모였는지 확인.
        checkMatchBlocks(i, j);
    }
}

function BlockPosition(row, col) {
    this.row = row;
    this.col = col;
}

function checkMatchBlocks(curR, curC) {
    const visited = new Array(ROW).fill(null).map(() => new Array(COL).fill(false));
    let deleteBlockLoc = new Array();

    visited[curR][curC] = true;
    deleteBlockLoc.push(new BlockPosition(curR, curC));

    deleteBlockLoc = checkHorizontal(curR, curC, visited, deleteBlockLoc);
    
    for(let i =0; i<deleteBlockLoc.length; i++){
        console.log(`[${i}] (${deleteBlockLoc[i].row}, ${deleteBlockLoc[i].col})`)
    }
}

function isRange(r, c) {
    if(r < 0 || r >= ROW || c < 0 || c >= COL ) 
        return false;
    else return true;
}

// 수평 확인
function checkHorizontal(curR, curC, visited, deleteBlockLoc) {
    direc = [-1,1];
    // 왼쪽, 오른쪽 확인 
    for(let i=0; i<direc.length; i++){
        let newC = curC + direc[i];
        // 같은 색상의 블록이 있을 때
        if(isRange(curR, newC) && !visited[curR][newC]
        && blockArray[curR][newC]!=null && blockArray[curR][newC].color == blockColor) {

            visited[curR][newC] = true;
            deleteBlockLoc.push(new BlockPosition(curR, newC));

            checkHorizontal(curR, newC, visited, deleteBlockLoc);
        }
    }

    return deleteBlockLoc;
}

function startNew() {
    // new start
    blockLoc = Math.floor(Math.random() * (COL + 1));
    blockColor = colors[Math.floor(Math.random() * colors.length)];

    blocks[blockLoc].style.backgroundColor = blockColor;
}

// 현재 블록의 row, col
function getCurrentRowCol() {
    let Point = {
        curRow: Math.floor(blockLoc/COL),
        curCol: blockLoc%COL
    };

    return Point;
}

function canDown() {
    let lastRow = (ROW-1)*COL;
    let curPoint = getCurrentRowCol();

    // 체크1. 바닥인가?
    // 체크2. 아래에 block이 있는가?
    if ( blockLoc >= lastRow 
        || blockArray[curPoint.curRow+1][curPoint.curCol]!=null) 
        return false;
    else 
        return true;
}

function canRight() {
    let curPoint = getCurrentRowCol();
    
    // 벽인지 check + 공간이 있는지 check
    if(curPoint.curCol+1 < COL &&
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