var chess = document.getElementById('chess');
var context = chess.getContext('2d');
var chessBoard = [];
var turn_black = true;

//赢法
var wins = [];

//所有赢法
var count = 0;

//赢法的统计数组
var myWin = [];
var computerWin = [];

over = false;

var initBoard = function() {
    for (var i = 0; i < 15; i++) {
        chessBoard[i] = [];
        for (var j = 0; j < 15; j++) {
            chessBoard[i][j] = 0;
        }
    }
   
}

var initWins = function () {
	for (var i = 0; i < 15; i++) {
        wins[i] = [];
        for (var j = 0; j < 15; j++) {
            wins[i][j] = [];
        }
    }

    for (var i = 0;i < 15;i ++) {
    	for (var j = 0;j < 11;j ++) {
    		for (var k = 0; k < 5;k ++) {
    			wins[i][j + k][count] = true;
    		}
    		count ++;
    	}
    }
    for (var i = 0;i < 15;i ++) {
    	for (var j = 0;j < 11;j ++) {
    		for (var k = 0; k < 5;k ++) {
    			wins[j + k][i][count] = true;
    		}
    		count ++;
    	}
    } 
    for (var i = 0;i < 11;i ++) {
    	for (var j = 0;j < 11;j ++) {
    		for (var k = 0; k < 5;k ++) {
    			wins[i + k][j + k][count] = true;
    		}
    		count ++;
    	}
    } 
    for (var i = 0;i < 11;i ++) {
    	for (var j = 14;j > 3;j --) {
    		for (var k = 0; k < 5;k ++) {
    			wins[i + k][j - k][count] = true;
    		}
    		count ++;
    	}
    } 
}
// var logo = new Image();
// logo.src = "images/logo.png";
// logo.onload = function() {
// 	context.drawImage(logo, 0, 0, 450, 450);
// }

var initMyWin = function () {
	for (var i = 0;i < count;i ++) {
		myWin[i] = 0;
		computerWin[i] = 0;
	}
}

var drawChessBoard = function() {
    context.strokeStyle = "#BFBFBF";
    //column
    for (var i = 0; i < 15; i++) {
        context.moveTo(15 + i * 30, 15);
        context.lineTo(15 + i * 30, 450 - 15);
        context.stroke();
    }


    //row
    for (var i = 0; i < 15; i++) {
        context.moveTo(15, 15 + i * 30);
        context.lineTo(450 - 15, 15 + i * 30);
        context.stroke();
    }
}




var oneStep = function(x, y, isBlack) {
    context.beginPath();
    context.arc(15 + x * 30, 15 + y * 30, 13, 0, 2 * Math.PI);
    context.closePath();
    var gradient = context.createRadialGradient(15 + x * 30 + 2, 15 + y* 30 - 2, 13, 15 + x * 30 + 2, 15 + y * 30 - 2, 0);
    if (isBlack) {
        gradient.addColorStop(0, "#0A0A0A");
        gradient.addColorStop(1, "#636766");
    } else {
        gradient.addColorStop(0, "#D1D1D1");
        gradient.addColorStop(1, "#F9F9F9");
    }
    context.fillStyle = gradient;
    context.fill();
}

var computerAI = function () {
	var myScore = [];
	var computerScore = [];
	var max = 0;
	var x = 0, y = 0;
	for (var i = 0;i < 15;i ++) {
		myScore[i] = [];
		computerScore[i] = [];
		for (var j = 0;j < 15;j ++) {
			myScore[i][j] = 0;
			computerScore[i][j] = 0;
		}
	}
	for (var i = 0;i < 15;i ++) {
		for (var j = 0;j < 15;j ++) {
			if (chessBoard[i][j] == 0) {
				for (var k = 0;k < count;k ++) {
					if (wins[i][j][k]) {
						if (myWin[k] == 1) {
							myScore[i][j] += 200;
						}
						else if (myWin[k] == 2) {
							myScore[i][j] += 400;
						}
						else if (myWin[k] == 3) {
							myScore[i][j] += 2000;
						}
						else if (myWin[k] == 4) {
							myScore[i][j] += 10000;
						}


						if (computerWin[k] == 1) {
							computerScore[i][j] += 220;
						}
						else if (computerWin[k] == 2) {
							computerScore[i][j] += 420;
						}
						else if (computerWin[k] == 3) {
							computerScore[i][j] += 2100;
						}
						else if (computerWin[k] == 4) {
							computerScore[i][j] += 20000;
						}
					}
				}
			}
			if (myScore[i][j] > max || myScore[i][j] == max && computerScore[x][y] < computerScore[i][j]) {
				max = myScore[i][j];
				x = i;
				y = j;
			}

			if (computerScore[i][j] > max || computerScore[i][j] == max && myScore[x][y] < myScore[i][j]) {
				max = computerScore[i][j];
				x = i;
				y = j;
			}
		}
	}
	oneStep(x, y, false);
	chessBoard[x][y] = 2;
	
	for (var k = 0; k < count; k++) {
	    if (wins[x][y][k]) {
	        computerWin[k]++;
	        myWin[k] = 6; // special number
	        if (computerWin[k] == 5) {
	            window.alert("计算机赢了！");
	            over = true;
	        }
	    }
	}

    if (!over) {
    	turn_black = !turn_black;
    }
}


chess.onclick = function(e) {
	if (over) {
		return;
	}

	if (!turn_black) {
		return;
	}
    var x = e.offsetX;
    var y = e.offsetY;
    var i = Math.floor(x / 30);
    var j = Math.floor(y / 30);
    if (chessBoard[i][j] == 0) {
        oneStep(i, j, turn_black);
        chessBoard[i][j] = 1;
        
        for (var k = 0;k < count;k ++) {
        	if (wins[i][j][k]) {
        		myWin[k] ++;
        		computerWin[k] = 6; // special number
        		if (myWin[k] == 5) {
        			window.alert("你赢了！");
        			over = true;
        		}
        	}
        }
        if (!over) {
        	turn_black = !turn_black;
        	computerAI();
        }
    }

}

initWins();
console.log(count);
initMyWin();
initBoard();
drawChessBoard();
