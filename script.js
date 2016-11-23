
var lienzo = document.getElementById("lienzo");
var pluma = lienzo.getContext("2d");
var screen_alto = lienzo.height;
var screen_ancho = lienzo.width;

var tablero = [];
var DIFS = [[0, 1], [1, 0], [-1, 0], [0, -1], [1, -1], [-1, 1]];
var color1, color2, color0


function ynt(num){
	if (num > 0){
		return parseInt(num)
	}
	return parseInt(num) - 1
}

function randcol(){
	var lis = [parseInt(Math.random()*4)*85, parseInt(Math.random()*4)*85, parseInt(Math.random()*4)*85];
	if (lis[0] + lis[1] + lis[2]==0){
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
		}
	}
}


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
		x0, y0 = nuevas[0][0], nuevas[0][1];
		nuevas.pop(0);
		for (var ii=0; ii<6; ii++){
			dx, dy = DIFS[ii][0], DIFS[ii][1];
			yy = y0 + 2*dy;
			if (tabl[xx - dx][yy - dy] > 0 && tabl[xx][yy] == 0){
				if (viejas[ii][jj]){
					nuevas[nuevas.length] = [xx, yy];
					viejas[ii][jj] = false;
				}
			}
		}
	}
	for (var ii=0; ii<6; ii++){
		dx, dy = DIFS[ii][0], DIFS[ii][1];
		if (tabl[pieza[0] + dx][pieza[1] + dy] == 0){
			viejas[pieza[0] + dx][pieza[1] + dy] = false;
		}
	}
	for (var ii=1; ii<8; ii++){
		if (viejas[ii][jj]==false){
			nuevas[nuevas.length] = [ii, jj];
		}
	}
	return nuevas
}


function empezar(){
	borrar();
	color1 = randcol();
	color2 = randcol();
	color0 = [255, 255, 255];
}

empezar();
dibujar();