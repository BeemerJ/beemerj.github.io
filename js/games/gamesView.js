let isListView = false;

function toggleView() {
    const contentDiv = document.getElementById("content");
    const toggleBtn = document.getElementById("toggleViewBtn");
    const games = document.querySelectorAll(".game");
    
    isListView = !isListView;
    
    if (isListView) {
        contentDiv.classList.add("list-view");
        toggleBtn.textContent = "Grid View";
        games.forEach(game => {
            game.innerHTML += game.dataset.details;
        });
    } else {
        contentDiv.classList.remove("list-view");
        toggleBtn.textContent = "List View";
        games.forEach(game => {
            const details = game.querySelector(".game-details");
            if (details) details.remove();
        });
    }
}

window.addEventListener("load", initializeToggleView);