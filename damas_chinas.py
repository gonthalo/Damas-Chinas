
import math
from random import random


tab = [[-1]*9] + [[-1] + [0]*7 + [-1] for ii in range(7)] + [[-1]*9]
blancas = [(2, 2), (1, 1), (2, 1), (1, 2), (3, 1), (1, 3)]
negras = [(8 - aa, 8 - bb) for aa, bb in blancas]
DIFS = [(0, 1), (1, 0), (-1, 0), (0, -1), (1, -1), (-1, 1)]
for xx, yy in negras:
	tab[xx][yy] = 2
for xx, yy in blancas:
	tab[xx][yy] = 1

for el in tab:
	print el

def moves(tabl, pieza):
	nuevas = [pieza]
	viejas = []
	while len(nuevas) > 0:
		x0, y0 = nuevas[0]
		viejas.append((x0, y0))
		nuevas = nuevas[1:]
		for dx, dy in DIFS:
			xx = x0 + 2*dx
			yy = y0 + 2*dy
			if tabl[xx - dx][yy - dy] > 0 and tabl[xx][yy] == 0:
				if xx>=0 and xx<8 and yy<8 and yy>=0:
					if (xx, yy) not in nuevas and (xx, yy) not in viejas:
						nuevas.append((xx, yy))
	for dx, dy in [(0, 1), (1, 0), (-1, 0), (0, -1), (1, -1), (-1, 1)]:
		if tabl[pieza[0] + dx][pieza[1] + dy] == 0:
			viejas.append((pieza[0] + dx, pieza[1] + dy))
	return viejas


def uf(origen, destino, turno):
	if turno==1:
		return (16 - sum(destino))**1.1 - (16 - sum(origen))**1.1
	return sum(destino)**1.1 - sum(origen)**1.1

def movimientos(tabl, turno, mejores=20):
	piezas = []
	for ii in range(1, 8):
		for jj in range(1, 8):
			if tabl[ii][jj]==turno:
				piezas.append((ii, jj))
	movs = []
	for pieza in piezas:
		movs.append(map(lambda x: (pieza, x), moves(tabl, pieza)))
	movs = reduce(lambda x, y: x + y, movs)
	movs.sort(key=lambda x: uf(x[0], x[1], turno))
	return movs[:20], sum(map(lambda x: x[0] + x[1], piezas))

def mover(tabl, mov):
	if mov[0] == mov[1]:
		return
	x0, y0 = mov[0]
	x1, y1 = mov[1]
	tabl[x1][y1] = tabl[x0][y0]
	tabl[x0][y0] = 0

def partida():
	turn = 1
	for ii in range(200):
		rr = int(random()*2)
		jugada, ss = movimientos(tab, turn)
		jugada = jugada[rr]
		print jugada
		if turn==1 and ss==76:
			return 1
		if turn==2 and ss==20:
			return 2
		mover(tab, jugada)
		turn = 3 - turn
		print ' '
		for el in tab[1:8]:
			print el[1:8]

print partida()