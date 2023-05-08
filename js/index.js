import Grid from "./grid.js";
import { DIRECTIONS as DR } from "./helpers.js";

class Snake extends Grid {
  static snakeCellCssClass = "snake-cell";
  static snakeCssClass = "snake";
  static snakeHeadCssClass = "snake-head";
  static snakeBodyCssClass = "snake-body";
  static gridContainerCssSelector = "#snake-container";
  static messageOverClass = "snake-over-message";
  static messageWinClass = "snake-win-message";

  #snake = [];
  #process = null;
  #score = 0;
  #speed = 0;
  #food = null;
  #randomCordinate = [];
  #controls = this.find("#snake-controls-form");
  #startBtn = this.find("#snake-start-game");
  #endBtn = this.find("#snake-end-game");
  #messageContainer = this.find("#snake-message");
  #scoreContainer = this.find("#snake-score");

  constructor({ boxSize, gridCount }) {
    super({
      boxSize,
      gridCount,
      gridCellCssClass: Snake.snakeCellCssClass,
      gridContainerSelector: Snake.gridContainerCssSelector,
    });
    this.direction = DR.LEFT;

    this.#init();
  }

  #init() {
    document.addEventListener("keydown", (event) =>
      this.#updateDirection(event)
    );

    this.#startBtn.addEventListener("click", this.#onChangeStart);
    this.#endBtn.addEventListener("click", this.#onChangeEnd);
  }

  #onChangeStart = (event) => this.#start();
  #onChangeEnd = (event) => this.#end();

  #start() {
    this.#snake = this.#buildSnake(
      Math.floor(this.gridCount / 2),
      Math.floor(this.gridCount / 2)
    );
    // #generateFood() // place img in a random cell

    this.#generateFood();

    this.#speed = +this.#controls.speed.value;
    this.#controls.speed.disabled = true;
    this.#messageContainer.innerHTML = "Welcome to Snake !";

    this.#startBtn.style.display = "none";
    this.#endBtn.style.display = "block";

    // hide button
    // endBtn => display block
    // startBtn => display none

    this.#process = setInterval(() => {
      let { cell, row } = this.#noWallMode(this.#snake[0]);
      // let { cell, row } = this.#snake[0];
      switch (this.direction) {
        case DR.LEFT:
          {
            this.#snake.unshift({
              cell: cell - 1,
              row,
            });
          }
          break;

        case DR.RIGHT:
          {
            this.#snake.unshift({
              cell: cell + 1,
              row,
            });
          }
          break;

        case DR.UP:
          {
            this.#snake.unshift({
              cell,
              row: row - 1,
            });
          }
          break;

        case DR.DOWN:
          {
            this.#snake.unshift({
              cell,
              row: row + 1,
            });
          }
          break;
      }
      this.#clear();
      this.#update();
    }, this.#speed);
  }

  #generateFood() {
    this.#food = new Image();
    this.#food.src = "./img/apple.png";

    const lengthSnake = this.#snake.length;
    const amountCoords = this.gridCount * this.gridCount;

    if (amountCoords === lengthSnake) {
      this.#end("Win");
      return;
    }

    for (let index = 0; index < +Infinity; index++) {
      let coord = null;
      const newCordinatesFood = this.#getRandomCordinate(this.gridCount);
      let count = 0;

      for (const key of this.#snake) {
        if (
          key.row === newCordinatesFood.row &&
          key.cell === newCordinatesFood.cell
        ) {
          count++;
        }
      }

      if (!count) {
        coord = this.#findByCoords(newCordinatesFood);
        coord.appendChild(this.#food);
        break;
      }
    }
  }

  #noWallMode(snake) {
    let { cell, row } = snake;
    if (this.direction === DR.LEFT && cell === 0) {
      cell = this.gridCount;
    }
    if (this.direction === DR.RIGHT && cell === this.gridCount - 1) {
      cell = -1;
    }
    if (this.direction === DR.UP && row === 0) {
      row = this.gridCount;
    }
    if (this.direction === DR.DOWN && row === this.gridCount - 1) {
      row = -1;
    }

    return { cell, row };
  }

  #clear() {
    let cells = this.find(`.${Snake.snakeCssClass}`, this.gridContainer);

    cells.forEach((cell) => {
      cell.className = Snake.snakeCellCssClass;
    });
  }

  #update() {
    // checkHasFoodEaten();

    // if a snake has eaten apple then add +1 to score and push one more object ( {cell, row} )
    // after it ate apple you should generate new coords for the apple to append it in a cell again

    // checkOnTailCrash - if a head bump into the tail. if so need to final game

    // this.#message.innerHTML = 'Game Over', reset score and so on
    this.#checkHasFoodEaten();
    this.#checkOnTailCrash();

    for (const [index, snakeData] of this.#snake.entries()) {
      let cellElement = this.#findByCoords(snakeData);
      if (index === 0) {
        cellElement.classList.add(Snake.snakeHeadCssClass, Snake.snakeCssClass);
      } else {
        cellElement.classList.add(Snake.snakeBodyCssClass, Snake.snakeCssClass);
      }
    }
  }

  #checkHasFoodEaten() {
    if (
      this.#snake[0].row === this.#randomCordinate.row &&
      this.#snake[0].cell === this.#randomCordinate.cell
    ) {
      this.#clearFood();
      this.#generateFood();
      this.#score++;
      this.#renewScore(this.#score);
    } else {
      this.#snake.pop();
    }
  }

  #clearFood() {
    const coord = this.#findByCoords(this.#randomCordinate);
    if (coord.firstChild) coord.removeChild(coord.firstChild);
  }

  #checkOnTailCrash() {
    for (let index = 1; index < this.#snake.length; index++) {
      if (
        this.#snake[0].row === this.#snake[index].row &&
        this.#snake[0].cell === this.#snake[index].cell
      ) {
        this.#end();
      }
    }

    return;
  }

  #updateDirection(event) {
    let key = event.key;

    if (key === "ArrowLeft" && this.direction != DR.RIGHT)
      this.direction = DR.LEFT;
    else if (key === "ArrowUp" && this.direction != DR.DOWN)
      this.direction = DR.UP;
    else if (key === "ArrowRight" && this.direction != DR.LEFT)
      this.direction = DR.RIGHT;
    else if (key === "ArrowDown" && this.direction != DR.UP)
      this.direction = DR.DOWN;
  }

  #getRandomCordinate(maxNumber) {
    const randomCordinate = {
      cell: Math.floor(Math.random() * maxNumber),
      row: Math.floor(Math.random() * maxNumber),
    };
    this.#randomCordinate = randomCordinate;

    return randomCordinate;
  }

  #renewScore(score) {
    this.#scoreContainer.firstElementChild.textContent = score;
  }

  // Supplement the method with additional implementation like reseting all data (like score, buttons state, ...)
  #end(result) {
    this.#endBtn.style.display = "none";
    this.#startBtn.style.display = "block";
    clearInterval(this.#process);
    this.#clearFood();
    this.#clear();
    this.#snake = [];
    this.#controls.speed.disabled = false;
    this.#controls.speed[0].selected = true;
    this.#randomCordinate = [];
    this.direction = DR.LEFT;
    this.#score = 0;
    this.#renewScore(this.#score);
    this.#getEndText(result);
    this.#startBtn.removeEventListener("click", this.#onChangeStart);
    this.#endBtn.removeEventListener("click", this.#onChangeEnd);
    this.#init();
  }

  #findByCoords({ cell, row }) {
    return this.find(
      `[data-cell="${cell}"][data-row="${row}"]`,
      this.gridContainer
    );
  }

  #buildSnake(startCell, startRow, size = 5) {
    return new Array(size)
      .fill(null)
      .map((value, index) => ({ cell: startCell + index, row: startRow }));
  }

  #getEndText(result = "Over") {
    const text = document.createElement("p");
    text.textContent = `Game ${result}`;
    const messageResultClass = `message${result}Class`;
    text.classList.add(Snake[messageResultClass]);
    this.gridContainer.append(text);
    setTimeout(() => {
      text.remove();
    }, 1500);
  }
}

new Snake({
  boxSize: 30,
  gridCount: 12,
});
