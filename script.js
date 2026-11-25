
// GAMEHUB ARCADE - MAIN JAVASCRIPT

// MOBILE NAVIGATION

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");

    menuToggle.textContent =
        navLinks.classList.contains("active") ? "✕" : "☰";
});

navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        menuToggle.textContent = "☰";
    });
});


// GAME SEARCH AND FILTER

const gameCards = document.querySelectorAll(".game-card");
const filterButtons = document.querySelectorAll(".filter");
const searchInput = document.getElementById("gameSearch");
const noResults = document.getElementById("noResults");

let selectedCategory = "all";

function filterGames() {
    const searchText = searchInput.value.toLowerCase();
    let visibleCount = 0;

    gameCards.forEach(card => {
        const category = card.dataset.category;
        const name = card.dataset.name;

        const categoryMatch =
            selectedCategory === "all" ||
            category === selectedCategory;

        const searchMatch = name.includes(searchText);

        if (categoryMatch && searchMatch) {
            card.style.display = "";
            visibleCount++;
        } else {
            card.style.display = "none";
        }
    });

    noResults.hidden = visibleCount !== 0;
}

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        filterButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");
        selectedCategory = button.dataset.category;

        filterGames();
    });
});

searchInput.addEventListener("input", filterGames);


// GAME INFORMATION POPUP

const gameModal = document.getElementById("gameModal");
const modalTitle = document.getElementById("modalTitle");
const modalDescription =
    document.getElementById("modalDescription");

const gameDescriptions = {
    "Cyber Strike":
        "Enter a futuristic action adventure and discover a world of challenges.",

    "Lost Kingdom":
        "Explore mysterious lands, discover hidden secrets and experience an adventure.",

    "Neon Racer":
        "Experience futuristic racing with speed, excitement and neon-inspired worlds.",

    "Kingdom Wars":
        "Explore strategic gameplay, build your kingdom and plan your next move.",

    "Shadow Ninja":
        "Discover a ninja-themed adventure filled with mystery and challenges.",

    "Space Explorer":
        "Explore distant galaxies and discover the wonders of the universe."
};

document.querySelectorAll(".details-btn").forEach(button => {
    button.addEventListener("click", () => {
        const gameName = button.dataset.game;

        modalTitle.textContent = gameName;
        modalDescription.textContent =
            gameDescriptions[gameName];

        gameModal.classList.add("show");
        gameModal.setAttribute("aria-hidden", "false");
    });
});

function closeGameModal() {
    gameModal.classList.remove("show");
    gameModal.setAttribute("aria-hidden", "true");
}

document.getElementById("closeModal")
    .addEventListener("click", closeGameModal);

document.getElementById("modalDone")
    .addEventListener("click", closeGameModal);

gameModal.addEventListener("click", event => {
    if (event.target === gameModal) {
        closeGameModal();
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeGameModal();
    }
});
