export function createMenu(state, handlers) {
    const { selectedDifficulty, showSelectDifficultyMessage, difficultyTexts } = state;
    const { handleMenuSelection, handleDifficultySelection } = handlers;

    const menuContainer = document.createElement('div');
    menuContainer.className = 'bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full';
    
    let difficultyHTML = difficultyTexts.map((text, index) => {
        const isSelected = selectedDifficulty === index;
        return `
            <div class="difficulty-option flex items-center gap-2 cursor-pointer" data-index="${index}">
                <div class="w-6 h-6 rounded-full border-2 border-gray-400 flex items-center justify-center ${isSelected ? 'bg-rose-500 border-rose-500' : 'bg-white'}">
                    ${isSelected ? '<div class="w-3 h-3 bg-white rounded-full"></div>' : ''}
                </div>
                <span class="text-lg font-medium">${text}</span>
            </div>
        `;
    }).join('');
    
    menuContainer.innerHTML = `
        <h1 class="text-3xl font-bold text-center mb-8 text-rose-600">Sudoku AI</h1>
        <div class="space-y-4">
            <button data-mode="mode1" class="w-full py-4 px-6 bg-gradient-to-r from-rose-400 to-rose-500 text-white rounded-xl shadow-md text-lg font-medium transition-transform hover:scale-105">Mode 1: AI Agent Solves Randomly Generated Board</button>
            <button data-mode="mode2" class="w-full py-4 px-6 bg-gradient-to-r from-teal-400 to-teal-500 text-white rounded-xl shadow-md text-lg font-medium transition-transform hover:scale-105">Mode 2: AI Agent Solves User Generated Board</button>
            <button data-mode="mode3" class="w-full py-4 px-6 bg-gradient-to-r from-purple-400 to-purple-500 text-white rounded-xl shadow-md text-lg font-medium transition-transform hover:scale-105">Mode 3: User Solves Randomly Generated Board</button>
        </div>
        <div class="mt-8">
            <h2 class="text-xl font-semibold mb-4 text-gray-800">Select Difficulty:</h2>
            <div class="flex justify-around">${difficultyHTML}</div>
        </div>
        ${showSelectDifficultyMessage ? `<div class="mt-6 p-4 bg-red-100 text-red-700 rounded-lg text-center">Please select a difficulty first!</div>` : ''}
    `;

    menuContainer.querySelectorAll('button[data-mode]').forEach(btn => {
        btn.addEventListener('click', () => handleMenuSelection(btn.dataset.mode));
    });
    menuContainer.querySelectorAll('.difficulty-option').forEach(el => {
        el.addEventListener('click', () => handleDifficultySelection(parseInt(el.dataset.index)));
    });

    return menuContainer;
}

export function createGameView(state, handlers, logic) {
    const { gameState, selectedDifficulty, elapsedTime, difficultyTexts } = state;
    const { handleSolveBoard, handleResetBoard, handleBackToMenu } = handlers;
    
    const gameContainer = document.createElement('div');
    gameContainer.className = 'flex flex-col md:flex-row gap-8 items-center';

    const boardContainer = document.createElement('div');
    boardContainer.id = 'sudoku-board-container';
    boardContainer.appendChild(createSudokuBoard(state, handlers));

    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'flex flex-col gap-4 w-full md:w-64';

    const range = logic.getFilledCellsRange(difficultyTexts[selectedDifficulty]);
    const gameModeTitle = gameState === 'mode1' ? 'AI Solves Random Board' : gameState === 'mode2' ? 'AI Solves Your Board' : 'You Solve Random Board';

    controlsContainer.innerHTML = `
        <div class="bg-white p-4 rounded-xl shadow-lg">
            <h2 class="text-xl font-bold text-rose-600 mb-2">${gameModeTitle}</h2>
            <p class="text-sm font-medium mb-1">Difficulty: ${difficultyTexts[selectedDifficulty]}</p>
            ${gameState === 'mode2' ? `<p class="text-xs text-gray-600 mb-4">Enter between ${range[0]} and ${range[1]} cells</p>` : ''}
            ${elapsedTime !== null ? `<p class="text-sm font-medium text-teal-600 mb-4">Solved in ${elapsedTime.toFixed(3)} seconds</p>` : ''}
            <div class="flex flex-col gap-2">
                <button id="solve-btn" class="bg-rose-500 text-white py-2 px-4 rounded-lg shadow hover:bg-rose-600 transition-colors">${gameState === 'mode3' ? 'Check Solution' : 'Solve Board'}</button>
                <button id="reset-btn" class="bg-teal-500 text-white py-2 px-4 rounded-lg shadow hover:bg-teal-600 transition-colors">${gameState === 'mode2' ? 'Reset Board' : 'New Board'}</button>
                <button id="back-btn" class="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg shadow hover:bg-gray-300 transition-colors">Back to Menu</button>
            </div>
        </div>
        ${gameState === 'mode3' ? `
            <div class="bg-white p-4 rounded-xl shadow-lg">
                <h3 class="text-lg font-semibold text-rose-600 mb-2">Instructions</h3>
                <p class="text-sm text-gray-700">Click a cell, then use number keys to enter a value. Use Backspace or Delete to clear.</p>
            </div>
        ` : ''}
    `;

    gameContainer.appendChild(boardContainer);
    gameContainer.appendChild(controlsContainer);

    // Add event listeners
    controlsContainer.querySelector('#solve-btn').addEventListener('click', handleSolveBoard);
    controlsContainer.querySelector('#reset-btn').addEventListener('click', handleResetBoard);
    controlsContainer.querySelector('#back-btn').addEventListener('click', handleBackToMenu);
    
    return gameContainer;
}

function createSudokuBoard(state, handlers) {
    const { gameState, userInputGrid, puzzle, initialGrid, selectedCell } = state;
    const { handleCellClick } = handlers;
    
    const boardEl = document.createElement('div');
    boardEl.className = 'bg-white rounded-xl shadow-xl p-4 select-none';
    boardEl.tabIndex = 0;

    const gridEl = document.createElement('div');
    gridEl.className = 'grid grid-cols-9';
    
    const currentBoard = gameState === 'mode3' ? userInputGrid : puzzle;

    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const cellEl = document.createElement('div');
            
            const isInitial = initialGrid[r] && initialGrid[r][c] !== 0;
            const isSelected = selectedCell && selectedCell[0] === r && selectedCell[1] === c;
            
            let borderClasses = ' border-gray-300';
            if (r % 3 === 0) borderClasses += ' border-t-2 border-t-gray-800'; else borderClasses += ' border-t';
            if (c % 3 === 0) borderClasses += ' border-l-2 border-l-gray-800'; else borderClasses += ' border-l';
            if (r === 8) borderClasses += ' border-b-2 border-b-gray-800';
            if (c === 8) borderClasses += ' border-r-2 border-r-gray-800';

            cellEl.className = `w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center font-bold text-lg cursor-pointer ${isInitial ? 'bg-gray-100' : 'bg-white'} ${isSelected ? 'bg-yellow-200' : ''}` + borderClasses;

            const cellValue = currentBoard[r][c];
            if (cellValue !== 0) {
                const isConflict = (gameState === 'mode3') && highlightConflicts(currentBoard, r, c, cellValue);
                cellEl.innerHTML = `<span class="${isInitial ? 'text-gray-800' : 'text-rose-600'} ${isConflict ? 'text-red-500' : ''}">${cellValue}</span>`;
            }

            cellEl.addEventListener('click', () => handleCellClick(r, c));
            gridEl.appendChild(cellEl);
        }
    }
    boardEl.appendChild(gridEl);
    return boardEl;
}

function highlightConflicts(board, row, col, value) {
    if (value === 0) return false;
    for (let i = 0; i < 9; i++) {
        if (i !== col && board[row][i] === value) return true;
        if (i !== row && board[i][col] === value) return true;
    }
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if ((boxRow + i !== row || boxCol + j !== col) && board[boxRow + i][boxCol + j] === value) {
                return true;
            }
        }
    }
    return false;
}

export function renderErrorMessage(errorMessage) {
    const existingModal = document.getElementById('error-modal');
    if (existingModal) existingModal.remove();

    if (errorMessage) {
        const modal = document.createElement('div');
        modal.id = 'error-modal';
        modal.className = 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-xl border-2 border-red-500 max-w-md w-full z-50';
        modal.innerHTML = `
            <p class="text-center text-rose-600 font-bold">${errorMessage}</p>
            <button class="dismiss-error mt-4 bg-red-500 text-white py-1 px-4 rounded-lg mx-auto block">Dismiss</button>
        `;
        document.body.appendChild(modal);
        modal.querySelector('.dismiss-error').addEventListener('click', () => {
            modal.remove();
        });
    }
}