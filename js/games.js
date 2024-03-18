const o = []; // ongoing...
const c = []; // completed...
const p = []; // pending...

// Add games here...
const games = [
    { status: p, name: "Postal", info: "https://www.igdb.com/games/postal", image: "https://cdn2.steamgriddb.com/thumb/05b5f43841bf592510e90dffa4bf2177.jpg" },
    { status: p, name: "Postal 2", info: "https://www.igdb.com/games/postal-2", image: "https://cdn2.steamgriddb.com/thumb/e568b8f6bbb04a676a4f9f7dd79dc79f.jpg" },
    { status: p, name: "System Shock", info: "https://www.igdb.com/games/system-shock", image: "https://cdn2.steamgriddb.com/thumb/69a51eb82d1e05b00d1fcc0c56fdd7de.jpg" },
    { status: p, name: "System Shock 2", info: "https://www.igdb.com/games/system-shock-2", image: "https://cdn2.steamgriddb.com/thumb/7a9114855a255f1dcf1abaae60abb86e.jpg" },
    { status: p, name: "Thief Gold", info: "https://www.igdb.com/games/thief-gold", image: "https://cdn2.steamgriddb.com/thumb/b6a1d13a42311ce87d15f5f7924f6ae8.jpg" },
    { status: p, name: "Thief: The Black Parade", info: "https://www.igdb.com/games/thief-the-black-parade", image: "https://cdn2.steamgriddb.com/thumb/1c4aacf677578cfe11cfb1960f5f1af2.jpg" },
    { status: p, name: "Silent Hill 2", info: "https://www.igdb.com/games/silent-hill-2", image: "https://cdn2.steamgriddb.com/thumb/7a61d7f8bdd6d6b83fc4010eaae95a30.jpg" },
    { status: p, name: "Resident Evil", info: "https://www.igdb.com/games/resident-evil", image: "https://cdn2.steamgriddb.com/thumb/8e1dada1c500c6111f57857095517a28.jpg" },
    { status: p, name: "Resident Evil 2", info: "https://www.igdb.com/games/resident-evil-2", image: "https://cdn2.steamgriddb.com/thumb/0dcc410f031086c33eb571e62007951b.jpg" },
    { status: p, name: "Eviternity II", info: "https://www.igdb.com/games/eviternity-ii", image: "https://cdn2.steamgriddb.com/thumb/5656595700378abbe8ef6b57aead16de.jpg" },
    { status: p, name: "Quake: Arcane Dimensions", info: "https://www.igdb.com/games/arcane-dimensions", image: "https://cdn2.steamgriddb.com/thumb/508efbb5ec58a84b0b668bd3111cc60c.jpg" },
    { status: p, name: "SimCity 3000", info: "https://www.igdb.com/games/simcity-3000", image: "https://cdn2.steamgriddb.com/thumb/eb44ca5ed97e5c4d9daf0acc372be261.jpg" },
    { status: p, name: "Midnight Club 3", info: "https://www.igdb.com/games/midnight-club-3-dub-edition", image: "https://cdn2.steamgriddb.com/thumb/53fc08a6421fcd803b6f7c6798241bf5.jpg" },
    { status: p, name: "Halo: Combat Evolved", info: "https://www.igdb.com/games/halo-combat-evolved", image: "https://cdn2.steamgriddb.com/thumb/477aaa93492109be31a9c22df598c952.jpg" },
    { status: p, name: "Super Mario Bros.", info: "https://www.igdb.com/games/super-mario-bros", image: "https://cdn2.steamgriddb.com/thumb/75f29e87a3923053bde594667a5e33d3.jpg" },
    { status: p, name: "Super Mario Bros. 3", info: "https://www.igdb.com/games/super-mario-bros-3", image: "https://cdn2.steamgriddb.com/thumb/4884a0550425e7b5d8428cb8996f2c11.jpg" },
    { status: p, name: "Super Mario World", info: "https://www.igdb.com/games/super-mario-world", image: "https://cdn2.steamgriddb.com/thumb/2bf887cd37fa5ba4ce0ba9713013a4f7.jpg" },
    { status: p, name: "The Legend of Zelda: A Link to the Past", info: "https://www.igdb.com/games/the-legend-of-zelda-a-link-to-the-past", image: "https://cdn2.steamgriddb.com/thumb/7edaadde50012f0860952123564eb1ba.jpg" },
    { status: p, name: "The Legend of Zelda: The Minish Cap", info: "https://www.igdb.com/games/the-legend-of-zelda-the-minish-cap", image: "https://cdn2.steamgriddb.com/thumb/a687f78b9842c87225e74921765feb1b.jpg" },
    { status: p, name: "Arx Fatalis", info: "https://www.igdb.com/games/arx-fatalis", image: "https://cdn2.steamgriddb.com/thumb/52158d6f6f2a8228033b2dd5924de7f7.jpg" },
    { status: p, name: "Option Tuning Car Battle Spec-R", info: "https://www.igdb.com/games/option-tuning-car-battle-spec-r", image: "https://i.pinimg.com/736x/7b/5c/77/7b5c77a2ceef6add4cce73bee3afe879.jpg" }, // Had to make my own cover here...
    { status: p, name: "Metroid Fusion", info: "https://www.igdb.com/games/metroid-fusion", image: "https://cdn2.steamgriddb.com/thumb/1883a19a4983372e803beab695ee77f1.jpg" },
    { status: p, name: "Super Metroid", info: "https://www.igdb.com/games/super-metroid", image: "https://cdn2.steamgriddb.com/thumb/167248f62dbaf61aff4b7d1be9439282.jpg" },
    { status: p, name: "Castlevania: Symphony of the Night", info: "https://www.igdb.com/games/castlevania-symphony-of-the-night", image: "https://cdn2.steamgriddb.com/thumb/07f1de397293d02ea1ee1a1be4434dd5.jpg" },
    { status: p, name: "Pathologic", info: "https://www.igdb.com/games/pathologic", image: "https://cdn2.steamgriddb.com/thumb/d0746052c56b31772fa81af9b31a9c19.jpg" },
    { status: p, name: "Amnesia: The Dark Descent", info: "https://www.igdb.com/games/amnesia-the-dark-descent", image: "https://cdn2.steamgriddb.com/thumb/56ac6061c5646a646d983c9314dad956.jpg" },
    { status: p, name: "Penumbra: Overture", info: "https://www.igdb.com/games/penumbra-overture", image: "https://cdn2.steamgriddb.com/thumb/abefb9fa9a298bd8919be8ac056871b6.jpg" },
    { status: p, name: "Burnout Revenge", info: "https://www.igdb.com/games/burnout-revenge", image: "https://cdn2.steamgriddb.com/thumb/0066a9752d9cb8aaa8e517c703c5ad1f.png" },
    { status: p, name: "Blood: Death Wish", info: "https://www.igdb.com/games/blood", image: "https://cdn2.steamgriddb.com/thumb/9b76e7ef3ee6dc4e92daf8c5c0a618c3.jpg" },
    { status: p, name: "Ion Fury", info: "https://www.igdb.com/games/ion-fury", image: "https://cdn2.steamgriddb.com/thumb/175e0b2d218c15ff16379ace7ca2341a.jpg" },
    { status: p, name: "Cataclysm: Dark Days Ahead", info: "https://www.igdb.com/games/cataclysm-dark-days-ahead", image: "https://cdn2.steamgriddb.com/thumb/1c5d43a0f69492a369dba76354a3fe52.jpg" },
    { status: p, name: "The Elder Scrolls II: Daggerfall", info: "https://www.igdb.com/games/the-elder-scrolls-ii-daggerfall", image: "https://cdn2.steamgriddb.com/thumb/2fe2186da00dfaa4bb4829cd7655ea0d.jpg" },

];

// Sort games alphabetically...
games.sort((a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    if (nameA < nameB) {
        return -1;
    }
    if (nameA > nameB) {
        return 1;
    }
    // names must be equal
    return 0;
});

// Log the total number of games and the metadata in an array...
console.log("Total Games: " + games.length);
console.log(games);

// Main function to display games...
function generateGames() {
    const contentDiv = document.getElementById("content");
    games.forEach((game, index) => {
        const gameDiv = document.createElement("div");
        gameDiv.classList.add("game");
        gameDiv.id = "game_" + index; // Unique identifier for each game

        const gameInfo = document.createElement("a");
        gameInfo.href = game.info;

        const gameImage = document.createElement("img");
        gameImage.src = game.image;
        gameImage.alt = game.name;

        // Show image after it's been loaded
        gameImage.addEventListener("load", function() {
            gameImage.style.opacity   = "1";
        });

        if (game.status === o) {
            gameImage.classList.add("ongoingEffect");
        }
        if (game.status === c) {
            gameImage.classList.add("completedEffect");
        }
        if (game.status === p) {
            gameImage.classList.add("pendingEffect");
        }

        gameInfo.appendChild(gameImage);
        gameDiv.appendChild(gameInfo);
        contentDiv.appendChild(gameDiv);
    });
}

// Function for hiding games with the buttons...
function hideGames() {
    const oButton = document.getElementById("ongoingBtn");
    const cButton = document.getElementById("completedBtn");
    const pButton = document.getElementById("pendingBtn");
    const aButton = document.getElementById("allBtn");

    function setActiveButton(button) {
        // Reset button style by default
        [oButton, cButton, pButton, aButton].forEach(btn => {
            btn.style.backgroundColor = "";
            btn.style.color = "";
        });
        // Styling for the current selected button
        button.style.backgroundColor = "#ffa500";
        button.style.color = "#000";
    }

    oButton.addEventListener("click", function () {
        setActiveButton(oButton);

        // Show only ongoing games...
        games.forEach(function (game) {
            const gameDiv = document.querySelector(`img[alt="${game.name}"]`).parentNode;
            gameDiv.style.display = game.status === o ? "block" : "none";
        });
    });

    cButton.addEventListener("click", function () {
        setActiveButton(cButton);
        // Show only completed games...
        games.forEach(function (game) {
            const gameDiv = document.querySelector(`img[alt="${game.name}"]`).parentNode;
            gameDiv.style.display = game.status === c ? "block" : "none";
        });
    });

    pButton.addEventListener("click", function () {
        setActiveButton(pButton);
        // Show only pending games...
        games.forEach(function (game) {
            const gameDiv = document.querySelector(`img[alt="${game.name}"]`).parentNode;
            gameDiv.style.display = game.status === p ? "block" : "none";
        });
    });

    aButton.addEventListener("click", function () {
        setActiveButton(aButton);
        // Show all games...
        games.forEach(function (game) {
            const gameDiv = document.querySelector(`img[alt="${game.name}"]`).parentNode;
            gameDiv.style.display = "block";
        });
    });

    aButton.click(); // Set "All" as the default
}

// Calls all funtions on window load...
window.onload = function () {
    generateGames();
    hideGames();
};