let row = 10 // 행
let col = 10 // 열
let blocks = null;
let blockLoc = 0;
let timerID =  null;

class Block {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
    }

    draw() {
        blocks[this.x * 10 + this.y].style.backgroundColor = this.color;
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
    init();

    blocks = document.getElementsByClassName("bgBlock");
    blocks[blockLoc].style.backgroundColor = "skyblue";

    timerID = setInterval("moveDown()", 300);
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
        let i = Math.floor(blockLoc/10); // 소수점 이하 버림
        let j = blockLoc%10;

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

function canDown() {
    // 수정되어야 함.
    // 현재는 맨 바닥인지만 체그해게 되어 있음
    let limit = (row-1)*col;

    if(blockLoc >= limit) 
        return false;
    else
        return true;
}