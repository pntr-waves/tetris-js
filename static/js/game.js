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
  return x < grid.height && (x >= 0) & (y >= 0) & (y < grid.width);
};

isFilled = (x,y,grid)=>{
  if()
}

moveDown = (tetromino, grid) => {
  clearTetromino(tetromino, grid);
  tetromino.x++;
  drawTetromino(tetromino, grid);
};

let grid = newGrid(GRID_WIDTH, GRID_HEIGHT);

let tetromino = newTetromino(BLOCK, COLORS, START_X, START_Y);

drawTetromino(tetromino, grid);

let btns = document.querySelectorAll('[id*="btn-"]');

btns.forEach((e) => {
  let btn_id = e.getAttribute("id");
  let body = document.querySelector("body");
  e.addEventListener("click", () => {
    switch (btn_id) {
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
