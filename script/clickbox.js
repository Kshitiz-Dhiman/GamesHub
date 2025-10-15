class ClickBoxGame {
    constructor() {
        // Game elements
        this.gameArea = document.querySelector('.game-area');
        this.targetBox = document.querySelector('.target-box');
        this.overlay = document.querySelector('.overlay');
        this.message = document.querySelector('.message');
        this.startBtn = document.querySelector('.start-btn');
        this.currentScoreDisplay = document.querySelector('.current-score');
        this.highScoreDisplay = document.querySelector('.high-score');
        this.timeLeftDisplay = document.querySelector('.time-left');

        // Game state
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('clickBoxHighScore')) || 0;
        this.timeLeft = 30;
        this.gameActive = false;
        this.gameTimer = null;
        this.boxTimer = null;
        this.boxSpeed = 1500; // Initial box display duration in ms
        this.minSpeed = 600; // Minimum time between box appearances

        // Initialize game
        this.initGame();
    }

    initGame() {
        // Event listeners
        this.startBtn.addEventListener('click', () => this.startGame());
        this.targetBox.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent gameArea click
            this.handleBoxClick();
        });
        this.gameArea.addEventListener('click', () => this.handleMiss());

        // Display high score
        this.highScoreDisplay.textContent = this.highScore;
        this.showOverlay('Click Start to Begin!');
    }

    startGame() {
        // Reset game state
        this.score = 0;
        this.timeLeft = 30;
        this.boxSpeed = 1500;
        this.gameActive = true;

        // Update UI
        this.updateScores();
        this.hideOverlay();
        this.startBtn.textContent = 'Playing...';
        this.startBtn.disabled = true;

        // Start game timers
        this.gameTimer = setInterval(() => this.updateTimer(), 1000);
        this.showNewBox();
    }

    showNewBox() {
        // Clear any existing timer
        if (this.boxTimer) clearTimeout(this.boxTimer);

        // Calculate random position
        const gameRect = this.gameArea.getBoundingClientRect();
        const boxRect = this.targetBox.getBoundingClientRect();

        const maxX = gameRect.width - boxRect.width;
        const maxY = gameRect.height - boxRect.height;

        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.floor(Math.random() * maxY);

        // Position and show box
        this.targetBox.style.left = `${randomX}px`;
        this.targetBox.style.top = `${randomY}px`;
        this.targetBox.classList.add('visible');

        // Set timer to hide box if not clicked
        this.boxTimer = setTimeout(() => {
            if (this.gameActive) {
                this.handleMiss();
            }
        }, this.boxSpeed);
    }

    handleBoxClick() {
        if (!this.gameActive) return;

        // Clear box timer
        if (this.boxTimer) clearTimeout(this.boxTimer);

        // Visual feedback
        this.targetBox.classList.add('clicked');
        setTimeout(() => {
            this.targetBox.classList.remove('clicked', 'visible');
        }, 100);

        // Update score
        this.score++;
        this.updateScores();

        // Increase difficulty
        this.boxSpeed = Math.max(this.minSpeed, 1500 - (this.score * 50));

        // Show next box after a short delay
        setTimeout(() => {
            if (this.gameActive) {
                this.showNewBox();
            }
        }, 200);
    }

    handleMiss() {
        if (!this.gameActive) return;

        // Visual feedback
        this.targetBox.classList.remove('visible');

        // Clear box timer
        if (this.boxTimer) clearTimeout(this.boxTimer);

        // Show next box immediately
        this.showNewBox();
    }

    updateTimer() {
        this.timeLeft--;
        this.timeLeftDisplay.textContent = this.timeLeft;

        if (this.timeLeft <= 0) {
            this.endGame();
        }
    }

    endGame() {
        this.gameActive = false;
        clearInterval(this.gameTimer);
        if (this.boxTimer) clearTimeout(this.boxTimer);

        // Update high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('clickBoxHighScore', this.score);
            this.highScoreDisplay.textContent = this.highScore;
        }

        // Reset UI
        this.targetBox.classList.remove('visible');
        this.startBtn.textContent = 'Play Again';
        this.startBtn.disabled = false;

        // Show final score
        this.showOverlay(`Game Over! Score: ${this.score}`);
    }

    updateScores() {
        this.currentScoreDisplay.textContent = this.score;
    }

    showOverlay(text) {
        this.message.textContent = text;
        this.overlay.classList.add('visible');
    }

    hideOverlay() {
        this.overlay.classList.remove('visible');
    }
}

// Start the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ClickBoxGame();
});
