class SnakeGame {
    constructor() {
        this.gridSize = 20;
        this.tileCount = 20;
        this.snake = [{ x: 10, y: 10 }];

        this.canvas = document.getElementById('snakeCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.setupCanvas();

        this.food = this.generateFood();

        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('snakeHighScore')) || 0;
        this.speed = 1;
        this.gameLoop = null;
        this.gameActive = false;

        this.overlay = document.querySelector('.overlay');
        this.message = document.querySelector('.message');
        this.startBtn = document.querySelector('.start-btn');
        this.currentScoreDisplay = document.querySelector('.current-score');
        this.highScoreDisplay = document.querySelector('.high-score');
        this.speedDisplay = document.querySelector('.speed-level');

        this.initGame();
    }

    setupCanvas() {
        this.canvas.width = 600;
        this.canvas.height = 600;
        this.tileSize = this.canvas.width / this.tileCount;

        console.log('Canvas dimensions:', {
            width: this.canvas.width,
            height: this.canvas.height,
            tileSize: this.tileSize
        });
    }

    initGame() {
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
        this.startBtn.addEventListener('click', () => this.startGame());
        window.addEventListener('resize', () => this.setupCanvas());

        this.updateScores();
        this.draw();
        this.showOverlay('Press Space to Start');
    }

    startGame() {
        this.snake = [{ x: 10, y: 10 }];
        this.food = this.generateFood();
        this.dx = 1;
        this.dy = 0;
        this.score = 0;
        this.speed = 1;
        this.gameActive = true;

        this.hideOverlay();
        this.updateScores();
        this.startBtn.textContent = 'Restart Game';

        if (this.gameLoop) clearInterval(this.gameLoop);
        this.gameLoop = setInterval(() => this.update(), 1000 / (5 + this.speed * 2));
    }

    handleKeyPress(event) {
        if (!this.gameActive && (event.code === 'Space' || event.key === ' ')) {
            this.startGame();
            return;
        }

        const key = event.key.toLowerCase();

        if ((key === 'arrowup' || key === 'w') && this.dy !== 1) {
            this.dx = 0;
            this.dy = -1;
        } else if ((key === 'arrowdown' || key === 's') && this.dy !== -1) {
            this.dx = 0;
            this.dy = 1;
        } else if ((key === 'arrowleft' || key === 'a') && this.dx !== 1) {
            this.dx = -1;
            this.dy = 0;
        } else if ((key === 'arrowright' || key === 'd') && this.dx !== -1) {
            this.dx = 1;
            this.dy = 0;
        }
    }

    update() {
        const head = { x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy };

        if (this.checkCollision(head)) {
            this.gameOver();
            return;
        }

        this.snake.unshift(head);

        if (head.x === this.food.x && head.y === this.food.y) {
            this.score++;
            this.food = this.generateFood();
            this.updateScores();

            // Increase speed every 5 points
            if (this.score % 5 === 0) {
                this.speed++;
                this.updateScores();
                clearInterval(this.gameLoop);
                this.gameLoop = setInterval(() => this.update(), 1000 / (5 + this.speed * 2));
            }
        } else {
            this.snake.pop();
        }

        this.draw();
    }

    checkCollision(head) {
        if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount) {
            return true;
        }

        return this.snake.some((segment, index) => {
            if (index === 0) return false;
            return segment.x === head.x && segment.y === head.y;
        });
    }

    generateFood() {
        let food;
        do {
            food = {
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCount)
            };
        } while (this.snake.some(segment => segment.x === food.x && segment.y === food.y));
        return food;
    }

    draw() {
        this.ctx.fillStyle = '#0f172a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.strokeStyle = '#1e293b';
        for (let i = 0; i <= this.tileCount; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.tileSize, 0);
            this.ctx.lineTo(i * this.tileSize, this.canvas.height);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.tileSize);
            this.ctx.lineTo(this.canvas.width, i * this.tileSize);
            this.ctx.stroke();
        }

        this.snake.forEach((segment, index) => {
            const gradient = this.ctx.createLinearGradient(
                segment.x * this.tileSize,
                segment.y * this.tileSize,
                (segment.x + 1) * this.tileSize,
                (segment.y + 1) * this.tileSize
            );
            gradient.addColorStop(0, '#60a5fa');
            gradient.addColorStop(1, '#3b82f6');

            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(
                segment.x * this.tileSize + 1,
                segment.y * this.tileSize + 1,
                this.tileSize - 2,
                this.tileSize - 2
            );

            if (index === 0) {
                this.drawSnakeEyes(segment);
            }
        });

        this.ctx.fillStyle = '#f472b6';
        this.ctx.shadowColor = '#f472b6';
        this.ctx.shadowBlur = 10;
        this.ctx.beginPath();
        this.ctx.arc(
            (this.food.x + 0.5) * this.tileSize,
            (this.food.y + 0.5) * this.tileSize,
            this.tileSize / 2 - 2,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
    }

    drawSnakeEyes(head) {
        const eyeSize = this.tileSize / 6;
        const eyeOffset = this.tileSize / 3;
        this.ctx.fillStyle = '#fff';

        if (this.dx === 1) { // Right
            this.ctx.fillRect(head.x * this.tileSize + this.tileSize - eyeOffset, head.y * this.tileSize + eyeOffset, eyeSize, eyeSize);
            this.ctx.fillRect(head.x * this.tileSize + this.tileSize - eyeOffset, head.y * this.tileSize + this.tileSize - eyeOffset - eyeSize, eyeSize, eyeSize);
        } else if (this.dx === -1) { // Left
            this.ctx.fillRect(head.x * this.tileSize + eyeOffset - eyeSize, head.y * this.tileSize + eyeOffset, eyeSize, eyeSize);
            this.ctx.fillRect(head.x * this.tileSize + eyeOffset - eyeSize, head.y * this.tileSize + this.tileSize - eyeOffset - eyeSize, eyeSize, eyeSize);
        } else if (this.dy === -1) { // Up
            this.ctx.fillRect(head.x * this.tileSize + eyeOffset, head.y * this.tileSize + eyeOffset, eyeSize, eyeSize);
            this.ctx.fillRect(head.x * this.tileSize + this.tileSize - eyeOffset - eyeSize, head.y * this.tileSize + eyeOffset, eyeSize, eyeSize);
        } else if (this.dy === 1) { // Down
            this.ctx.fillRect(head.x * this.tileSize + eyeOffset, head.y * this.tileSize + this.tileSize - eyeOffset - eyeSize, eyeSize, eyeSize);
            this.ctx.fillRect(head.x * this.tileSize + this.tileSize - eyeOffset - eyeSize, head.y * this.tileSize + this.tileSize - eyeOffset - eyeSize, eyeSize, eyeSize);
        }
    }

    gameOver() {
        this.gameActive = false;
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('snakeHighScore', this.score);
        }
        this.updateScores();
        this.showOverlay('Game Over! Press Space to Restart');
        clearInterval(this.gameLoop);
    }

    showOverlay(text) {
        this.message.textContent = text;
        this.overlay.classList.add('visible');
    }

    hideOverlay() {
        this.overlay.classList.remove('visible');
        this.draw();
    }

    updateScores() {
        this.currentScoreDisplay.textContent = this.score;
        this.highScoreDisplay.textContent = this.highScore;
        this.speedDisplay.textContent = this.speed;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SnakeGame();
});
