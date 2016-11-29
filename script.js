
var lienzo = document.getElementById("lienzo");
var pluma = lienzo.getContext("2d");
var screen_alto = lienzo.height;
var screen_ancho = lienzo.width;

var tablero = [];
var DIFS = [[0, 1], [1, 0], [-1, 0], [0, -1], [1, -1], [-1, 1]];
var color1, color2, color0
var compTurn;
var turn;
var pausa = false;

var POS1 = [[1, 1], [1, 2], [2, 1], [3, 1], [1, 3], [2, 2]];
var POS2 = [[7, 7], [6, 6], [7, 6], [6, 7], [7, 5], [5, 7]];

//funciones auxiliares

function ynt(num){
	if (num > 0){
		return parseInt(num)
	}
	return parseInt(num) - 1
}

function barajar(lis){
	nn = lis.length;
	for (var ii=0; ii<nn; ii++){
		aa = ynt(Math.random()*nn);
		bb = ynt(Math.random()*nn);
		aux = lis[aa];
		lis[aa] = lis[bb];
		lis[bb] = aux;
	}
}

// funciones de la parte grafica

function randcol(){
	var lis = [parseInt(Math.random()*4)*85, parseInt(Math.random()*4)*85, parseInt(Math.random()*4)*85];
	if (lis[0] + lis[1] + lis[2] == 0 || lis[0] + lis[1] + lis[2] == 765){
		return randcol();
	}
	return lis;
}


function prod(lis, k){
	newl = []
	for (var ii=0; ii<3; ii++){
		newl[ii] = parseInt(lis[ii]*k);
	}
	return newl;
}

function rgbstr(lis){
	return "rgb(" + lis[0] + "," + lis[1] + "," + lis[2] + ")";
}


function circle(x, y, r, c){
	for (ii = ynt(1-r); ii<r; ii++){
		for (jj = ynt(1-r); jj<r; jj++){
			if (ii*ii + jj*jj < r*r){
				if (ii*ii + jj*jj <= (r-3)*(r-3)){
					pluma.fillStyle = rgbstr(c);
				} else {
					tt = r - Math.sqrt(ii*ii + jj*jj);
					pluma.fillStyle = rgbstr(prod(c, tt*(32-5*tt)/51));
				}
				pluma.fillRect(x + ii, y + jj, 1, 1);
			}
		}
	}
}

function dibujar(){
	pluma.fillStyle = "black";
	pluma.beginPath();
	pluma.moveTo(50, 206);
	pluma.lineTo(230, 206);
	pluma.stroke();
	for (var ii=1; ii<8; ii++){
		pluma.beginPath();
		pluma.moveTo(15*ii + 125, 26*ii + 24);
		pluma.lineTo(15*ii + 35, 26*ii + 180);
		pluma.stroke();
		pluma.beginPath();
		pluma.moveTo(155 - 15*ii, 26*ii + 24);
		pluma.lineTo(245 - 15*ii, 26*ii + 180);
		pluma.stroke();
	}
	for (var ii = 2; ii<7; ii++){
		pluma.beginPath();
		pluma.moveTo(15*ii + 125, 26*ii + 24);
		pluma.lineTo(155 - 15*ii, 26*ii + 24);
		pluma.stroke();
		pluma.beginPath();
		pluma.moveTo(245 - 15*ii, 26*ii + 180);
		pluma.lineTo(15*ii + 35, 26*ii + 180);
		pluma.stroke();
	}
	for (var ii=1; ii<8; ii++){
		for (var jj=1; jj<8; jj++){
			circle((jj - ii)*15 + 140, (ii + jj)*26 - 2, 8.2, color0);
			if (tablero[ii][jj] == 1){
				circle((jj - ii)*15 + 140, (ii + jj)*26 - 2, 10.3, color1);
			}
			if (tablero[ii][jj] == 2){
				circle((jj - ii)*15 + 140, (ii + jj)*26 - 2, 10.3, color2);
			}
		}
	}
}

//funciones del juego

function borrar(){
	for (var ii=0; ii<9; ii++){
		tablero[ii] = [];
		for (var jj=0; jj<9; jj++){
			tablero[ii][jj] = 0;
		}
	}
	for (var jj=0; jj<9; jj++){
		tablero[0][jj] = -1;
		tablero[8][jj] = -1;
		tablero[jj][0] = -1;
		tablero[jj][8] = -1;
	}
}

function moves(tabl, pieza){
	nuevas = [pieza];
	viejas = [];
	for (var ii=0; ii<9; ii++){
		viejas[ii] = [];
		for (var jj=0; jj<9; jj++){
			viejas[ii][jj] = true;
		}
	}
	while (nuevas.length > 0){
		aux = nuevas.shift();
		x0 = aux[0];
		y0 = aux[1];
		for (var ii=0; ii<6; ii++){
			dx = DIFS[ii][0];
			dy = DIFS[ii][1];
			xx = x0 + 2*dx;
			yy = y0 + 2*dy;
			if (tabl[xx - dx][yy - dy] > 0 && tabl[xx][yy] == 0){
				if (viejas[xx][yy]){
					nuevas[nuevas.length] = [xx, yy];
					viejas[xx][yy] = false;
				}
			}
		}
	}
	for (var ii=0; ii<6; ii++){
		dx = DIFS[ii][0];
		dy = DIFS[ii][1];
		if (tabl[pieza[0] + dx][pieza[1] + dy] == 0){
			viejas[pieza[0] + dx][pieza[1] + dy] = false;
		}
	}
	for (var ii=1; ii<8; ii++){
		for (var jj=1; jj<8; jj++){
			if (viejas[ii][jj]==false){
				nuevas[nuevas.length] = [ii, jj];
			}
		}
	}
	return nuevas;
}


function uf(origen, fin, turno){
	if (turno==1){
		return Math.exp(Math.log(16 - fin[0] - fin[1])*1.1) - Math.exp(Math.log(16 - origen[0] - origen[1])*1.1);
	}
	return Math.exp(Math.log(fin[0] + fin[1])*1.1) - Math.exp(Math.log(origen[0] + origen[1])*1.1)
}

function compare(a, b){
	return uf(a[0], a[1], compTurn) - uf(b[0], b[1], compTurn);
}

function movimientos(tabl, turno, mejores){
	piezas = [];
	suma = 0;
	for (var ii=0; ii<8; ii++){
		for (var jj=1; jj<8; jj++){
			if (tabl[ii][jj]==turno){
				piezas[piezas.length] = [ii, jj];
				suma = suma + ii + jj;
			}
		}
	}
	movs = [];
	for (var ii=0; ii<piezas.length; ii++){
		lis = moves(tabl, piezas[ii]);
		for (var jj=0; jj<lis.length; jj++){
			movs[movs.length] = [piezas[ii], lis[jj]];
		}
	}
	compTurn = turno;
	movs.sort(compare);
	movs = movs.slice(0, mejores);
	barajar(movs);
	movs.sort(compare);
	return [movs, suma];
}

function mover(tabl, ori, fin){
	if (ori[0] == fin[0] && fin[1] == ori[1]){
		return NaN
	}
	x0 = ori[0];
	y0 = ori[1];
	x1 = fin[0];
	y1 = fin[1];
	tabl[x1][y1] = tabl[x0][y0];
	tabl[x0][y0] = 0;
}

function minimax(tabl, turno, iter, ramas, interes, good){
	opc = movimientos(tabl, turno, ramas)[0];
	if (iter==0){
		if (good){
			return [opc[0], uf(opc[0][0], opc[0][1], turno)];
		} else {
			return uf(opc[0][0], opc[0][1], turno);
		}
	}
	record = -100;
	best = NaN;
	for (var kk=0; kk<opc.length; kk++){
		newtab = [];
		for (var ii=0; ii<9; ii++){
			newtab[ii] = [];
			for (var jj=0; jj<9; jj++){
				newtab[ii][jj] = tabl[ii][jj];
			}
		}
		mover(newtab, opc[kk][0], opc[kk][1]);
		value = uf(opc[kk][0], opc[kk][1], turno) - interes*minimax(newtab, 3 - turno, iter - 1, ramas, interes, false);
		if (value > record){
			record = value;
			best = opc[kk];
		}
	}
	if (good){
		return [best, record];
	} else {
		return record;
	}

}

function empezar(){
	borrar();
	for (var tt=0; tt<POS1.length; tt++){
		tablero[POS1[tt][0]][POS1[tt][1]] = 1;
		tablero[POS2[tt][0]][POS2[tt][1]] = 2;
	}
	color1 = randcol();
	color2 = randcol();
	color0 = [255, 255, 255];
	turn = 1;
}

function actualizar(){
	if (pausa){
		return;
	}
	lis = movimientos(tablero, turn, 5);
	jugada = lis[0][0];
	//console.log(jugada);
	ss = lis[1];
	if (turn==1 && ss==76){
		empezar();
		return
	}
	if (turn==2 && ss==20){
		empezar();
		return
	}
	mover(tablero, jugada[0], jugada[1]);
	turn = 3 - turn;
	dibujar();
}

function paso(){
	pausa = false;
	actualizar();
	pausa = true;
}

empezar();
dibujar();

setInterval(actualizar, 200);
