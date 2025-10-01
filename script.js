const X_CLASS = 'x';
const O_CLASS = 'o';
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('game-board');
const statusElement = document.getElementById('status');
const playAgainButton = document.getElementById('play-again');

let oTurn;

startGame();

playAgainButton.addEventListener('click', startGame);

function startGame() {
    oTurn = false;
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(O_CLASS);
        cell.classList.remove('winning');
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    setBoardHoverClass();
    statusElement.innerText = "X's turn";
    playAgainButton.style.display = 'none';
}

function handleClick(e) {
    const cell = e.target;
    const currentClass = oTurn ? O_CLASS : X_CLASS;
    placeMark(cell, currentClass);
    if (checkWin(currentClass)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        setBoardHoverClass();
        if (oTurn) {
            setTimeout(computerMove, 500);
        }
    }
}

function endGame(draw) {
    if (draw) {
        statusElement.innerText = 'Draw!';
    } else {
        statusElement.innerText = `${oTurn ? "O's" : "X's"} Wins!`;
        highlightWinningCells();
    }
    playAgainButton.style.display = 'block';
}

function isDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
    });
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
}

function swapTurns() {
    oTurn = !oTurn;
    statusElement.innerText = oTurn ? "O's turn" : "X's turn";
}

function setBoardHoverClass() {
    board.classList.remove(X_CLASS);
    board.classList.remove(O_CLASS);
    if (oTurn) {
        board.classList.add(O_CLASS);
    } else {
        board.classList.add(X_CLASS);
    }
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass);
        });
    });
}

function highlightWinningCells() {
    const winningCombination = WINNING_COMBINATIONS.find(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(oTurn ? O_CLASS : X_CLASS);
        });
    });

    winningCombination.forEach(index => {
        cellElements[index].classList.add('winning');
    });
}

function computerMove() {
    const availableCells = [...cellElements].filter(cell => {
        return !cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS);
    });

    // Basic AI: check for a winning move
    for (const cell of availableCells) {
        cell.classList.add(O_CLASS);
        if (checkWin(O_CLASS)) {
            placeMark(cell, O_CLASS);
            endGame(false);
            return;
        }
        cell.classList.remove(O_CLASS);
    }

    // Basic AI: block opponent's winning move
    for (const cell of availableCells) {
        cell.classList.add(X_CLASS);
        if (checkWin(X_CLASS)) {
            cell.classList.remove(X_CLASS);
            placeMark(cell, O_CLASS);
            swapTurns();
            setBoardHoverClass();
            return;
        }
        cell.classList.remove(X_CLASS);
    }

    // Otherwise, pick a random cell
    const randomIndex = Math.floor(Math.random() * availableCells.length);
    const cell = availableCells[randomIndex];
    placeMark(cell, O_CLASS);

    if (checkWin(O_CLASS)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        setBoardHoverClass();
    }
}
