class NumberGuessingGame {
    constructor() {
        // UI Elements
        this.guessInput = document.querySelector('.guess-input');
        this.guessBtn = document.querySelector('.guess-btn');
        this.restartBtn = document.querySelector('.restart-btn');
        this.hint = document.querySelector('.hint');
        this.attemptsDisplay = document.querySelector('.attempts');
        this.bestScoreDisplay = document.querySelector('.best-score');
        this.guessList = document.querySelector('.guess-list');
        this.status = document.querySelector('.status');

        // Game state
        this.minNumber = 1;
        this.maxNumber = 100;
        this.targetNumber = null;
        this.attempts = 0;
        this.bestScore = localStorage.getItem('numberGameBestScore') || '-';
        this.gameActive = true;

        // Initialize the game
        this.initGame();
    }

    initGame() {
        // Set up event listeners
        this.guessBtn.addEventListener('click', () => this.handleGuess());
        this.restartBtn.addEventListener('click', () => this.restartGame());
        this.guessInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && this.gameActive) {
                this.handleGuess();
            }
        });

        // Initialize game state
        this.targetNumber = Math.floor(Math.random() * (this.maxNumber - this.minNumber + 1)) + this.minNumber;
        this.attempts = 0;
        this.gameActive = true;
        this.updateDisplay();

        // Clear previous guesses
        this.guessList.innerHTML = '';
        this.hint.textContent = 'Start guessing!';
        this.status.textContent = 'Guess the Number!';

        // Set up input
        this.guessInput.value = '';
        this.guessInput.min = this.minNumber;
        this.guessInput.max = this.maxNumber;
        this.guessInput.disabled = false;
        this.guessBtn.disabled = false;

        // Focus input for immediate play
        this.guessInput.focus();
    }

    handleGuess() {
        if (!this.gameActive) return;

        const guess = parseInt(this.guessInput.value);
        if (isNaN(guess) || guess < this.minNumber || guess > this.maxNumber) {
            this.hint.textContent = `Please enter a number between ${this.minNumber} and ${this.maxNumber}`;
            return;
        }

        this.attempts++;
        this.updateDisplay();

        const guessSpan = document.createElement('span');
        guessSpan.textContent = guess;

        if (guess === this.targetNumber) {
            this.handleWin();
        } else {
            if (guess > this.targetNumber) {
                guessSpan.classList.add('high');
                this.hint.textContent = 'Too high!';
            } else {
                guessSpan.classList.add('low');
                this.hint.textContent = 'Too low!';
            }
            this.guessList.appendChild(guessSpan);
        }

        this.guessInput.value = '';
        this.guessInput.focus();
    }

    handleWin() {
        this.gameActive = false;
        this.status.textContent = '🎉 Congratulations! You won! 🎉';
        this.hint.textContent = `You found the number ${this.targetNumber} in ${this.attempts} attempts!`;
        this.guessInput.disabled = true;
        this.guessBtn.disabled = true;

        // Update best score
        if (this.bestScore === '-' || this.attempts < parseInt(this.bestScore)) {
            this.bestScore = this.attempts;
            localStorage.setItem('numberGameBestScore', this.attempts);
            this.updateDisplay();
        }
    }

    restartGame() {
        this.initGame();
    }

    updateDisplay() {
        this.attemptsDisplay.textContent = this.attempts;
        this.bestScoreDisplay.textContent = this.bestScore;
    }
}

// Start the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NumberGuessingGame();
});
