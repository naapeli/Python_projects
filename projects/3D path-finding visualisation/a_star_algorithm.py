import helper as h
import numpy as np
from tkinter import messagebox


def run(screen, rows, columns, depth):
	for i in range(1, rows + 1):
		for j in range(1, columns + 1):
			for k in range(1, depth + 1):
				cube = h.cubes[i][j][k]
				cube.in_closed = False
				cube.in_open = False
				cube.in_closed = False
				cube.in_open = False
				cube.f = 0
				cube.g = 0
				cube.h = 0
				cube.came_from = None

	open_set = []
	closed_set = []
	start = None
	end = None

	for i in range(1, rows + 1):
		for j in range(1, columns + 1):
			for k in range(1, depth + 1):
				if h.cubes[i][j][k].is_start:
					start = h.cubes[i][j][k]
				if h.cubes[i][j][k].is_end:
					end = h.cubes[i][j][k]
				if start is not None and end is not None:
					break
			if start is not None and end is not None:
				break
		if start is not None and end is not None:
			break

	open_set.append(start)

	while len(open_set) > 0:
		if start == None or end == None:
			messagebox.showwarning(title="Warning", message="Remember to set starting- and endingpoints!")
			return []
		# find lowest f in open set
		current = open_set[0]
		for cell in open_set:
			if cell.f < current.f:
				current = cell

		# check if we have found the end
		if current.is_end:
			path = []
			temp = current
			while temp is not None:
				path.append(temp)
				temp = temp.came_from
			path.append(start)
			return path

		# transfer current from open_set to closed_set
		open_set.remove(current)
		closed_set.append(current)

		# add neighbours of current to open_set (if not in closed_set)
		neighbours = h.get_neighbours(current)
		for neighbour in neighbours:
			if neighbour not in closed_set:
				potential_g = current.g + 1
				if neighbour in open_set:
					if potential_g < neighbour.g:
						neighbour.g = potential_g
				else:
					neighbour.g = potential_g
					open_set.append(neighbour)
					neighbour.in_open = True
				neighbour.h = np.linalg.norm(neighbour.corners.T[0] - end.corners.T[0], ord=1)
				neighbour.f = neighbour.g + neighbour.h
				neighbour.came_from = current

		# drawing open and closed sets
		for cell in open_set:
			if not cell.is_end and not cell.is_start:
				cell.draw_cell(screen, h.show_centers, h.colors[3])
		for cell in closed_set:
			if not cell.is_end and not cell.is_start:
				cell.draw_cell(screen, h.show_centers, h.colors[2])

		# drawing path
		# path = []
		# temp = current
		# while temp.came_from is not None:
		# 	path.append(temp)
		# 	temp = temp.came_from
		# for cell in path:
		# 	if not cell.is_end and not cell.is_start:
		# 		cell.draw_cell(screen, h.show_centers, h.colors[6])
