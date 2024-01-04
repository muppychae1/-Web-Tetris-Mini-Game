let ROW = 10 // 행
let COL = 10 // 열
let blocks = null;
let blockLoc = 0;
let timerID =  null;

let table = null;

let curRow; // 현재 행
let curCol; // 현재 열

// let colors = ["#F09EA7", "#F6CA94", "#FAFABE", "#C1EBC0", "#C7CAFF", "#CDABEB", "#F6C2F3"];//
let colors = ["#F09EA7", "#F6CA94"];
let blockColor = null;

let deleteBlock = new Array(ROW).fill(null).map(() => new Array(COL).fill(false));

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
    else if(e.key == " ")
        moveDirect();
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

function moveDirect() {
    console.log(`SpaceBar`)
    if(checkDown()) {
        // TODO: 아래로 내려갈 수 있는지 확인
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
        

        //TODO: 블록 객체를 배열에 삽입하기 전, 3개 이상의 블록이 모였는지 확인.
        // checkMatchBlocks(i, j);
        checkMatchBlocks();

        startNew();
    }
}

function BlockPosition(row, col) {
    this.row = row;
    this.col = col;
}

function isRange(r, c) {
    if(r < 0 || r >= ROW || c < 0 || c >= COL ) 
        return false;
    else return true;
}

function removeMatchingBlocks() {
    for(let r=0; r<ROW; r++){
        for(let c=0; c<COL ; c++){
            if(deleteBlock[r][c]) {
                blockArray[r][c] = null;
                blocks[r * COL + c].style.backgroundColor = "white";

                for(let k=r; k>0 ; k--){
                    blockArray[k][c] = blockArray[k-1][c];
                    blocks[k * COL + c].style.backgroundColor = blocks[(k-1) * COL + c].style.backgroundColor;
                    blocks[(k-1) * COL + c].style.backgroundColor = "white";
                }

                deleteBlock[r][c] = false;
            }
        }
    }
}


function checkMatch(row, col, visited, dr, dc){
    let count = 0; // 3개 이상인치 check
    let curColor = blockArray[row][col] ? blockArray[row][col].color : null;

    visited = new Array(ROW).fill(null).map(() => new Array(COL).fill(false));
    let deleteArray = new Array();

    function check(r, c) {
        if(!isRange(r,c) || visited[r][c] || blockArray[r][c] == null 
        || blockArray[r][c].color != curColor ) {
            return;
        }
        deleteArray.push([r,c]);
        visited[r][c] = true;
        count++;

        check(r+dr, c+dc);
    }

    check(row, col);

    if(count >= 3) {
        for(let i=0; i<deleteArray.length; i++){
            let row = deleteArray[i][0];
            let col = deleteArray[i][1];
            
            deleteBlock[row][col] = true;
        }
        return true;
    }
    else return false;
}

function checkMatchBlocks() {
    let visited = new Array(ROW).fill(null).map(() => new Array(COL).fill(false));

    for(let i=0; i<ROW; i++){
        for(let j=0; j<COL; j++){
            if(blockArray[i][j] != null && !visited[i][j]) {
                
                let isHorizontalMatch = checkMatch(i, j, visited, 0, 1);
                let isVerticalMatch = checkMatch(i, j, visited, 1, 0);
                let isDiagonal1Match = checkMatch(i, j, visited, 1, 1);
                let isDiagonal2Match = checkMatch(i, j, visited, 1, -1);

                if(isHorizontalMatch || isVerticalMatch || isDiagonal1Match || isDiagonal2Match) {
                    removeMatchingBlocks();
                }
            }
        }
    }
}

function removeBlocks(deleteBlockLoc) {

    const changeColArray = new Array(COL).fill(false);

    for(let i=0; i<deleteBlockLoc.length; i++){
        let r = deleteBlockLoc[i].row;
        let c = deleteBlockLoc[i].col;
        blockArray[r][c] = null;

        let newLoc = r*COL + c;
        blocks[newLoc].style.backgroundColor = "white";

        changeColArray[deleteBlockLoc[i].col] = true;
    }

    // for(let i=0; i<COL; i++) {
    //     if(!changeColArray[i]) continue;

    //     let nullLoc = null;

    //     for(let j=ROW-1; j>=0; j--){
    //         if(blockArray[j][i] == null && nullLoc == null) {
    //             nullLoc = new BlockPosition(j, i);
    //         }
    //         else if(blockArray[j][i] != null && nullLoc != null) {
    //             let newR = nullLoc.row;
    //             let newC = nullLoc.col;
    //             let newColor = blockArray[j][i].color;

    //             blockArray[newR][newC] = new Block(newR, newC, newColor);

    //             // let newLoc = j*COL + (i+1);
    //             // blocks[newLoc].style.backgroundColor = "white";

    //             let newLoc = newR*COL + (newC+1);
    //             blocks[newLoc].style.backgroundColor = newColor;

    //             nullLoc = new BlockPosition(j, i);
    //         }
    //     }
    // }
    
}

// function checkMatchBlocks(curR, curC) {
//     const visited = new Array(ROW).fill(null).map(() => new Array(COL).fill(false));
//     let deleteBlockLoc = new Array();

//     visited[curR][curC] = true;
//     deleteBlockLoc.push(new BlockPosition(curR, curC));

//     // 가로
//     deleteBlockLoc = checkBlocksDirection(curR, curC, visited, deleteBlockLoc, [0,0], [-1,1]);
//     // 세로
//     deleteBlockLoc = checkBlocksDirection(curR, curC, visited, deleteBlockLoc, [-1,1], [0,0]);
//     // 대각선1
//     deleteBlockLoc = checkBlocksDirection(curR, curC, visited, deleteBlockLoc, [-1,1], [-1,1]);
//     // 대각선2
//     deleteBlockLoc = checkBlocksDirection(curR, curC, visited, deleteBlockLoc, [1,-1], [1,-1]);
    
//     for(let i =0; i<deleteBlockLoc.length; i++){
//         console.log(`[${i}] (${deleteBlockLoc[i].row}, ${deleteBlockLoc[i].col})`)
//     }
//     console.log(`*****${deleteBlockLoc.length}******`)

//     if(deleteBlockLoc.length >= 3)
//         removeBlocks(deleteBlockLoc);

// }


// // 수평 확인
// function checkBlocksDirection(curR, curC, visited, deleteBlockLoc, dr, dc) {
//     // 왼쪽, 오른쪽 확인 
//     for(let i=0; i<dr.length; i++){
//         let newR = curR + dr[i]
//         let newC = curC + dc[i];
//         // 같은 색상의 블록이 있을 때
//         if(isRange(newR, newC) && !visited[newR][newC]
//         && blockArray[newR][newC]!=null && blockArray[newR][newC].color == blockColor) {

//             visited[newR][newC] = true;
//             deleteBlockLoc.push(new BlockPosition(newR, newC));

//             checkBlocksDirection(newR, newC, visited, deleteBlockLoc, dr, dc);
//         }
//     }

//     return deleteBlockLoc;
// }

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