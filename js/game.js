// ------------------------Spielstatusdefinitionen ------------------------

const GameStatus = Object.freeze({ PLAYING: 1, GAME_OVER: 2, WIN: 3 });

// ------------------------Spielstatusdefinitionen ------------------------

// ----------------------------Spielkern----------------------------

class GameCore extends EventTarget {
  constructor() {
    super();
    this._status = GameStatus.PLAYING;
  }

  get status() {
    return this._status;
  }

  set status(newStatus) {
    this._status = newStatus;
    this.dispatchEvent(new Event('StatusChanged'));
  }
}

// ----------------------------Spielkern----------------------------

// ----------------------------Benutzeroberfläche----------------------------

class GameUI {
  constructor(gameBoard) {
    this.gameBoard = gameBoard;
  }

  // Methode zum Neurendern des Spielbretts
  renderGameBoard(tableau) {
    this.gameBoard.innerHTML = '';
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
                  moveCard(selectedStackIndex, stackIndex, tableau);
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
      this.gameBoard.appendChild(stackElement);
    });
  }
}

// ----------------------------Benutzeroberfläche----------------------------

// ------------------Spielkern und Benutzeroberfläche initialisieren:------------------

document.addEventListener("DOMContentLoaded", function() {
  const gameBoard = document.getElementById("game-board");
  const gameCore = new GameCore();
  const gameUI = new GameUI(gameBoard);

  // Kartendeck erstellen und mischen
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

  // Initialisierung des Spielbretts und Rendering
  gameUI.renderGameBoard(tableau);
});

// ------------------Spielkern und Benutzeroberfläche initialisieren:------------------

// ----------------------------Erstellen des Kartendecks----------------------------

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

// ----------------------------Erstellen des Kartendecks----------------------------

// ----------------------------Mischen des Kartendecks----------------------------

function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

// ----------------------------Mischen des Kartendecks----------------------------

// ----------------------------Bewegen der Karten----------------------------

function moveCard(fromStackIndex, toStackIndex, tableau) {
  const card = tableau[fromStackIndex].pop();
  tableau[toStackIndex].push(card);
}

// ----------------------------Bewegen der Karten----------------------------
