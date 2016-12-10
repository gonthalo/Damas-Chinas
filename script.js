
var lienzo = document.getElementById("lienzo");
var pluma = lienzo.getContext("2d");
pluma.font = "16px Arial";
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

var MAR1 = 450;
var MAR2 = 88;
var opciones = [];
var seleccion = [];
var modo = "BOT vs HUMANO";

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

function dibu_pieza(xx, yy, txt){
	if (txt!=""){
		pluma.fillStyle = rgbstr(color1);
		pluma.fillText(txt, (yy - xx)*15 + MAR1 - 5, (xx + yy)*26 + MAR2 + 6);
	}
	if (tablero[xx][yy] == 1){
		circle((yy - xx)*15 + MAR1, (xx + yy)*26 + MAR2, 10.3, color1);
	}
	if (tablero[xx][yy] == 2){
		circle((yy - xx)*15 + MAR1, (xx + yy)*26 + MAR2, 10.3, color2);
	}
}

function dibujar(){
	pluma.fillStyle = "white";
	pluma.fillRect(0, 0, screen_ancho, screen_alto);
	pluma.fillStyle = "black";
	pluma.beginPath();
	pluma.moveTo(MAR1 - 90, 208 + MAR2);
	pluma.lineTo(MAR1 + 90, 208 + MAR2);
	pluma.stroke();
	for (var ii=1; ii<8; ii++){
		pluma.beginPath();
		pluma.moveTo(15*(ii - 1) + MAR1, 26*(ii + 1) + MAR2);
		pluma.lineTo(15*(ii - 7) + MAR1, 26*(ii + 7) + MAR2);
		pluma.stroke();
		pluma.beginPath();
		pluma.moveTo(MAR1 - 15*(ii - 1), 26*(ii + 1) + MAR2);
		pluma.lineTo(MAR1 - 15*(ii - 7), 26*(ii + 7) + MAR2);
		pluma.stroke();
	}
	for (var ii = 2; ii<7; ii++){
		pluma.beginPath();
		pluma.moveTo(15*(ii - 1) + MAR1, 26*(ii + 1) + MAR2);
		pluma.lineTo(MAR1 - 15*(ii - 1), 26*(ii + 1) + MAR2);
		pluma.stroke();
		pluma.beginPath();
		pluma.moveTo(MAR1 - 15*(ii - 7), 26*(ii + 7) + MAR2);
		pluma.lineTo(15*(ii - 7) + MAR1, 26*(ii + 7) + MAR2);
		pluma.stroke();
	}
	for (var ii=1; ii<8; ii++){
		for (var jj=1; jj<8; jj++){
			circle((jj - ii)*15 + MAR1, (ii + jj)*26 + MAR2, 8.2, color0);
			dibu_pieza(ii, jj, "");
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
	movs = movs.slice(0, 2*mejores);
	barajar(movs);
	movs.sort(compare);
	return [movs.slice(0, mejores), suma];
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

function gana(tabl, turno){
	if (turno==1){
		for (var ii=0; ii<POS2.length; ii++){
			if (tabl[POS2[ii][0]][POS2[ii][1]] != 1){
				return false;
			}
		}
		return true;
	}
	for (var ii=0; ii<POS1.length; ii++){
		if (tabl[POS1[ii][0]][POS1[ii][1]] != 2){
			return false;
		}
	}
	return true;
}

function minimax(tabl, turno, iter, ramas, interes, good){
	if (good){
		if (gana(tabl, turno)||gana(tabl, 3 - turno)){
			return [[[0, 0], [0, 0]]];
		}
		opc = [];
		best = [];
		record = [];
		for (var tt=0; tt<=iter; tt++){
			opc[tt] = [];
			best[tt] = [];
			record[tt] = 1000;
		}
	}
	if (gana(tabl, 3 - turno)){
		if (gana(tabl, turno)){
			return 0;
		}
		return 100;
	}
	opc[iter] = movimientos(tabl, turno, ramas)[0];
	if (iter==0){
		if (good){
			return [opc[iter][0], uf(opc[iter][0][0], opc[iter][0][1], turno)];
		} else {
			return uf(opc[iter][0][0], opc[iter][0][1], turno);
		}
	}
	record[iter] = 100;
	best[iter] = NaN;
	for (var kk=0; kk<opc[iter].length; kk++){
		newtab = [];
		for (var ii=0; ii<9; ii++){
			newtab[ii] = [];
			for (var jj=0; jj<9; jj++){
				newtab[ii][jj] = tabl[ii][jj];
			}
		}
		mover(newtab, opc[iter][kk][0], opc[iter][kk][1]);
		value = uf(opc[iter][kk][0], opc[iter][kk][1], turno) - interes*minimax(newtab, 3 - turno, iter - 1, ramas, interes, false);
		if (value < record[iter]){
			record[iter] = value;
			best[iter] = opc[iter][kk];
		}
	}
	if (good){
		return [best[iter], record[iter]];
	} else {
		return record[iter];
	}
}

function cambiar_colores(){
	color1 = randcol();
	color2 = randcol();
	dibujar();
}

function empezar(){
	borrar();
	for (var tt=0; tt<POS1.length; tt++){
		tablero[POS1[tt][0]][POS1[tt][1]] = 1;
		tablero[POS2[tt][0]][POS2[tt][1]] = 2;
	}
	color0 = [255, 255, 255];
	turn = 1;
	cambiar_colores();
}

function actualizar(){
	if (pausa){
		return;
	}
	if (modo == "BOT vs HUMANO" && turn == 1){
		return;
	}
	lis = movimientos(tablero, turn, 5);
	jugada = [];
	if (turn==1){
		jugada = minimax(tablero, turn, 6, 6, 0.93, true)[0];
	} else {
		jugada = minimax(tablero, turn, 6, 6, 0.93, true)[0];
	}
	//console.log(jugada);
	mover(tablero, jugada[0], jugada[1]);
	turn = 3 - turn;
	dibujar();
	if (gana(tablero, 1) || gana(tablero, 2)){
		empezar();
		return
	}
}

function game_hb(bot){
	empezar();
	turn = 2;
	dibujar();
	while (!gana(tablero, 1) && !gana(tablero, 2)){
		if (turn == 1){
			jugada = choice(tablero, turn, bot);
			mover(tablero, jugada[0], jugada[1]);
			turn = 3 - turn
			dibujar();
		} else {
			aux = 42;
		}
	}
}

function paso(){
	pausa = false;
	actualizar();
	pausa = true;
}

lienzo.addEventListener("click", function (e){
	var x;
	var y;
	if (e.pageX || e.pageY) {
		x = e.pageX;
		y = e.pageY;
	} else {
		x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}
	x -= lienzo.offsetLeft;
	y -= lienzo.offsetTop;
	console.log(x, y);
	x0 = (x - MAR1)/30.0;
	y0 = (y - MAR2)/52.0;
	x = ynt(y0 - x0 + 0.5);
	y = ynt(y0 + x0 + 0.5);
	console.log(x, y);
	if (tablero[x][y] == turn){
		dibujar();
		seleccion = [x, y];
		opciones = moves(tablero, [x, y]);
		for (var ii=0; ii<opciones.length; ii++){
			dibu_pieza(opciones[ii][0], opciones[ii][1], "X");
		}
		return;
	}
	if (tablero[x][y] == 0){
		for (ii=0; ii<opciones.length; ii++){
			if (opciones[ii][0] == x && opciones[ii][1] == y){
				mover(tablero, seleccion, opciones[ii]);
				turn = 3 - turn;
				if (gana(tablero, 1) || gana(tablero, 2)){
					empezar();
				}
				dibujar();
				return;
			}
		}
	}
}, false);

empezar();
dibujar();

setInterval(actualizar, 500);
