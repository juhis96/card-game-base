const playerListElement = document.getElementById("player-list");
const playerNameInput = document.getElementById("player-name");
const addPlayerButton = document.getElementById("add-player");
const cardElement = document.getElementById("card");
const cardNameElement = document.getElementById("card-name");
const cardRarityElement = document.getElementById("card-rarity");
const cardImageElement = document.getElementById("card-image");
const cardImgElement = document.getElementById("card-img");
const ruleElement = document.getElementById("rule-section");
const cardDescriptionElement = document.getElementById("card-description");
const nextCardButton = document.getElementById("next-card");
const startGameButton = document.getElementById("start-game");

let currentPlayerIndex = 0;
let gameStarted = false;
let players = [];
let rarities = [];
let cards = [];
cardElement.style.display = "none";

async function startGame() {
  gameStarted = true;
  startGameButton.style.display = "none";
  cardElement.style.display = "block";
  ruleElement.style.display = "none";
  nextCardButton.disabled = false;

  try {
    const response = await fetch("src/data.json");
    const data = await response.json();
    cards = data.cards;
    rarities = data.rarities;

    generateCard();
  } catch (error) {
    console.error("Failed to load card data:", error);
  }
}

function removePlayer(index) {
  players.splice(index, 1);
  updatePlayerList(); 
}

function updatePlayerList() {
  playerListElement.innerHTML = "";

  players.forEach((player, index) => {
    const li = document.createElement("li");
    const playerSpan = document.createElement("span");
    playerSpan.textContent = player;

    if (index === currentPlayerIndex) {
      li.classList.add("current-player");
    }

    const removeButton = document.createElement("button");
    removeButton.textContent = "X";
    removeButton.addEventListener("click", () => {
      removePlayer(index);
    });

    li.appendChild(playerSpan);
    li.appendChild(removeButton);
    playerListElement.appendChild(li);
  });
}

function generateCard() {
  const randomCard = getRandomCard();

  if (randomCard) {
    cardNameElement.textContent = randomCard.name;
    cardRarityElement.textContent = randomCard.rarity;
    cardDescriptionElement.textContent = randomCard.description;
    cardImgElement.src = randomCard.image;
  } else {
    cardNameElement.textContent = "No card available";
    cardRarityElement.textContent = "";
    cardDescriptionElement.textContent = "";
  }
}

function getRandomCard() {
  const totalWeight = rarities.reduce((sum, rarity) => sum + rarity.weight, 0);
  const randomWeight = Math.random() * totalWeight;

  let cumulativeWeight = 0;
  for (const rarity of rarities) {
    cumulativeWeight += rarity.weight;
    if (randomWeight < cumulativeWeight) {
      const cardsWithRarity = cards.filter((card) => card.rarity === rarity.name);
      const randomIndex = Math.floor(Math.random() * cardsWithRarity.length);
      return cardsWithRarity[randomIndex];
    }
  }

  return null;
}

startGameButton.addEventListener("click", startGame);

addPlayerButton.addEventListener("click", () => {
  const playerNames = playerNameInput.value.split(",");

  playerNames.forEach((playerName) => {
    const trimmedPlayerName = playerName.trim();
    if (trimmedPlayerName !== "") {
      players.push(trimmedPlayerName);
    }
  });

  updatePlayerList();
  playerNameInput.value = "";
});

nextCardButton.addEventListener("click", () => {
  currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
  updatePlayerList(); 
  generateCard();
});


