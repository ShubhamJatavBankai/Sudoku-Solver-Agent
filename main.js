import * as SudokuLogic from './sudoku-logic.js';
import * as UI from './ui.js';

const app = document.getElementById('app');

let state = {
    gameState: "menu",
    selectedDifficulty: null,
    puzzle: [],
    userInputGrid: [],
    initialGrid: [],
    solvedPuzzle: null,
    selectedCell: null,
    elapsedTime: null,
    errorMessage: null,
    showSelectDifficultyMessage: false,
    difficultyTexts: ["Easy", "Moderate", "Hard"],
};


const handlers = {
    handleMenuSelection(mode) {
        if (state.selectedDifficulty === null) {
            state.showSelectDifficultyMessage = true;
            render();
            return;
        }
        state.showSelectDifficultyMessage = false;
        state.gameState = mode;
        
        if (mode === 'mode2') {
            state.puzzle = Array(9).fill(0).map(() => Array(9).fill(0));
            state.initialGrid = Array.from({ length: 9 }, () => Array(9).fill(0));
        } else {
            const newPuzzle = SudokuLogic.generateRandomPuzzle(state.difficultyTexts[state.selectedDifficulty]);
            state.puzzle = newPuzzle;
            state.initialGrid = newPuzzle.map(r => [...r]);
        }
        state.userInputGrid = state.puzzle.map(r => [...r]);
        
        state.solvedPuzzle = null;
        state.elapsedTime = null;
        state.errorMessage = null;
        state.selectedCell = null;
        render();
    },

    handleDifficultySelection(difficultyIndex) {
        state.selectedDifficulty = difficultyIndex;
        state.showSelectDifficultyMessage = false;
        render();
    },

    handleSolveBoard() {
        state.elapsedTime = null;
        if (state.gameState === "mode2") {
            const [min, max] = SudokuLogic.getFilledCellsRange(state.difficultyTexts[state.selectedDifficulty]);
            const filled = state.puzzle.flat().filter(c => c !== 0).length;
            if (filled < min || filled > max) {
                state.errorMessage = `Please enter between ${min} and ${max} cells for ${state.difficultyTexts[state.selectedDifficulty]} difficulty.`;
                render();
                return;
            }
            if (!SudokuLogic.isValidSudoku(state.puzzle)) {
                state.errorMessage = "Invalid Sudoku. Please check the board for duplicate numbers.";
                render();
                return;
            }
        }

        const boardToSolve = (state.gameState === "mode2" ? state.puzzle : state.userInputGrid).map(r => [...r]);
        const start = performance.now();
        const solution = SudokuLogic.solveSudoku(boardToSolve);
        const end = performance.now();
        
        if (solution) {
            state.elapsedTime = (end - start) / 1000;
            state.errorMessage = null;
            if (state.gameState === "mode1" || state.gameState === "mode2") {
                state.puzzle = solution;
            } else {
                const isCorrect = JSON.stringify(state.userInputGrid) === JSON.stringify(solution);
                state.errorMessage = isCorrect ? "Congratulations! The solution is correct." : "The current solution is incorrect. Keep trying!";
            }
        } else {
            state.errorMessage = "This puzzle is unsolvable.";
        }
        render();
    },

    handleResetBoard() {
        if (state.gameState === 'mode2') {
            state.puzzle = Array(9).fill(0).map(() => Array(9).fill(0));
        } else {
            const newPuzzle = SudokuLogic.generateRandomPuzzle(state.difficultyTexts[state.selectedDifficulty]);
            state.puzzle = newPuzzle;
            state.initialGrid = newPuzzle.map(r => [...r]);
        }
        state.userInputGrid = state.puzzle.map(r => [...r]);
        state.solvedPuzzle = null;
        state.elapsedTime = null;
        state.errorMessage = null;
        state.selectedCell = null;
        render();
    },

    handleCellClick(row, col) {
        if (state.gameState === 'mode2' || (state.gameState === 'mode3' && state.initialGrid[row][col] === 0)) {
            state.selectedCell = [row, col];
            render();
        }
    },

    handleKeyPress(key) {
        if (!state.selectedCell) return;
        const [row, col] = state.selectedCell;

        let targetGrid = (state.gameState === 'mode2') ? state.puzzle : state.userInputGrid;
        
        if (state.gameState === 'mode3' && state.initialGrid[row][col] !== 0) return;

        if (key >= '1' && key <= '9') {
            targetGrid[row][col] = parseInt(key);
        } else if (key === 'Backspace' || key === 'Delete') {
            targetGrid[row][col] = 0;
        }
        
        if (state.gameState === 'mode3' && SudokuLogic.isBoardComplete(state.userInputGrid)) {
            handlers.handleSolveBoard();
        } else {
           render();
        }
    },

    handleBackToMenu() {
        state.gameState = "menu";
        state.selectedDifficulty = null;
        state.errorMessage = null;
        render();
    },
};


function render() {
    app.innerHTML = '';
    
    if (state.gameState === 'menu') {
        app.appendChild(UI.createMenu(state, handlers));
    } else {
        app.appendChild(UI.createGameView(state, handlers, SudokuLogic));
    }
    
    UI.renderErrorMessage(state.errorMessage);
    if(state.errorMessage){
        state.errorMessage = null;
    }
}

document.addEventListener('keydown', (e) => {
    if (state.gameState !== 'menu' && state.selectedCell) {
        if ((e.key >= "1" && e.key <= "9") || e.key === "Backspace" || e.key === "Delete") {
            e.preventDefault();
            handlers.handleKeyPress(e.key);
        }
    }
});

render();