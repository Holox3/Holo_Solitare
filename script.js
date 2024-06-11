// Kartendeck erstellen
function createDeck() {
    const suits = ['♠', '♥', '♦', '♣'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    let deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ value, suit });
        }
    }
    return deck;
}

// Kartendeck mischen
function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

// Spiel initialisieren
document.addEventListener("DOMContentLoaded", function() {
    const gameBoard = document.getElementById("game-board");

    let deck = createDeck();
    deck = shuffleDeck(deck);

    // Kartenstapel erstellen
    let tableau = [[], [], [], [], [], [], []];
    for (let i = 0; i < tableau.length; i++) {
        for (let j = 0; j <= i; j++) {
            tableau[i].push(deck.pop());
        }
    }

    // Variable für die ausgewählte Karte
    let selectedCard = null;
    let selectedStackIndex = null;

    // Funktion zum Neurendern des Spielbretts
    function renderGameBoard() {
        gameBoard.innerHTML = '';
        tableau.forEach((stack, stackIndex) => {
            const stackElement = document.createElement('div');
            stackElement.classList.add('stack');
            stack.forEach((card, cardIndex) => {
                const cardElement = document.createElement('div');
                cardElement.classList.add('card');
                cardElement.innerText = card.value + card.suit;
                cardElement.dataset.value = card.value;
                cardElement.dataset.suit = card.suit;
                if (cardIndex < stack.length - 1) {
                    cardElement.classList.add('facedown');
                } else {
                    cardElement.addEventListener('click', function() {
                        if (cardElement.classList.contains('facedown')) {
                            // Karte aufdecken
                            cardElement.classList.remove('facedown');
                        } else {
                            if (selectedCard) {
                                // Überprüfe, ob der Zug legal ist und bewege die Karte
                                if (isValidMove(selectedCard, cardElement)) {
                                    moveCard(selectedStackIndex, stackIndex);
                                }
                                selectedCard.classList.remove('selected');
                                selectedCard = null;
                                selectedStackIndex = null;
                            } else {
                                selectedCard = cardElement;
                                selectedStackIndex = stackIndex;
                                cardElement.classList.add('selected');
                            }
                        }
                    });
                }
                stackElement.appendChild(cardElement);
            });
            gameBoard.appendChild(stackElement);
        });
    }

    // Funktion zur Überprüfung, ob der Zug legal ist
    function isValidMove(card1, card2) {
        const order = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        const color1 = ['♠', '♣'].includes(card1.dataset.suit) ? 'black' : 'red';
        const color2 = ['♠', '♣'].includes(card2.dataset.suit) ? 'black' : 'red';
        return color1 !== color2 && order.indexOf(card1.dataset.value) === order.indexOf(card2.dataset.value) - 1;
    }

    // Funktion zum Bewegen der Karte
    function moveCard(fromStackIndex, toStackIndex) {
        const card = tableau[fromStackIndex].pop();
        tableau[toStackIndex].push(card);
        renderGameBoard();
    }

    // Initiales Rendern des Spielbretts
    renderGameBoard();
});
