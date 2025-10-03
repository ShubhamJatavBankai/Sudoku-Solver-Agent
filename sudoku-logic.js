export function generateRandomPuzzle(difficulty) {
    const grid = Array(9).fill(0).map(() => Array(9).fill(0));
    fillDiagonalBoxes(grid);
    const solved = solveSudoku(grid.map(row => [...row]));
    if (!solved) {
        return generateRandomPuzzle(difficulty); // Recurse if solving fails
    }
    const filledCells = getFilledCellsCount(difficulty);
    return removeNumbers(solved, 81 - filledCells);
}

function getFilledCellsCount(difficulty) {
    switch (difficulty) {
        case "Easy": return Math.floor(Math.random() * 5) + 35;
        case "Moderate": return Math.floor(Math.random() * 5) + 30;
        case "Hard": return Math.floor(Math.random() * 5) + 25;
        default: return 35;
    }
}

function fillDiagonalBoxes(grid) {
    for (let i = 0; i < 9; i += 3) {
        fillBox(grid, i, i);
    }
}

function fillBox(grid, row, col) {
    const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    let index = 0;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            grid[row + i][col + j] = nums[index++];
        }
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function removeNumbers(grid, count) {
    let removedCount = 0;
    const attempts = 81;
    const cells = Array.from({ length: 81 }, (_, i) => i);
    shuffle(cells);

    for (const cellIndex of cells) {
        if (removedCount >= count) break;
        const row = Math.floor(cellIndex / 9);
        const col = cellIndex % 9;

        if (grid[row][col] !== 0) {
            const backup = grid[row][col];
            grid[row][col] = 0;
            
            const copy = grid.map(r => [...r]);
            if (countSolutions(copy) !== 1) {
                grid[row][col] = backup;
            } else {
                removedCount++;
            }
        }
    }
    return grid;
}

export function solveSudoku(grid) {
    const emptyCell = findEmptyCell(grid);
    if (!emptyCell) return grid;

    const [row, col] = emptyCell;
    for (let num = 1; num <= 9; num++) {
        if (isValidPlacement(grid, row, col, num)) {
            grid[row][col] = num;
            if (solveSudoku(grid)) {
                return grid;
            }
            grid[row][col] = 0; // Backtrack
        }
    }
    return null;
}

function countSolutions(grid) {
  let counter = 0;
  function search() {
    const emptyCell = findEmptyCell(grid);
    if (!emptyCell) {
      counter++;
      return;
    }
    const [row, col] = emptyCell;
    for (let num = 1; num <= 9 && counter < 2; num++) {
      if (isValidPlacement(grid, row, col, num)) {
        grid[row][col] = num;
        search();
        grid[row][col] = 0; // Backtrack
      }
    }
  }
  search();
  return counter;
}

function findEmptyCell(grid) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (grid[i][j] === 0) return [i, j];
        }
    }
    return null;
}

function isValidPlacement(grid, row, col, num) {
    for (let x = 0; x < 9; x++) {
        if (grid[row][x] === num || grid[x][col] === num) return false;
    }
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[boxRow + i][boxCol + j] === num) return false;
        }
    }
    return true;
}

export function isValidSudoku(grid) {
    for (let i = 0; i < 9; i++) {
        const row = new Set(), col = new Set(), box = new Set();
        for (let j = 0; j < 9; j++) {
            const _row = grid[i][j], _col = grid[j][i], _box = grid[3*Math.floor(i/3)+Math.floor(j/3)][3*(i%3)+(j%3)];
            if (_row !== 0) { if (row.has(_row)) return false; row.add(_row); }
            if (_col !== 0) { if (col.has(_col)) return false; col.add(_col); }
            if (_box !== 0) { if (box.has(_box)) return false; box.add(_box); }
        }
    }
    return true;
}

export function getFilledCellsRange(difficulty) {
    switch (difficulty) {
        case "Easy": return [35, 39];
        case "Moderate": return [30, 34];
        case "Hard": return [25, 29];
        default: return [30, 35];
    }
}

export function isBoardComplete(grid) {
    return grid.every(row => row.every(cell => cell !== 0));
}