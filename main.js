"use strict";
const rowName = "ABCDEFGH";
const initialPosition = "D4";

let currentPosition = initialPosition;
let targetPosition = "";
let moveCount = 0;
let gameActive = false; 
let score = {
	played: 0,
	bestMoves: 0,
	bestCount: 0,
	worstMoves: 0,
	worstCount: 0,
};

window.addEventListener("load", () => {
	renderTable();
	loadScoreboard();

	document
		.querySelector(".btn-reinicio")
		.addEventListener("click", clearScoreboard);

	startNewGame();
});


function renderTable() {
	let tabla = "";
	// Dibujamos la tabla de 8x8 más la primera celda de cada fila que es el nombre de la fila de 8..1
	for (let i = 8; i > 0; i--) {
		tabla += `<tr><th>${i}</th>`;
		for (let j = 0; j < 8; j++) {
			tabla += `
				<td id="${rowName.charAt(j) + i}" class="${(i + j) % 2 ? "negra" : "blanca"
				}"></td>`;
		}
		tabla += "</tr><tr><th></th>";
	}
	// Dibujamos el encabezado de las columnas, A..H
	for (let i = 0; i < 8; i++) {
		tabla += `<th>${rowName.charAt(i)}</th>`;
	}
	tabla += "</tr>";

	tablero.innerHTML = tabla;

	// Ahora podríamos colocar el caballo en su celda.
	// Para que quepa dadle un ancho de 50px
	document.getElementById(initialPosition).innerHTML =
		'<img id="caballo" src="./images/caballo.png" width="50px">';
}

function startNewGame() {
	currentPosition = initialPosition;
	moveCount = 0;
	gameActive = true;

	const oldFinal = document.querySelector(".final");
	if (oldFinal) {
		oldFinal.classList.remove("final");
	}
	document.querySelector(".main-titulo").classList.remove("main-titulo-efecto");

	const caballoImg =
		document.getElementById("caballo") || document.createElement("img");
	if (!caballoImg.id) {
		caballoImg.id = "caballo";
		caballoImg.src = "./images/caballo.png";
		caballoImg.width = 50;
	}
	document.getElementById(initialPosition).appendChild(caballoImg);

	targetPosition = getRandomPosition();
	while (targetPosition === currentPosition) {
		targetPosition = getRandomPosition();
	}

	document.getElementById(targetPosition).classList.add("final");
	document.getElementById("posicion").textContent = targetPosition;

	caballoImg.setAttribute("draggable", "true");
	caballoImg.addEventListener("dragstart", handleDragStart);

	iniciarJugada(currentPosition);
}

function iniciarJugada(position) {
	if (!gameActive) return;
	const oldDropables = document.querySelectorAll(".dropable");
	oldDropables.forEach((td) => {
		td.classList.remove("dropable");
		td.removeEventListener("dragover", handleDragOver);
		td.removeEventListener("drop", handleDrop);
	});

	const targets = calcTargets(position);
	targets.forEach((targetId) => {
		const cell = document.getElementById(targetId);
		if (cell) {
			cell.classList.add("dropable");

			cell.addEventListener("dragover", handleDragOver);
			cell.addEventListener("drop", handleDrop);
		}
	});
}

function handleDragStart(e) {
	e.dataTransfer.setData("text/plain", e.target.id);
}

function handleDragOver(e) {
	e.preventDefault();
}

function handleDrop(e) {
	e.preventDefault();
	if (!gameActive) return;

	const caballoId = e.dataTransfer.getData("text/plain");
	const caballoImg = document.getElementById(caballoId);
	const targetCell = e.currentTarget;

	targetCell.appendChild(caballoImg);

	currentPosition = targetCell.id;
	moveCount++;

	if (currentPosition === targetPosition) {
		gameActive = false;
		document.querySelector(".main-titulo").classList.add("main-titulo-efecto");

		document.querySelectorAll(".dropable").forEach((td) => {
			td.classList.remove("dropable");
			td.removeEventListener("dragover", handleDragOver);
			td.removeEventListener("drop", handleDrop);
		});

		updateScore();
		saveScoreboard();
		updateScoreboardDisplay();
	} else {
		iniciarJugada(currentPosition);
	}
}

function loadScoreboard() {
	const savedScore = localStorage.getItem("caballoScore");
	if (savedScore) {
		score = JSON.parse(savedScore);
	}
	updateScoreboardDisplay();
}

function updateScoreboardDisplay() {
	document.getElementById("played-text").textContent = score.played;
	document.getElementById("best-mov-text").textContent = score.bestMoves;
	document.getElementById("best-num-text").textContent = score.bestCount;
	document.getElementById("worst-mov-text").textContent = score.worstMoves;
	document.getElementById("worst-num-text").textContent = score.worstCount;
}

function saveScoreboard() {
	localStorage.setItem("caballoScore", JSON.stringify(score));
}

function clearScoreboard(e) {
	e.preventDefault();
	score = {
		played: 0,
		bestMoves: 0,
		bestCount: 0,
		worstMoves: 0,
		worstCount: 0,
	};
	saveScoreboard();
	updateScoreboardDisplay();
}

function updateScore() {
	score.played++;

	if (score.bestMoves === 0 || moveCount < score.bestMoves) {
		score.bestMoves = moveCount;
		score.bestCount = 1;
	} else if (moveCount === score.bestMoves) {
		score.bestCount++;
	}

	if (score.worstMoves === 0 || moveCount > score.worstMoves) {
		score.worstMoves = moveCount;
		score.worstCount = 1;
	} else if (moveCount === score.worstMoves) {
		score.worstCount++;
	}
}

function calcTargets(position) {
	const column = rowName.indexOf(position.charAt(0)) + 1;
	const row = Number(position.charAt(1));
	let targets = [];
	targets.push([column + 2, row + 1]);
	targets.push([column + 2, row - 1]);
	targets.push([column - 2, row + 1]);
	targets.push([column - 2, row - 1]);
	targets.push([column + 1, row + 2]);
	targets.push([column + 1, row - 2]);
	targets.push([column - 1, row + 2]);
	targets.push([column - 1, row - 2]);
	return clearTargets(targets).map(
		(cell) => rowName.charAt(cell[0] - 1) + cell[1]
	);
}

function clearTargets(targets) {
	return targets.filter((cell) => {
		const column = cell[0];
		const row = cell[1];
		return column >= 1 && column <= 8 && row >= 1 && row <= 8;
	});
}

function getRandomPosition() {
	const randomCol = rowName.charAt(Math.floor(Math.random() * 8));
	const randomRow = Math.floor(Math.random() * 8) + 1;
	return randomCol + randomRow;
}
