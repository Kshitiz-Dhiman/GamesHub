const quotes = [
    "The quick brown fox jumps over the lazy dog.",
    "To be or not to be, that is the question.",
    "All that glitters is not gold.",
    "A journey of a thousand miles begins with a single step.",
    "Actions speak louder than words."
];

class TypingGame {
    constructor() {
        this.quoteDisplay = document.querySelector('.quote-display');
        this.input = document.querySelector('.typing-input');
        this.timerElement = document.querySelector('.time');
        this.speedElement = document.querySelector('.speed');
        this.accuracyElement = document.querySelector('.accuracy');
        this.button = document.querySelector('.btn');

        this.quote = '';
        this.startTime = null;
        this.timer = null;

        this.button.addEventListener('click', () => this.start());
        this.input.addEventListener('input', () => this.handleInput());

        this.start();
    }

    start() {
        this.input.value = '';
        this.input.disabled = false;
        this.input.focus();
        this.startTime = null;
        this.timerElement.textContent = '0';
        this.speedElement.textContent = '0';
        this.accuracyElement.textContent = '100';

        this.quote = quotes[Math.floor(Math.random() * quotes.length)];
        this.quoteDisplay.innerHTML = this.quote.split('').map(char =>
            `<span>${char}</span>`
        ).join('');

        clearInterval(this.timer);
    }

    handleInput() {
        if (!this.startTime) {
            this.startTime = new Date();
            this.timer = setInterval(() => this.updateTimer(), 1000);
        }

        const arrayQuote = this.quoteDisplay.querySelectorAll('span');
        const arrayValue = this.input.value.split('');
        let correct = true;
        let correctChars = 0;

        arrayQuote.forEach((charSpan, index) => {
            const character = arrayValue[index];
            if (character == null) {
                charSpan.classList.remove('correct', 'incorrect');
                correct = false;
            } else if (character === charSpan.innerText) {
                charSpan.classList.add('correct');
                charSpan.classList.remove('incorrect');
                correctChars++;
            } else {
                charSpan.classList.remove('correct');
                charSpan.classList.add('incorrect');
                correct = false;
            }
        });

        const accuracy = Math.round((correctChars / arrayValue.length) * 100) || 100;
        this.accuracyElement.textContent = accuracy;

        if (correct && arrayValue.length === arrayQuote.length) {
            this.input.disabled = true;
            clearInterval(this.timer);
        }
    }

    updateTimer() {
        if (!this.startTime) return;

        const currentTime = Math.floor((new Date() - this.startTime) / 1000);
        this.timerElement.textContent = currentTime;

        const words = this.input.value.length / 5;
        const minutes = currentTime / 60;
        const wpm = Math.round(words / minutes) || 0;
        this.speedElement.textContent = wpm;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new TypingGame();
});
