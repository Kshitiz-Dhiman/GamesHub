class TicTacToe {
    constructor() {
        this.board = document.querySelector('.board');
        this.cells = document.querySelectorAll('[data-cell]');
        this.status = document.querySelector('.status');
        this.restartButton = document.querySelector('.restart-btn');
        this.xScore = document.querySelector('.x-score');
        this.oScore = document.querySelector('.o-score');
        this.ties = document.querySelector('.ties');

        this.scores = {
            x: 0,
            o: 0,
            ties: 0
        };

        this.currentPlayer = 'x';
        this.gameActive = true;
        this.winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        this.initGame();
    }

    initGame() {
        this.cells.forEach(cell => {
            cell.addEventListener('click', () => this.handleCellClick(cell));
            cell.classList.remove('x', 'o', 'winning');
        });

        this.restartButton.addEventListener('click', () => this.restartGame());
        this.updateStatus();
    }

    handleCellClick(cell) {
        if (!this.gameActive || cell.classList.contains('x') || cell.classList.contains('o')) {
            return;
        }

        cell.classList.add(this.currentPlayer);
        cell.innerHTML = this.currentPlayer === 'x' ?
            '<div class="symbol">×</div>' :
            '<div class="symbol">○</div>';

        if (this.checkWin()) {
            this.handleWin();
        } else if (this.checkDraw()) {
            this.handleDraw();
        } else {
            this.currentPlayer = this.currentPlayer === 'x' ? 'o' : 'x';
            this.updateStatus();
        }
    }

    checkWin() {
        return this.winningCombinations.some(combination => {
            const cells = combination.map(index =>
                this.cells[index].classList.contains(this.currentPlayer)
            );
            if (cells.every(Boolean)) {
                combination.forEach(index =>
                    this.cells[index].classList.add('winning')
                );
                return true;
            }
            return false;
        });
    }

    checkDraw() {
        return [...this.cells].every(cell =>
            cell.classList.contains('x') || cell.classList.contains('o')
        );
    }

    handleWin() {
        this.gameActive = false;
        this.scores[this.currentPlayer]++;
        this.updateScores();
        this.status.textContent = `Player ${this.currentPlayer.toUpperCase()} Wins!`;
    }

    handleDraw() {
        this.gameActive = false;
        this.scores.ties++;
        this.updateScores();
        this.status.textContent = "It's a Draw!";
    }

    updateStatus() {
        this.status.textContent = `Player ${this.currentPlayer.toUpperCase()}'s Turn`;
    }

    updateScores() {
        this.xScore.textContent = this.scores.x;
        this.oScore.textContent = this.scores.o;
        this.ties.textContent = this.scores.ties;
    }

    restartGame() {
        this.cells.forEach(cell => {
            cell.classList.remove('x', 'o', 'winning');
            cell.innerHTML = '';
        });
        this.currentPlayer = 'x';
        this.gameActive = true;
        this.updateStatus();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});
