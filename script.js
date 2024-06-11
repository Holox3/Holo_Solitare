// Initialisieren des Spiels
document.addEventListener("DOMContentLoaded", function() {
    const gameBoard = document.getElementById("game-board");
    
    // Beispiel-Karten
    const cards = ['A♠', '2♠', '3♠', '4♠', '5♠', '6♠', '7♠', '8♠', '9♠', '10♠', 'J♠', 'Q♠', 'K♠'];

    // Karten anzeigen
    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.innerText = card;
        gameBoard.appendChild(cardElement);
    });
});
