
// ==========================================
// GAMEHUB ARCADE - FIXED GAME SYSTEM
// ==========================================

const games = [
    { name: "Cyber Strike", category: "action", icon: "⚡", art: "art-one", description: "Test your memory and reaction skills in a futuristic digital challenge." },
    { name: "Lost Kingdom", category: "adventure", icon: "🏰", art: "art-two", description: "Explore mysterious lands, solve clues and discover the lost kingdom." },
    { name: "Neon Racer", category: "racing", icon: "🏎️", art: "art-three", description: "Race through a neon world and test your speed." },
    { name: "Kingdom Wars", category: "strategy", icon: "👑", art: "art-four", description: "Build a thriving kingdom, manage resources and make smart decisions." },
    { name: "Shadow Ninja", category: "action", icon: "🥷", art: "art-five", description: "Navigate a mysterious maze, collect stars and find the exit." },
    { name: "Space Explorer", category: "puzzle", icon: "🚀", art: "art-six", description: "Explore the universe and answer space challenges." }
];

const gameGrid = document.getElementById("gameGrid");
const searchInput = document.getElementById("gameSearch");
const noResults = document.getElementById("noResults");
const filterButtons = document.querySelectorAll(".filter");
const favoritesButton = document.getElementById("showFavorites");

const gameModal = document.getElementById("gameModal");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalExtra = document.getElementById("modalExtra");
const gameArea = document.getElementById("gameArea");

const closeModalButton = document.getElementById("closeModal");
const modalDone = document.getElementById("modalDone");
const ratingStars = document.getElementById("ratingStars");
const ratingMessage = document.getElementById("ratingMessage");

let selectedCategory = "all";
let favoritesOnly = false;
let favorites = new Set();
let currentGame = null;
let currentRating = 0;
let gameCleanup = null;


// ==========================================
// NAVIGATION
// ==========================================

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    menuToggle.textContent = navLinks.classList.contains("active") ? "✕" : "☰";
});

navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        menuToggle.textContent = "☰";
    });
});


// ==========================================
// GAME CARDS
// ==========================================

function renderGames() {
    gameGrid.innerHTML = "";

    const term = searchInput.value.trim().toLowerCase();

    const results = games.filter(game => {
        const categoryMatch =
            selectedCategory === "all" || game.category === selectedCategory;

        const searchMatch =
            game.name.toLowerCase().includes(term) ||
            game.description.toLowerCase().includes(term);

        const favoriteMatch =
            !favoritesOnly || favorites.has(game.name);

        return categoryMatch && searchMatch && favoriteMatch;
    });

    results.forEach(game => {
        const card = document.createElement("article");
        card.className = "game-card";

        card.innerHTML = `
            <div class="game-art ${game.art}">
                ${game.name === "Shadow Ninja"
                    ? '<div class="ninja-symbol"><span></span></div>'
                    : game.icon}
            </div>
            <div class="game-info">
                <span class="game-type">${game.category}</span>
                <h3>${game.name}</h3>
                <p>${game.description}</p>
                <div class="card-actions">
                    <button class="details-btn" data-game="${game.name}">PLAY NOW ↗</button>
                    <button class="favorite-btn" data-favorite="${game.name}">
                        ${favorites.has(game.name) ? "♥" : "♡"}
                    </button>
                </div>
            </div>
        `;

        gameGrid.appendChild(card);
    });

    noResults.hidden = results.length !== 0;
}

searchInput.addEventListener("input", renderGames);

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        filterButtons.forEach(b => b.classList.remove("active"));
        button.classList.add("active");
        selectedCategory = button.dataset.category;
        renderGames();
    });
});

favoritesButton.addEventListener("click", () => {
    favoritesOnly = !favoritesOnly;
    favoritesButton.classList.toggle("active", favoritesOnly);
    favoritesButton.textContent = favoritesOnly ? "♥ Show All Games" : "♡ Show Favourites";
    renderGames();
});

gameGrid.addEventListener("click", event => {
    const fav = event.target.closest("[data-favorite]");
    const play = event.target.closest("[data-game]");

    if (fav) {
        const name = fav.dataset.favorite;
        favorites.has(name) ? favorites.delete(name) : favorites.add(name);
        renderGames();
    }

    if (play) openGame(play.dataset.game);
});


// ==========================================
// OPEN AND CLOSE MODAL
// ==========================================

function stopCurrentGame() {
    if (typeof gameCleanup === "function") {
        gameCleanup();
        gameCleanup = null;
    }
}

function openGame(name) {
    currentGame = games.find(game => game.name === name);
    if (!currentGame) return;

    stopCurrentGame();

    currentRating = 0;
    modalTitle.textContent = currentGame.name;
    modalDescription.textContent = currentGame.description;
    modalExtra.textContent = "CATEGORY: " + currentGame.category.toUpperCase();
    ratingMessage.textContent = "Choose your rating!";

    updateStars();

    gameArea.innerHTML = `
        <div class="game-panel">
            <p>Ready to play ${currentGame.name}?</p>
            <button class="game-button" data-action="start">▶ START GAME</button>
        </div>
    `;

    gameModal.classList.add("show");
    gameModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}

function closeGameModal() {
    stopCurrentGame();
    gameModal.classList.remove("show");
    gameModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    gameArea.innerHTML = "<p>Select Start Game to begin!</p>";
}

closeModalButton.addEventListener("click", closeGameModal);
modalDone.addEventListener("click", closeGameModal);

gameModal.addEventListener("click", event => {
    if (event.target === gameModal) closeGameModal();
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && gameModal.classList.contains("show")) {
        closeGameModal();
    }
});


// ==========================================
// RATINGS
// ==========================================

function updateStars() {
    ratingStars.querySelectorAll("button").forEach(button => {
        button.classList.toggle(
            "selected",
            Number(button.dataset.rating) <= currentRating
        );
    });
}

ratingStars.addEventListener("click", event => {
    const button = event.target.closest("[data-rating]");
    if (!button) return;

    currentRating = Number(button.dataset.rating);
    updateStars();
    ratingMessage.textContent = `You rated this game ${currentRating}/5 stars. Thank you!`;
});


// ==========================================
// ONE CENTRAL GAME EVENT LISTENER
// ==========================================

gameArea.addEventListener("click", event => {
    const button = event.target.closest("button");
    if (!button || !currentGame) return;

    if (button.dataset.action === "start") {
        startSelectedGame();
        return;
    }

    if (button.dataset.action === "restart") {
        startSelectedGame();
        return;
    }

    if (button.dataset.kingdom) kingdomAction(button.dataset.kingdom);
    if (button.dataset.answer !== undefined) answerLost(Number(button.dataset.answer));
    if (button.dataset.cyber !== undefined) answerCyber(Number(button.dataset.cyber));
    if (button.dataset.space !== undefined) answerSpace(Number(button.dataset.space));
    if (button.dataset.move) moveNinja(button.dataset.move);
    if (button.dataset.boost) boostRace();
});

function startSelectedGame() {
    stopCurrentGame();

    switch (currentGame.name) {
        case "Kingdom Wars": startKingdomWars(); break;
        case "Cyber Strike": startCyberStrike(); break;
        case "Lost Kingdom": startLostKingdom(); break;
        case "Neon Racer": startNeonRacer(); break;
        case "Shadow Ninja": startShadowNinja(); break;
        case "Space Explorer": startSpaceExplorer(); break;
    }
}


// ==========================================
// KINGDOM WARS
// ==========================================

let kingdom = {};

function startKingdomWars() {
    kingdom = { gold: 100, food: 80, happiness: 60, turn: 1 };

    drawKingdom("Welcome, ruler! Build your kingdom in five turns.");
}

function drawKingdom(message) {
    gameArea.innerHTML = `
        <div class="game-panel">
            <h3>👑 YOUR KINGDOM</h3>
            <div class="game-stats">
                <span>💰 Gold: ${kingdom.gold}</span>
                <span>🌾 Food: ${kingdom.food}</span>
                <span>😊 Happiness: ${kingdom.happiness}</span>
            </div>
            <p>Turn ${kingdom.turn} / 5</p>
            <p class="game-message">${message}</p>
            <div class="choice-grid">
                <button class="game-button" data-kingdom="farm">🌾 Build Farm<br>30 Gold</button>
                <button class="game-button" data-kingdom="market">🏪 Build Market<br>25 Gold</button>
                <button class="game-button" data-kingdom="festival">🎉 Hold Festival<br>20 Gold</button>
                <button class="game-button" data-kingdom="trade">🤝 Trade Supplies<br>Gain Gold</button>
            </div>
        </div>
    `;
}

function kingdomAction(action) {
    let message = "";

    if (action === "farm") {
        if (kingdom.gold < 30) return drawKingdom("Not enough gold! Try trading.");
        kingdom.gold -= 30;
        kingdom.food += 35;
        message = "Farm built! Food increased.";
    }

    if (action === "market") {
        if (kingdom.gold < 25) return drawKingdom("Not enough gold! Try trading.");
        kingdom.gold += 20;
        kingdom.happiness += 5;
        message = "Market built! Your economy is growing.";
    }

    if (action === "festival") {
        if (kingdom.gold < 20) return drawKingdom("Not enough gold! Try trading.");
        kingdom.gold -= 20;
        kingdom.happiness += 20;
        message = "Festival held! The people are happy.";
    }

    if (action === "trade") {
        kingdom.gold += 25;
        kingdom.food -= 5;
        message = "Trade successful! You earned gold.";
    }

    kingdom.food = Math.max(0, kingdom.food - 5);
    if (kingdom.food === 0) kingdom.happiness -= 10;

    kingdom.happiness = Math.max(0, Math.min(100, kingdom.happiness));
    kingdom.turn++;

    if (kingdom.turn > 5) {
        gameArea.innerHTML = `
            <div class="game-panel">
                <h3>🏰 KINGDOM COMPLETE!</h3>
                <div class="game-stats">
                    <span>💰 ${kingdom.gold} Gold</span>
                    <span>🌾 ${kingdom.food} Food</span>
                    <span>😊 ${kingdom.happiness} Happiness</span>
                </div>
                <h2>YOUR KINGDOM SCORE: ${kingdom.gold + kingdom.food + kingdom.happiness * 2}</h2>
                <p class="game-message">Your leadership shaped this kingdom!</p>
                <button class="game-button" data-action="restart">↻ PLAY AGAIN</button>
            </div>
        `;
    } else {
        drawKingdom(message);
    }
}


// ==========================================
// LOST KINGDOM
// ==========================================

let lostIndex = 0;
let lostScore = 0;

const lostQuestions = [
    { q: "What helps you find direction?", a: ["A compass", "A pillow", "A spoon"], c: 0 },
    { q: "Where might an ancient treasure be kept?", a: ["A treasure chest", "A cup", "A shoe"], c: 0 },
    { q: "Which place could hide ancient secrets?", a: ["An old castle", "A bus stop", "A supermarket"], c: 0 }
];

function startLostKingdom() {
    lostIndex = 0;
    lostScore = 0;
    drawLostQuestion();
}

function drawLostQuestion() {
    if (lostIndex >= lostQuestions.length) {
        gameArea.innerHTML = `
            <div class="game-panel">
                <h3>🏆 ADVENTURE COMPLETE!</h3>
                <h2>${lostScore} / 3</h2>
                <p class="game-message">You explored the Lost Kingdom!</p>
                <button class="game-button" data-action="restart">PLAY AGAIN</button>
            </div>
        `;
        return;
    }

    const q = lostQuestions[lostIndex];

    gameArea.innerHTML = `
        <div class="game-panel">
            <h3>🗺️ LOST KINGDOM</h3>
            <p>Clue ${lostIndex + 1} of 3</p>
            <p class="game-message">${q.q}</p>
            <div class="choice-grid">
                ${q.a.map((answer, i) =>
                    `<button class="game-button" data-answer="${i}">${answer}</button>`
                ).join("")}
            </div>
        </div>
    `;
}

function answerLost(answer) {
    if (answer === lostQuestions[lostIndex].c) lostScore++;
    lostIndex++;
    drawLostQuestion();
}


// ==========================================
// CYBER STRIKE
// ==========================================

let cyberSequence = [];
let cyberStep = 0;
let cyberActive = false;

function startCyberStrike() {
    cyberSequence = Array.from({ length: 4 }, () => Math.floor(Math.random() * 4));
    cyberStep = 0;
    cyberActive = false;

    gameArea.innerHTML = `
        <div class="game-panel">
            <h3>⚡ CYBER MEMORY</h3>
            <p>Memorise the sequence and repeat it.</p>
            <p class="game-message" id="cyberMessage">Watch carefully...</p>
            <div class="choice-grid">
                ${["🔵", "🟣", "🟢", "🟡"].map((symbol, i) =>
                    `<button class="game-button" data-cyber="${i}" disabled>${symbol}</button>`
                ).join("")}
            </div>
            <p id="cyberProgress">0 / 4</p>
        </div>
    `;

    const buttons = gameArea.querySelectorAll("[data-cyber]");
    const message = document.getElementById("cyberMessage");
    let position = 0;

    function showNext() {
        if (position >= cyberSequence.length) {
            message.textContent = "Your turn! Repeat the sequence.";
            cyberActive = true;
            buttons.forEach(b => b.disabled = false);
            return;
        }

        message.textContent = ["🔵", "🟣", "🟢", "🟡"][cyberSequence[position]];
        position++;

        const timer = setTimeout(showNext, 850);
        gameCleanup = () => {
            cyberActive = false;
            clearTimeout(timer);
        };
    }

    showNext();
}

function answerCyber(value) {
    if (!cyberActive) return;

    if (value !== cyberSequence[cyberStep]) {
        cyberActive = false;
        gameArea.innerHTML = `
            <div class="game-panel">
                <h3>⚡ CYBER STRIKE</h3>
                <p class="game-message">Sequence incorrect. Try again!</p>
                <button class="game-button" data-action="restart">RETRY</button>
            </div>
        `;
        return;
    }

    cyberStep++;
    document.getElementById("cyberProgress").textContent = `${cyberStep} / 4`;

    if (cyberStep === 4) {
        cyberActive = false;
        gameArea.innerHTML = `
            <div class="game-panel">
                <h3>🎉 PERFECT MEMORY!</h3>
                <p class="game-message">You completed Cyber Strike!</p>
                <button class="game-button" data-action="restart">PLAY AGAIN</button>
            </div>
        `;
    }
}


// ==========================================
// NEON RACER
// ==========================================

let raceScore = 0;
let raceTime = 15;
let raceActive = false;

function startNeonRacer() {
    raceScore = 0;
    raceTime = 15;
    raceActive = true;

    gameArea.innerHTML = `
        <div class="game-panel">
            <h3>🏎️ NEON RACER</h3>
            <p>Click BOOST as many times as possible in 15 seconds!</p>
            <div class="game-stats">
                <span>Score: <b id="raceScore">0</b></span>
                <span>Time: <b id="raceTime">15</b>s</span>
            </div>
            <button class="game-button" data-boost="yes">⚡ BOOST!</button>
            <p class="game-message" id="raceMessage">Ready, set, race!</p>
        </div>
    `;

    const timer = setInterval(() => {
        if (!raceActive) {
            clearInterval(timer);
            return;
        }

        raceTime--;
        const display = document.getElementById("raceTime");
        if (display) display.textContent = raceTime;

        if (raceTime <= 0) {
            raceActive = false;
            clearInterval(timer);
            gameArea.innerHTML = `
                <div class="game-panel">
                    <h3>🏁 RACE COMPLETE!</h3>
                    <h2>${raceScore} POINTS</h2>
                    <button class="game-button" data-action="restart">RACE AGAIN</button>
                </div>
            `;
        }
    }, 1000);

    gameCleanup = () => {
        raceActive = false;
        clearInterval(timer);
    };
}

function boostRace() {
    if (!raceActive) return;
    raceScore++;
    const display = document.getElementById("raceScore");
    if (display) display.textContent = raceScore;
}


// ==========================================
// SHADOW NINJA - IMPROVED MAZE
// ==========================================

let ninjaPosition = { row: 0, col: 0 };
let ninjaStars = 0;
let ninjaMoves = 0;
let ninjaFinished = false;

const ninjaMaze = [
    ["S", ".", "#", ".", "."],
    ["#", ".", "#", ".", "#"],
    [".", ".", ".", ".", "."],
    [".", "#", "#", ".", "#"],
    [".", ".", "★", ".", "E"]
];

function startShadowNinja() {
    ninjaPosition = { row: 0, col: 0 };
    ninjaStars = 0;
    ninjaMoves = 0;
    ninjaFinished = false;
    drawNinjaMaze("Find the star ⭐ and reach the exit 🏁!");
}

function drawNinjaMaze(message) {
    const mazeHTML = ninjaMaze.map((row, r) => `
        <div class="ninja-row">
            ${row.map((cell, c) => {
                let content = "";

                if (ninjaPosition.row === r && ninjaPosition.col === c) {
                    content = '<div class="ninja-symbol"><span></span></div>';
                } else if (cell === "#") {
                    content = "🧱";
                } else if (cell === "★" && !ninjaStars) {
                    content = "⭐";
                } else if (cell === "E") {
                    content = "🏁";
                } else {
                    content = "·";
                }

                return `<div class="ninja-cell ${cell === "#" ? "wall" : ""}">${content}</div>`;
            }).join("")}
        </div>
    `).join("");

    gameArea.innerHTML = `
        <div class="game-panel ninja-game">
            <h3>🥷 SHADOW NINJA</h3>
            <p>Navigate the maze. Collect the star and reach the exit.</p>

            <div class="game-stats">
                <span>⭐ Stars: ${ninjaStars}/1</span>
                <span>👣 Moves: ${ninjaMoves}</span>
            </div>

            <div class="ninja-maze">${mazeHTML}</div>

            <p class="game-message">${message}</p>

            <div class="ninja-controls">
                <button class="game-button" data-move="up">⬆ UP</button>
                <div>
                    <button class="game-button" data-move="left">⬅ LEFT</button>
                    <button class="game-button" data-move="down">⬇ DOWN</button>
                    <button class="game-button" data-move="right">RIGHT ➡</button>
                </div>
            </div>

            <button class="game-button secondary" data-action="restart">↻ RESTART MAZE</button>
        </div>
    `;
}

function moveNinja(direction) {
    if (ninjaFinished) return;

    let row = ninjaPosition.row;
    let col = ninjaPosition.col;

    if (direction === "up") row--;
    if (direction === "down") row++;
    if (direction === "left") col--;
    if (direction === "right") col++;

    if (
        row < 0 || row >= ninjaMaze.length ||
        col < 0 || col >= ninjaMaze[0].length ||
        ninjaMaze[row][col] === "#"
    ) {
        drawNinjaMaze("A wall blocks your path. Try another direction!");
        return;
    }

    ninjaPosition = { row, col };
    ninjaMoves++;

    if (ninjaMaze[row][col] === "★") {
        ninjaStars = 1;
    }

    if (ninjaMaze[row][col] === "E") {
        ninjaFinished = true;

        if (ninjaStars) {
            drawNinjaMaze("🏆 Mission complete! You collected the star and escaped!");
        } else {
            drawNinjaMaze("You found the exit! Collect the star first for a bonus challenge.");
        }

        return;
    }

    drawNinjaMaze(ninjaStars ? "Star collected! Find the exit!" : "Keep moving, ninja!");
}


// ==========================================
// SPACE EXPLORER
// ==========================================

let spaceIndex = 0;
let spaceScore = 0;

const spaceQuestions = [
    { q: "Which planet is known as the Red Planet?", a: ["Mars", "Venus", "Neptune"], c: 0 },
    { q: "What is the star at the centre of our solar system?", a: ["The Moon", "The Sun", "Polaris"], c: 1 },
    { q: "Which planet has famous rings?", a: ["Mercury", "Earth", "Saturn"], c: 2 },
    { q: "What is Earth's natural satellite?", a: ["The Moon", "The Sun", "Mars"], c: 0 }
];

function startSpaceExplorer() {
    spaceIndex = 0;
    spaceScore = 0;
    drawSpaceQuestion();
}

function drawSpaceQuestion() {
    if (spaceIndex >= spaceQuestions.length) {
        gameArea.innerHTML = `
            <div class="game-panel">
                <h3>🚀 MISSION COMPLETE!</h3>
                <h2>${spaceScore} / 4 POINTS</h2>
                <p class="game-message">You completed your space exploration!</p>
                <button class="game-button" data-action="restart">PLAY AGAIN</button>
            </div>
        `;
        return;
    }

    const q = spaceQuestions[spaceIndex];

    gameArea.innerHTML = `
        <div class="game-panel">
            <h3>🌌 SPACE EXPLORER</h3>
            <p>Question ${spaceIndex + 1} of 4</p>
            <p class="game-message">${q.q}</p>
            <div class="choice-grid">
                ${q.a.map((answer, i) =>
                    `<button class="game-button" data-space="${i}">${answer}</button>`
                ).join("")}
            </div>
        </div>
    `;
}

function answerSpace(answer) {
    if (answer === spaceQuestions[spaceIndex].c) spaceScore++;
    spaceIndex++;
    drawSpaceQuestion();
}


// ==========================================
// STARTUP
// ==========================================

renderGames();
console.log("GAMEHUB ARCADE: All games loaded!");
