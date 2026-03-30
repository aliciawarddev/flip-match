// --- State --- //
const symbols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
let cards = [];
let flippedCards = [];
let matchedCount = 0;
let moves = 0;
let lockBoard = false;

// --- DOM Elements --- //
const board = document.getElementById('game-board');
const moveCount = document.getElementById('move-count');
const restartBtn = document.getElementById('restart-btn');

// --- Shuffle (Fisher-Yates) --- //
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// --- Build the Board --- //
// Resets all state, creates a shuffled deck of pairs, and renders cards to the DOM
function createBoard() {
  board.innerHTML = '';
  cards = [];
  flippedCards = [];
  matchedCount = 0;
  moves = 0;
  lockBoard = false;
  moveCount.textContent = '0';
 
  const deck = shuffle([...symbols, ...symbols]); // duplicate symbols to create pairs
 
  deck.forEach((symbol) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.symbol = symbol;
 
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-back">?</div>
        <div class="card-front">${symbol}</div>
      </div>
    `;
 
    card.addEventListener('click', () => flipCard(card));
    board.appendChild(card);
    cards.push(card);
  });
}

// --- Flip a Card --- //
// Ignores clicks if the board is locked, or if the card is already flipped/matches
function flipCard(card) {
  if (lockBoard) return;
  if (card.classList.contains('flipped')) return;
  if (card.classList.contains('matched')) return;
 
  card.classList.add('flipped');
  flippedCards.push(card);
 
  if (flippedCards.length === 2) {
    moves++;
    moveCount.textContent = moves;
    checkMatch();
  }
}

// --- Click for a Match --- //
// Compares the two flipped cards. If they match, mark them. If not, flip them back after a delay. 
function checkMatch() {
  lockBoard = true;
  const [a, b] = flippedCards;
 
  if (a.dataset.symbol === b.dataset.symbol) {
    a.classList.add('matched');
    b.classList.add('matched');
    flippedCards = [];
    matchedCount += 2;
    lockBoard = false;
 
    // Win condition -- all pairs found
    if (matchedCount === cards.length) {
      setTimeout(() => alert(`You won in ${moves} moves!`), 300);
    }
  } else {
    // No match -- flip back after 800ms so player can see both cards
    setTimeout(() => {
      a.classList.remove('flipped');
      b.classList.remove('flipped');
      flippedCards = [];
      lockBoard = false;
    }, 800);
  }
}

// --- Restart --- //
restartBtn.addEventListener('click', createBoard);

// --- Init --- //
createBoard();