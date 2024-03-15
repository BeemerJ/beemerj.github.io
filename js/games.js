        // Array of game objects
        const games = [
            { name: "Postal", image: "../assets/images/covers/postal.jpg" },
            { name: "Postal 2", image: "../assets/images/covers/postal2.jpg" },
            { name: "Postal: Brain Damaged", image: "../assets/images/covers/postal_bd.jpg" },
        ];

        // Function to generate HTML for each game
        function generateGames() {
            const contentDiv = document.getElementById('content');
            games.forEach(game => {
                const gameDiv = document.createElement('div');
                gameDiv.classList.add('game');
                const gameImage = document.createElement('img');
                gameImage.src = game.image;
                gameImage.alt = game.name;
                const gameName = document.createElement('span');
                gameName.textContent = game.name;
                gameName.classList.add('gameName'); // Adding class for styling
                gameDiv.appendChild(gameImage);
                gameDiv.appendChild(gameName);
                contentDiv.appendChild(gameDiv);
            });
        }

        // Call the function to generate games when the page loads
        window.onload = generateGames;