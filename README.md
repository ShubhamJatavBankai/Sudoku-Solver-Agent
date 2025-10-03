# Sudoku Solver Agent

## Overview

This project implements a **Sudoku Solver Agent** that uses a **backtracking algorithm** for solving Sudoku puzzles. The Agent can generate random puzzles, check for validity, and solve both randomly generated and user-provided puzzles. The Sudoku puzzle-solving process is modeled as a **constraint satisfaction problem (CSP)**, where the Agent uses constraints to ensure the puzzle is solved correctly.

---

## AI Agent

The agent used in this Sudoku Solver is a **search-based agent** that employs **backtracking** for solving the puzzle. The backtracking algorithm is a depth-first search technique where the AI tries different possibilities (placements for numbers) and "backtracks" when it encounters a conflict.

- **Problem-solving technique:** **Backtracking Algorithm** (Depth-First Search)
- **Heuristic used:** The agent uses basic rules of Sudoku (row, column, and box constraints) to prune its search space.

---

## Problem-Solving Algorithm

### Constraint Satisfaction Problem (CSP)

The Sudoku problem is modeled as a **constraint satisfaction problem** (CSP). In this problem, the objective is to fill in a 9x9 grid such that:

- Each row contains the numbers 1-9 without repetition.
- Each column contains the numbers 1-9 without repetition.
- Each of the nine 3x3 subgrids contains the numbers 1-9 without repetition.

### Problem Formulation

- **Variables**: Each cell in the 9x9 Sudoku grid is a variable. So, we have 81 variables, each corresponding to one cell in the grid.
- **Domains**: The domain of each variable is the set of numbers from 1 to 9. However, the domain gets narrowed down as the puzzle progresses.

- **Constraints**:
  1. **Row Constraints**: No two cells in the same row can have the same number.
  2. **Column Constraints**: No two cells in the same column can have the same number.
  3. **Box Constraints**: No two cells in the same 3x3 subgrid can have the same number.

### Backtracking Algorithm

The backtracking algorithm works as follows:

1. Start by selecting an empty cell.
2. Try placing each number from 1 to 9 in the cell.
3. If placing the number doesn't violate any constraints (row, column, or subgrid), move to the next empty cell.
4. If all numbers have been tried and no valid placement is found, backtrack by removing the last placed number and trying the next possibility.
5. If the grid is completely filled and all constraints are satisfied, the puzzle is solved.

The algorithm continues until the puzzle is solved or it is determined that no solution exists.

---

## PEAS (Performance Measure, Environment, Actuators, Sensors)

### Performance Measure (P)

- **Correctness**: The puzzle is solved correctly if the solution satisfies all the Sudoku constraints (no repeating numbers in rows, columns, or 3x3 subgrids).
- **Speed**: The algorithm should solve the puzzle as efficiently as possible, although in the worst case, the backtracking approach may take a longer time for more complex puzzles.

### Environment (E)

- **State space**: The environment consists of the 9x9 grid, where each cell contains a number or is empty (denoted by 0).
- **Constraints**: The environment is bound by the Sudoku rules, which ensure that the values in the grid adhere to the row, column, and box constraints.

### Actuators (A)

- **Grid updates**: The agent updates the Sudoku grid by placing numbers in the empty cells during the solving process. These updates are executed by the backtracking algorithm.

### Sensors (S)

- **Grid state**: The agent senses the current state of the grid, identifying which cells are filled and which are empty. It also senses the validity of placing a number in a given cell by checking row, column, and box constraints.

---

## Properties of Task Environment

1. **Fully Observable**: The agent has access to the complete state of the environment (the entire Sudoku grid). There are no hidden elements in the task environment.

2. **Discrete**: The environment is discrete because the grid consists of fixed cells (81 total), and each cell can only take a value from the set {1, 2, 3, ..., 9} or remain empty (0).

3. **Static**: The environment does not change unless the agent makes a move (places a number in an empty cell). It is not dynamic, and the puzzle state only changes based on the agent's actions.

4. **Deterministic**: The environment is deterministic because, once the agent chooses to place a number in a cell, the outcome (whether the puzzle is still solvable or not) is predictable.

5. **Single-agent**: The Sudoku puzzle is a single-agent task, as only one agent is responsible for solving the puzzle at any given time. There is no interaction with other agents.

---

## Features

- **Puzzle Generation**: The Agent can generate random Sudoku puzzles of varying difficulty (Easy, Moderate, Hard). The generated puzzles are solvable and adhere to the basic rules of Sudoku.
- **Puzzle Solving**: The Agent can solve any given Sudoku puzzle using the backtracking algorithm.

- **Puzzle Validation**: The Agent can check if a given Sudoku grid is valid, ensuring that no rows, columns, or subgrids contain duplicate numbers.

- **User Interaction**: Users can interact with the Agent to generate puzzles, solve puzzles, and validate solutions.

---

## How to Use

1. Visit the URL to use it:
   ```bash
    https://www.sudoku-solver-agent.vercel.app
   ```
2. Clone the repository:
   ```bash
   git clone https://github.com/ShubhamJatavBankai/Sudoku-Solver-Agent.git
   cd Sudoku-Solver-Agent
   run in live server or open index.html in browser window
   ```