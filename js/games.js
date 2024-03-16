// Add games to this variable
const games = [
    { done: false, name: "Postal", image: "https://cdn2.steamgriddb.com/thumb/05b5f43841bf592510e90dffa4bf2177.jpg" },
    { done: false, name: "Postal 2", image: "https://cdn2.steamgriddb.com/thumb/e568b8f6bbb04a676a4f9f7dd79dc79f.jpg" },
    { done: false, name: "Postal: Brain Damaged", image: "https://cdn2.steamgriddb.com/thumb/a857ff5359cbc948ae2b81468839d718.jpg" },
];

function generateGames() {
    const contentDiv = document.getElementById('content');
    games.forEach(game => {
        const gameDiv = document.createElement('div');
        gameDiv.classList.add('game');
        
        const gameImage = document.createElement('img');
        gameImage.src = game.image;
        gameImage.alt = game.name; // Set alt text to game name
        
        // Add styling if done = true
        if (game.done) {
            gameImage.classList.add('doneEffect');
        }

        gameDiv.appendChild(gameImage);
        contentDiv.appendChild(gameDiv);
    });
}


// Call the function to generate games when the page loads
window.onload = generateGames;