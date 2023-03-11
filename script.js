const markColor = "#292929";
const numbColor = "#399";
const unumColor = "#ddd";
const mnumColor = "#858";
const boardColor = "#000";
const lineColor = "#555";
const markMenu = "#636";
const markNumColor = "#000";
const standardFont = "300px serif";
const smallFont = "150px serif";
const boardHeight = 4600;
const boardWidth = 5110;
let stringBoard = "";
let board = null;
let selectedInBoard = null;
let selectedInMenu = null;


function printBoard(ctx) {
	ctx.beginPath();
	ctx.fillStyle = boardColor;
	ctx.fillRect(0, 0, boardWidth, boardHeight);
	ctx.strokeStyle = lineColor;
	ctx.stroke();


	ctx.font = standardFont;
	for (let i = 0; i < 9; i++) {
		ctx.beginPath();
		if (!selectedInMenu[i]) {
			ctx.fillStyle = mnumColor;
		}
		else {
			ctx.beginPath();
			ctx.fillStyle = markMenu;
			ctx.fillRect(0, i * boardHeight / 9, boardWidth / 10, boardHeight / 9);
			ctx.stroke();
			ctx.fillStyle = markNumColor;
		}
		ctx.fillText(i + 1, boardWidth / 30, ((i + 1) * boardHeight / 9 - boardHeight / 36));
		ctx.stroke();
	}


	for (let x = 0; x < 9; x++) {
		for (let y = 0; y < 9; y++) {
			if (selectedInBoard[x][y]) {
				ctx.beginPath();
				ctx.fillStyle = markColor;
				ctx.fillRect((x + 1) * boardWidth / 10, y * boardHeight / 9, boardWidth / 10, boardHeight / 9);
				ctx.stroke();
			}


			let numbers = 0;
			let temp = 0;
			for (let i = 1; i < 10; i++) {
				if (board[x][y][i] == 1) {
					numbers++;
					temp = i;
				}
			}

			if (!board[x][y][0]) ctx.fillStyle = numbColor;
			else ctx.fillStyle = unumColor;

			if (numbers == 1) {
				ctx.beginPath();
				ctx.font = standardFont;
				ctx.fillText(temp, (x + 1) * (boardWidth / 10) + (boardWidth / 30), (y * (boardHeight / 9)) + (boardHeight / 12));
				ctx.stroke();
			}
			else if (numbers > 1) {
				ctx.beginPath();
				ctx.font = smallFont;
				for (let i = 1; i < 10; i++) {
					if (board[x][y][i] == 1) {
						ctx.fillText(i, (x + 1) * (boardWidth / 10) + (boardWidth / 70) + ((i - 1) % 3) * (boardWidth / 40), (y * (boardHeight / 9) + (boardHeight / 25) + Math.floor((i - 1) / 3) * (boardHeight / 36)));
					}
				}
				ctx.stroke();
			}
		}
	}


	for (let i = 0; i < 11; i++) {
		if (i == 0 || i % 3 == 1) ctx.lineWidth = 100;
		else ctx.lineWidth = 20;

		ctx.beginPath();
		ctx.moveTo(boardWidth / 10 * i, 0);
		ctx.lineTo(boardWidth / 10 * i, boardHeight);
		ctx.stroke();
	}
	for (let i = 0; i < 10; i++) {
		ctx.lineWidth = 100;
		ctx.beginPath();
		ctx.moveTo(0, boardHeight / 9 * i);
		ctx.lineTo(boardWidth / 10, boardHeight / 9 * i);
		ctx.stroke();

		if (i % 3 == 0) ctx.lineWidth = 100;
		else ctx.lineWidth = 20;

		ctx.beginPath();
		ctx.moveTo(boardWidth / 10, boardHeight / 9 * i);
		ctx.lineTo(boardWidth, boardHeight / 9 * i);
		ctx.stroke();
	}

}

function getMousePos(canvas, event) {
	let rect = canvas.getBoundingClientRect();
	let x = Math.floor(Math.round(((event.clientX - rect.left) * boardWidth) / canvas.clientWidth) / 510);
	let y = Math.floor(Math.round(((event.clientY - rect.top) * boardHeight) / canvas.clientHeight) / 510);
	if (x > 9) x = 9;
	if (y > 8) y = 8;
	return {
		x: x,
		y: y
	};
}

function createStringBoard(board) {
	strBoard = "";
	for (let i = 0; i < 81; i++) {
		let a = i % 9;
		let b = Math.floor(i / 9);
		let n = 0;
		for (k = 1; board[a][b][k] == 0; k++) n++;
		strBoard += String(n + 1);
	}
	return strBoard;
}

function thereIsOneNumberInEachSquare() {
	for (i = 0; i < 9; i++) {
		for (j = 0; j < 9; j++) {
			let numbers = 0;
			for (k = 1; k < 10; k++) {
				if (board[i][j][k] == 1) numbers++;
			}
			if (numbers != 1) return false;
		}
	}
	return true;
}

function clickEvent(evt, ctx) {

	let mousePos = getMousePos(canvas, evt);
	const x = mousePos.x;
	const y = mousePos.y;

	if (x > 0) {
		for (let i = 0; i < 9; i++) selectedInMenu[i] = 0;
		for (let i = 0; i < 9; i++) for (let j = 0; j < 9; j++)selectedInBoard[i][j] = 0;
		if (board[x - 1][y][0]) {
			selectedInBoard[x - 1][y] = 1;
			for (let i = 0; i < 9; i++) selectedInMenu[i] = board[x - 1][y][i + 1];
		}
		printBoard(ctx);
	}
	else {
		let selectedX = null;
		let selectedY = null;
		for (let i = 0; i < 9; i++) for (let j = 0; j < 9; j++) if (selectedInBoard[i][j]) {
			selectedX = i;
			selectedY = j;
		}
		if (selectedX != null && selectedY != null) {
			board[selectedX][selectedY][y + 1] ^= 1;
			selectedInMenu[y] = board[selectedX][selectedY][y + 1];
		}
		printBoard(ctx);
		if (thereIsOneNumberInEachSquare()) {
			stringBoard = createStringBoard(board);
			check(fromDBboard, stringBoard);
		}
	}
}

async function check(fromDBboard, smallBoard) {
	let modal = document.getElementById("modal_content");
	modal.innerHTML = "<h3>Checking...</h3><p>connecting to server...</p>";
	document.getElementById("modal_container").style.display = "block";
	await fetch(`https://sudoku.redex2.dev/check.php?b=${fromDBboard}&s=${smallBoard}#${new Date().getTime()}`)
		.then((response) => {
			if (response.ok) return response.text()
			else throw new Error(response.status)
		})
		.then((text) => {
			if (text == 1) {
				modal.innerHTML = `<h3>Checkd!</h3><p>Good job! You solved correctly!</p><input type="button" onClick="window.location.reload();" value="Next sudoku!">`;
			}
			else if (text == 0) {
				modal.innerHTML = `<h3>Checkd!</h3><p>Something went wrong... You made a mistake somewhere</p><input type="button" value="I want correct" onclick="document.getElementById('modal_container').style.display = 'none';">`;
			}
			else {
				modal.innerHTML = `<h3>Checkd, but...</h3><p>I don't have this board in database</p>`;
			}
		})
		.catch((error) => {
			modal.innerHTML = `<h3>Checking...</h3><p>Cannot connect to the server</p>`;
		});
}

function initArray() {
	board = new Array(9);
	for (let i = 0; i < 9; i++) board[i] = new Array(9);
	for (let i = 0; i < 9; i++) for (let j = 0; j < 9; j++) board[i][j] = new Array(11);
	for (let i = 0; i < 9; i++) for (let j = 0; j < 9; j++)for (let k = 0; k < 11; k++) board[i][j][k] = 0;

	selectedInBoard = new Array(9);
	for (let i = 0; i < 9; i++) selectedInBoard[i] = new Array(9);
	for (let i = 0; i < 9; i++) for (let j = 0; j < 9; j++)selectedInBoard[i][j] = 0;

	selectedInMenu = new Array(9);
	for (let i = 0; i < 9; i++) selectedInMenu[i] = 0;
}

function toArray(strBoard) {
	data = strBoard.match('^[0-9]{81}$')[0];
	for (let i = 0; i < 81; i++) {
		let c = parseInt(data[i]);
		let a = i % 9;
		let b = Math.floor(i / 9);
		board[a][b][c] = 1;

		if (c != 0) board[a][b][10] = 1;
		else board[a][b][10] = 0;
	}
}

window.addEventListener("load", () => {
	if (fromDBboard !== undefined) {
		initArray();
		toArray(fromDBboard);
		const canvas = document.getElementById("canvas");
		const ctx = canvas.getContext('2d');
		const div = document.getElementsByClassName("content");
		canvas.width = boardWidth;
		canvas.height = boardHeight;
		printBoard(ctx);
		canvas.addEventListener('click', (evt) => { clickEvent(evt, ctx); });
	}
});