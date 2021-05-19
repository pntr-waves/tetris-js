let field = document.getElementsByClassName("block");

newGrid = (width, height) => {
  let grid = new Array(height);
  for (let i = 0; i < height; i++) {
    grid[i] = new Array(width);
  }

  let index = 0;
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      grid[i][j] = {
        index: index++,
        value: 0,
      };
    }
  }
  return {
    board: grid,
    width: width,
    height: height,
  };
};

resetGrid = (grid) => {
  for (let i = 0; i < grid.height; i++) {
    for (let j = 0; i < grid.width; j++) {
      grid.board[i][j].value = 0;
    }
  }

  Array.from(field).forEach((e) => {
    e.style.background = TRANSPARENT;
  });
};

newTetromino = (blocks, colors, start_x, start_y) => {
  let index = Math.floor(Math.random() * blocks.length);
  return {
    block: JSON.parse(JSON.stringify(blocks[index])),
    color: COLORS[index],
    x: start_x,
    y: start_y,
  };
};

drawTetromino = (tetromino, gird) => {
  tetromino.block.forEach((row, i) => {
    row.forEach((value, j) => {
      let x = tetromino.x + i;
      let y = tetromino.y + j;
      if (value > 0) {
        field[grid.board[x][y].index].style.background = tetromino.color;
      }
    });
  });
};

clearTetromino = (tetromino, grid) => {
  tetromino.block.forEach((row, i) => {
    row.forEach((value, j) => {
      let x = tetromino.x + i;
      let y = tetromino.y + j;
      if (value > 0) {
        field[grid.board[x][y].index].style.background = TRANSPARENT;
      }
    });
  });
};

isInGrid = (x, y, grid) => {
  return x < grid.height && x >= 0 && y >= 0 && y < grid.width;
};

isFilled = (x, y, grid) => {
  if (!isInGrid(x, y, grid)) {
    return false;
  } else {
    return grid.board[x][y].value !== 0;
  }
};

moveAble = (tetromino, grid, direction) => {
  let newX = tetromino.x;
  let newY = tetromino.y;
  switch (direction) {
    case DIRECTION.DOWN: {
      newX = tetromino.x + 1;
      break;
    }
    case DIRECTION.LEFT: {
      newY = tetromino.y - 1;
      break;
    }
    case DIRECTION.RIGHT: {
      newY = tetromino.y + 1;
      break;
    }
  }
  return tetromino.block.every((row, i) => {
    return row.every((value, j) => {
      let x = newX + i;
      let y = newY + j;
      return (value === 0) | (isInGrid(x, y, grid) && !isFilled(x, y, grid));
    });
  });
};

let grid = newGrid(GRID_WIDTH, GRID_HEIGHT);

let tetromino = newTetromino(BLOCK, COLORS, START_X, START_Y);

drawTetromino(tetromino, grid);

moveDown = (tetromino, grid) => {
  if (!moveAble(tetromino, grid, DIRECTION.DOWN)) return;
  clearTetromino(tetromino, grid);
  tetromino.x++;
  drawTetromino(tetromino, grid);
};
moveLeft = (tetromino, grid) => {
  if (!moveAble(tetromino, grid, DIRECTION.LEFT)) return;
  clearTetromino(tetromino, grid);
  tetromino.y--;
  drawTetromino(tetromino, grid);
};
moveRight = (tetromino, grid) => {
  if (!moveAble(tetromino, grid, DIRECTION.RIGHT)) return;
  clearTetromino(tetromino, grid);
  tetromino.y++;
  drawTetromino(tetromino, grid);
};
rotate = (tetromino, grid) => {
  if (!rotateAble(tetromino, grid)) return;
  clearTetromino(tetromino, grid);
  for (let y = 0; y < tetromino.block.length; y++) {
    for (let x = 0; x < y; ++x) {
      [tetromino.block[x][y], tetromino.block[y][x]] = [
        tetromino.block[y][x],
        tetromino.block[x][y],
      ];
    }
  }
  tetromino.block.forEach((row) => row.reverse());
  drawTetromino(tetromino, grid);
};
handDrop = (tetromino, grid) => {
  clearTetromino(tetromino, grid);
  while (moveAble(tetromino, grid, DIRECTION.DOWN)) {
    tetromino.x++;
  }

  drawTetromino(tetromino, grid);
};

updateGrid = (tetromino, grid) => {
  tetromino.block.forEach((row, i) => {
    row.forEach((value, j) => {
      let x = tetromino.x + i;
      let y = tetromino.y + j;
      if (value > 0 && isInGrid(x, y, grid)) {
        grid.board[x][y].value = value;
      }
    });
  });
};

checkFilledRow = (row) => {
  return row.every((value) => {
    return value.value !== 0;
  });
};

deleteRow = (row_index, grid) => {
  for (let row = row_index; row > 0; row--) {
    for (let col = 0; col < 10; col++) {
      grid.board[row][col].value = grid.board[row - 1][col].value;
      let value = grid.board[row][col].value;

      field[grid.board[row][col].index].style.background =
        value === 0 ? TRANSPARENT : COLORS[value - 1];
    }
  }
};

checkGrid = (grid) => {
  grid.board.forEach((row, i) => {
    if (checkFilledRow(row)) {
      deleteRow(i, grid);
    }
  });
};

setInterval(() => {
  if (moveAble(tetromino, grid, DIRECTION.DOWN)) {
    moveDown(tetromino, grid);
  } else {
    updateGrid(tetromino, grid);
    checkGrid(grid);
    tetromino = newTetromino(BLOCK, COLORS, START_X, START_Y);
    drawTetromino(tetromino);
  }
}, 500);

rotateAble = (tetromino, grid) => {
  let cloneBlock = JSON.parse(JSON.stringify(tetromino.block));

  for (let y = 0; y < cloneBlock.length; y++) {
    for (let x = 0; x < y; ++x) {
      [cloneBlock[x][y], cloneBlock[y][x]] = [
        cloneBlock[y][x],
        cloneBlock[x][y],
      ];
    }
  }
  cloneBlock.forEach((row) => row.reverse());

  return cloneBlock.every((row, i) => {
    return row.every((value, j) => {
      let x = tetromino.x + i;
      let y = tetromino.y + j;
      return (value === 0) | (isInGrid(x, y, grid) && !isFilled(x, y, grid));
    });
  });
};

document.addEventListener("keydown", (e) => {
  e.preventDefault();
  let key = e.which;
  switch (key) {
    case KEY.DOWN: {
      moveDown(tetromino, grid);
      break;
    }
    case KEY.LEFT: {
      moveLeft(tetromino, grid);
      break;
    }
    case KEY.RIGHT: {
      moveRight(tetromino, grid);
      break;
    }
    case KEY.UP: {
      rotate(tetromino, grid);
      break;
    }
    case KEY.SPACE: {
      handDrop(tetromino, grid);
      break;
    }
  }
});

let btns = document.querySelectorAll('[id*="btn-"]');

btns.forEach((e) => {
  let btn_id = e.getAttribute("id");
  let body = document.querySelector("body");
  e.addEventListener("click", () => {
    switch (btn_id) {
      case "btn-drop": {
        handDrop(tetromino, grid);
        break;
      }
      case "btn-up": {
        rotate(tetromino, grid);
        break;
      }
      case "btn-down": {
        moveDown(tetromino, grid);
        break;
      }
      case "btn-left": {
        moveLeft(tetromino, grid);
        break;
      }
      case "btn-right": {
        moveRight(tetromino, grid);
        break;
      }
      case "btn-play":
        body.classList.add("play");
        if (body.classList.contains("pause")) {
          body.classList.remove("pause");
        }
        break;
      case "btn-theme":
        body.classList.toggle("dark");
        break;
      case "btn-pause":
        let btnplay = document.querySelector("#btn-play");
        btnplay.innerHTML = "Resume";
        body.classList.remove("play");
        body.classList.add("pause");
        break;
      case "btn-new-game":
        body.classList.add("play");
        body.classList.remove("pause");
        break;
      case "btn-help":
        let how_to = document.querySelector(".how-to");
        how_to.classList.toggle("active");
        break;
    }
  });
});
