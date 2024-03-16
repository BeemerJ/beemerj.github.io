const o = []; // ongoing...
const c = []; // completed...
const p = []; // pending...

// Add games here...
const games = [
    { status: p, name: "Postal", image: "https://cdn2.steamgriddb.com/thumb/05b5f43841bf592510e90dffa4bf2177.jpg" },
    { status: p, name: "Postal 2", image: "https://cdn2.steamgriddb.com/thumb/e568b8f6bbb04a676a4f9f7dd79dc79f.jpg" },
    { status: o, name: "System Shock", image: "https://cdn2.steamgriddb.com/thumb/69a51eb82d1e05b00d1fcc0c56fdd7de.jpg" },
    { status: o, name: "System Shock 2", image: "https://cdn2.steamgriddb.com/thumb/7a9114855a255f1dcf1abaae60abb86e.jpg" },
    { status: p, name: "Thief Gold", image: "https://cdn2.steamgriddb.com/thumb/b6a1d13a42311ce87d15f5f7924f6ae8.jpg" },
    { status: p, name: "Thief: The Black Parade", image: "https://cdn2.steamgriddb.com/thumb/1c4aacf677578cfe11cfb1960f5f1af2.jpg" },
    { status: p, name: "Silent Hill 2", image: "https://cdn2.steamgriddb.com/thumb/7a61d7f8bdd6d6b83fc4010eaae95a30.jpg" },
    { status: p, name: "Resident Evil", image: "https://cdn2.steamgriddb.com/thumb/8e1dada1c500c6111f57857095517a28.jpg" },
    { status: p, name: "Resident Evil 2", image: "https://cdn2.steamgriddb.com/thumb/0dcc410f031086c33eb571e62007951b.jpg" },
    { status: p, name: "Eviternity II", image: "https://cdn2.steamgriddb.com/thumb/5656595700378abbe8ef6b57aead16de.jpg" },
    { status: p, name: "Quake: Arcane Dimensions", image: "https://cdn2.steamgriddb.com/thumb/508efbb5ec58a84b0b668bd3111cc60c.jpg" },
    { status: p, name: "SimCity 3000", image: "https://cdn2.steamgriddb.com/thumb/eb44ca5ed97e5c4d9daf0acc372be261.jpg" },
    { status: p, name: "Midnight Club 3", image: "https://cdn2.steamgriddb.com/thumb/53fc08a6421fcd803b6f7c6798241bf5.jpg" },
    { status: p, name: "Halo: Combat Evolved", image: "https://cdn2.steamgriddb.com/thumb/477aaa93492109be31a9c22df598c952.jpg" },
    { status: p, name: "Super Mario Bros.", image: "https://cdn2.steamgriddb.com/thumb/75f29e87a3923053bde594667a5e33d3.jpg" },
    { status: p, name: "Super Mario Bros. 3", image: "https://cdn2.steamgriddb.com/thumb/4884a0550425e7b5d8428cb8996f2c11.jpg" },
    { status: p, name: "Super Mario World", image: "https://cdn2.steamgriddb.com/thumb/2bf887cd37fa5ba4ce0ba9713013a4f7.jpg" },
    { status: p, name: "The Legend of Zelda: A Link to the Past", image: "https://cdn2.steamgriddb.com/thumb/7edaadde50012f0860952123564eb1ba.jpg" },
    { status: p, name: "The Legend of Zelda: The Minish Cap", image: "https://cdn2.steamgriddb.com/thumb/a687f78b9842c87225e74921765feb1b.jpg" },

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
    games.forEach(game => {
        const gameDiv = document.createElement("div");
        gameDiv.classList.add("game");

        const gameImage = document.createElement("img");
        gameImage.src = game.image; // Set the image to the games.image
        gameImage.alt = game.name; // Set alt text to game name

        if (game.status === o) {
            gameImage.classList.add("ongoingEffect");
        }
        if (game.status === c) {
            gameImage.classList.add("completedEffect");
        }
        if (game.status === p) {
            gameImage.classList.add("pendingEffect");
        }

        gameDiv.appendChild(gameImage);
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