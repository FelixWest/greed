let currentPlayer = 1;
let scores = { 1: 0, 2: 0 };
let currentRoundScore = 0; // Single variable for current round score
const winningScore = 5000;
let hasRolled = false;

// Update background based on game state or current player's turn
function updateBackground() {
  document.body.className =
    scores[1] >= winningScore || scores[2] >= winningScore
      ? "winner"
      : currentPlayer === 1
      ? "player1-turn"
      : "player2-turn";
}

// Start a new game and reset all necessary elements
function startGame() {
  currentPlayer = 1;
  scores = { 1: 0, 2: 0 };
  currentRoundScore = 0;
  hasRolled = false; // Reset roll status
  updateBackground();
  updateScoreDisplay();
  updateCurrentRoundScoreDisplay();
  updateScoreColor();
}

// Roll 5 dice with random values, applying animations and updating the UI
function rollDice() {
  const diceElements = document.querySelectorAll(".dice");

  // Apply the rolling class to change color
  diceElements.forEach((dice) => {
    dice.classList.add("rolling");
    dice.textContent = "X"; // Placeholder during animation
  });

  const letters = ["G", "R", "E", "E", "D"];
  let dice = [];

  // Logic to randomly update dice values after the rolling effect
  setTimeout(() => {
    diceElements.forEach((dice) => {
      const randomIndex = Math.floor(Math.random() * letters.length);
      const newValue = letters[randomIndex]; // Get a random letter
      dice.textContent = newValue; // Update displayed value
      dice.classList.remove("rolling"); // Revert color after rolling
    });
  }, 300); // Keep the rolling effect for 0.3 second

  // Populate the dice array with random letters
  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * letters.length);
    dice.push(letters[randomIndex]);
  }

  return dice;
}

// Scoring function for "Greed" game based on letter counts
function calculateScore(dice) {
  const points = { G: 100, R: 200, E: 300, D: 400 };
  const count = dice.reduce(
    (acc, letter) => ((acc[letter] = (acc[letter] || 0) + 1), acc),
    {}
  );

  let roundScore = 0;

  // Calculate points based on counts
  for (const [letter, occurrences] of Object.entries(count)) {
    if (occurrences >= 5) {
      roundScore += 2000; // 5 of a kind
    } else if (occurrences === 4) {
      roundScore += 2 * points[letter];
    } else if (occurrences === 3) {
      roundScore += points[letter];
    } else if (letter === "E") {
      roundScore += 100 * occurrences;
    }
  }

  return roundScore;
}

// Function to update the dice display
function displayDice(dice) {
  const diceContainer = document.getElementById("dice-container");
  diceContainer.innerHTML = "";
  dice.forEach((value) => {
    const diceDiv = document.createElement("div");
    diceDiv.className = "dice";
    diceDiv.textContent = value;
    diceContainer.appendChild(diceDiv);
  });
}

// Function to handle the dice roll and scoring
function handleRoll() {
  const dice = rollDice();
  // Delay scoring and display update by 0.3s to match roll effect
  setTimeout(() => {
    displayDice(dice);
    const currentScore = calculateScore(dice);

    // Show the scores section and Hold button after the first roll
    if (!hasRolled) {
      document.getElementById("scores").style.display = "block";
      document.getElementById("hold-button").style.display = "inline-block";
      hasRolled = true;
    }

    // Check for a Farkle (no score)
    if (currentScore === 0) {
      currentRoundScore = 0;
      switchPlayer();
      alert(`Player ${currentPlayer} Farkled! Lost all round points.`);
    } else {
      currentRoundScore += currentScore;
    }

    updateCurrentRoundScoreDisplay();
    updateBackground();
  }, 300); // Add 0.3-second delay to match the rolling effect
}

// Function to hold points and switch players
function handleHold() {
  scores[currentPlayer] += currentRoundScore;
  currentRoundScore = 0;

  updateScoreDisplay();

  // Check if there's a winner
  if (scores[currentPlayer] >= winningScore) {
    document.getElementById(
      "current-player"
    ).textContent = `Player ${currentPlayer} wins! 🎉`;
  } else {
    switchPlayer();
  }
}

// Switch players and reset turn data
function switchPlayer() {
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  document.getElementById(
    "current-player"
  ).textContent = `Current Turn: Player ${currentPlayer}`;
  currentRoundScore = 0;
  updateCurrentRoundScoreDisplay();
  updateBackground();
  updateScoreColor();
}

// Function to display scores
function updateScoreDisplay() {
  document.getElementById(
    `player1-score`
  ).textContent = `Player 1 Total Score: ${scores[1]}`;
  document.getElementById(
    `player2-score`
  ).textContent = `Player 2 Total Score: ${scores[2]}`;
}

// Function to display current round score
function updateCurrentRoundScoreDisplay() {
  document.getElementById(
    "current-round-score"
  ).textContent = `Current Round Score: ${currentRoundScore}`;
}

// Function to update the color of the current score and player turn
function updateScoreColor() {
  const currentTurnText = document.getElementById("current-player");
  const currentRoundScoreText = document.getElementById("current-round-score");

  if (currentPlayer === 1) {
    currentTurnText.style.color = "blue";
    currentRoundScoreText.style.color = "blue";
  } else {
    currentTurnText.style.color = "red";
    currentRoundScoreText.style.color = "red";
  }
}

// Function to reset the game
function restartGame() {
  startGame();
  // Reset display elements if necessary
  document.getElementById("dice-container").innerHTML = "";
  document.getElementById("scores").style.display = "none"; // Hide scores section
  document.getElementById("hold-button").style.display = "none"; // Hide Hold button
  document.getElementById("current-player").textContent =
    "Current Turn: Player 1"; // Reset player text
}

// Initialize game with starting background
startGame();

// Event listeners for buttons
document.getElementById("roll-button").addEventListener("click", handleRoll);
document.getElementById("hold-button").addEventListener("click", handleHold);
document
  .getElementById("restart-button")
  .addEventListener("click", restartGame); // Restart button listener

// Add event listeners for opening and closing the rules modal
document.getElementById("rules-button").addEventListener("click", () => {
  document.getElementById("rules-modal").style.display = "flex";
});

// Close modal by clicking the X in the upper right corner
document.getElementById("close-modal").addEventListener("click", () => {
  document.getElementById("rules-modal").style.display = "none";
});

// Close modal if clicking outside of it
window.addEventListener("click", (event) => {
  const modal = document.getElementById("rules-modal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
});
