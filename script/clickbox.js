class ClickBoxGame {
    constructor() {
        this.gameArea = document.querySelector('.game-area');
        this.targetBox = document.querySelector('.target-box');
        this.overlay = document.querySelector('.overlay');
        this.message = document.querySelector('.message');
        this.startBtn = document.querySelector('.start-btn');
        this.currentScoreDisplay = document.querySelector('.current-score');
        this.highScoreDisplay = document.querySelector('.high-score');
        this.timeLeftDisplay = document.querySelector('.time-left');

        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('clickBoxHighScore')) || 0;
        this.timeLeft = 30;
        this.gameActive = false;
        this.gameTimer = null;
        this.boxTimer = null;
        this.boxSpeed = 1500;
        this.minSpeed = 600;

        this.initGame();
    }

    initGame() {

        this.startBtn.addEventListener('click', () => this.startGame());
        this.targetBox.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleBoxClick();
        });
        this.gameArea.addEventListener('click', () => this.handleMiss());

        this.highScoreDisplay.textContent = this.highScore;
        this.showOverlay('Click Start to Begin!');
    }

    startGame() {

        this.score = 0;
        this.timeLeft = 30;
        this.boxSpeed = 1500;
        this.gameActive = true;

        this.updateScores();
        this.hideOverlay();
        this.startBtn.textContent = 'Playing...';
        this.startBtn.disabled = true;

        this.gameTimer = setInterval(() => this.updateTimer(), 1000);
        this.showNewBox();
    }

    showNewBox() {

        if (this.boxTimer) clearTimeout(this.boxTimer);

        const gameRect = this.gameArea.getBoundingClientRect();
        const boxRect = this.targetBox.getBoundingClientRect();

        const maxX = gameRect.width - boxRect.width;
        const maxY = gameRect.height - boxRect.height;

        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.floor(Math.random() * maxY);

        this.targetBox.style.left = `${randomX}px`;
        this.targetBox.style.top = `${randomY}px`;
        this.targetBox.classList.add('visible');

        this.boxTimer = setTimeout(() => {
            if (this.gameActive) {
                this.handleMiss();
            }
        }, this.boxSpeed);
    }

    handleBoxClick() {
        if (!this.gameActive) return;

        if (this.boxTimer) clearTimeout(this.boxTimer);

        this.targetBox.classList.add('clicked');
        setTimeout(() => {
            this.targetBox.classList.remove('clicked', 'visible');
        }, 100);

        this.score++;
        this.updateScores();

        this.boxSpeed = Math.max(this.minSpeed, 1500 - (this.score * 50));

        setTimeout(() => {
            if (this.gameActive) {
                this.showNewBox();
            }
        }, 200);
    }

    handleMiss() {
        if (!this.gameActive) return;

        this.targetBox.classList.remove('visible');

        if (this.boxTimer) clearTimeout(this.boxTimer);

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
