document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.querySelector('.game-board');
    const movesDisplay = document.getElementById('moves');
    const timeDisplay = document.getElementById('time');
    const restartButton = document.getElementById('restart');
    const winModal = document.getElementById('winModal');
    const finalMovesDisplay = document.getElementById('finalMoves');
    const finalTimeDisplay = document.getElementById('finalTime');
    const playAgainButton = document.getElementById('playAgain');

    let moves = 0;
    let timeElapsed = 0;
    let timer = null;
    let firstCard = null;
    let secondCard = null;
    let canFlip = true;
    let matchedPairs = 0;

    const emojis = ['🎮', '🎲', '🎯', '🎨', '🎭', '🎪', '🎰', '🎳'];
    let cards = [...emojis, ...emojis];

    function startTimer() {
        if (timer) return;
        timer = setInterval(() => {
            timeElapsed++;
            updateTimeDisplay();
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timer);
        timer = null;
    }

    function updateTimeDisplay() {
        const minutes = Math.floor(timeElapsed / 60);
        const seconds = timeElapsed % 60;
        const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        timeDisplay.textContent = timeString;
        if (winModal.classList.contains('active')) {
            finalTimeDisplay.textContent = timeString;
        }
    }

    function updateMovesDisplay() {
        movesDisplay.textContent = moves;
        if (winModal.classList.contains('active')) {
            finalMovesDisplay.textContent = moves;
        }
    }

    function shuffleCards() {
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
    }

    function createCard(emoji, index) {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = index;

        const front = document.createElement('div');
        front.className = 'card-front';
        front.textContent = emoji;

        const back = document.createElement('div');
        back.className = 'card-back';

        card.appendChild(front);
        card.appendChild(back);

        card.addEventListener('click', () => flipCard(card));
        return card;
    }

    function flipCard(card) {
        if (!canFlip || card.classList.contains('flipped') || card.classList.contains('matched')) return;

        card.classList.add('flipped');

        if (!firstCard) {
            firstCard = card;
            startTimer();
        } else {
            secondCard = card;
            canFlip = false;
            moves++;
            updateMovesDisplay();
            checkMatch();
        }
    }

    function checkMatch() {
        const firstEmoji = cards[firstCard.dataset.index];
        const secondEmoji = cards[secondCard.dataset.index];

        if (firstEmoji === secondEmoji) {
            firstCard.classList.add('matched');
            secondCard.classList.add('matched');
            matchedPairs++;

            if (matchedPairs === emojis.length) {
                setTimeout(showWinModal, 500);
            }
        } else {
            setTimeout(() => {
                firstCard.classList.remove('flipped');
                secondCard.classList.remove('flipped');
            }, 1000);
        }

        setTimeout(() => {
            firstCard = null;
            secondCard = null;
            canFlip = true;
        }, 1000);
    }

    function showWinModal() {
        stopTimer();
        winModal.classList.add('active');
    }

    function initGame() {
        gameBoard.innerHTML = '';
        shuffleCards();
        cards.forEach((emoji, index) => {
            const card = createCard(emoji, index);
            gameBoard.appendChild(card);
        });

        moves = 0;
        timeElapsed = 0;
        matchedPairs = 0;
        firstCard = null;
        secondCard = null;
        canFlip = true;
        stopTimer();
        updateMovesDisplay();
        updateTimeDisplay();
        winModal.classList.remove('active');
    }

    restartButton.addEventListener('click', initGame);
    playAgainButton.addEventListener('click', initGame);

    initGame();
});
