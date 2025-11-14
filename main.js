'use strict'
const rowName='ABCDEFGH';
const initialPosition = 'D4'

window.addEventListener('load', () => {
	renderTable()
})


function renderTable() {
	let tabla='';
	// Dibujamos la tabla de 8x8 más la primera celda de cada fila que es el nombre de la fila de 8..1
	for (let i=8; i>0; i--) {
		tabla+=`<tr><th>${i}</th>`;
		for (let j=0; j<8; j++) {
			tabla+=`
				<td id="${rowName.charAt(j)+i}" class="${((i+j)%2)?'negra':'blanca'}"></td>`;
		}
		tabla+='</tr><tr><th></th>';
	}
	// Dibujamos el encabezado de las columnas, A..H
	for (let i=0;i<8;i++) {
		tabla+=`<th>${rowName.charAt(i)}</th>`;
	}
	tabla+='</tr>';

	tablero.innerHTML=tabla;

	// Ahora podríamos colocar el caballo en su celda. 
	// Para que quepa dadle un ancho de 50px
	document.getElementById(initialPosition).innerHTML = 
		'<img id="caballo" src="./images/caballo.png" width="50px">';
}

function calcTargets(position) {
	const column = rowName.indexOf(position.charAt(0)) + 1;
	const row = Number(position.charAt(1));
	let targets = [];
	targets.push([column+2, row+1]);
	targets.push([column+2, row-1]);
	targets.push([column-2, row+1]);
	targets.push([column-2, row-1]);
	targets.push([column+1, row+2]);
	targets.push([column+1, row-2]);
	targets.push([column-1, row+2]);
	targets.push([column-1, row-2]);
	return clearTargets(targets).map(cell => 
		rowName.charAt(cell[0]-1) + cell[1]);
}

function clearTargets(targets) {
	return targets.filter(cell => {
		const column = cell[0];
		const row = cell[1];
		return (column >=1 && column <=8
			&& row >= 1 && row <= 8)
	})
}

function getRandomPosition() {
	return "B1"
}