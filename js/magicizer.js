const apiUrl = 'https://api.scryfall.com/cards/search';
const autocompleteUrl = 'https://api.scryfall.com/cards/autocomplete';
const setsUrl = 'https://api.scryfall.com/sets';

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const resultsContainer = document.getElementById('results');
    const setSelect = document.getElementById('set-select');

    // --- Autocomplete dropdown ---
    const autocompleteList = document.createElement('ul');
    autocompleteList.className = 'autocomplete-list';
    autocompleteList.style.position = 'absolute';
    autocompleteList.style.zIndex = 1000;
    autocompleteList.style.background = '#fff';
    autocompleteList.style.listStyle = 'none';
    autocompleteList.style.padding = '0';
    autocompleteList.style.margin = '0';
    autocompleteList.style.marginTop = '12px';
    autocompleteList.style.border = '1px solid #ccc';
    autocompleteList.style.width = searchInput.offsetWidth + 'px';
    autocompleteList.style.display = 'none';
    searchInput.parentNode.appendChild(autocompleteList);

    searchInput.addEventListener('input', async () => {
        const query = searchInput.value.trim();
        if (query.length < 2) {
            autocompleteList.style.display = 'none';
            return;
        }
        const res = await fetch(`${autocompleteUrl}?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        autocompleteList.innerHTML = '';
        if (data.data && data.data.length > 0) {
            data.data.forEach(suggestion => {
                const li = document.createElement('li');
                li.textContent = suggestion;
                li.style.padding = '4px 8px';
                li.style.cursor = 'pointer';
                li.addEventListener('mousedown', () => {
                    searchInput.value = suggestion;
                    autocompleteList.style.display = 'none';
                });
                autocompleteList.appendChild(li);
            });
            autocompleteList.style.display = 'block';
        } else {
            autocompleteList.style.display = 'none';
        }
    });

    document.addEventListener('click', (e) => {
        if (!autocompleteList.contains(e.target) && e.target !== searchInput) {
            autocompleteList.style.display = 'none';
        }
    });

    // --- Populate sets dropdown ---
    async function populateSets() {
        const res = await fetch(setsUrl);
        const data = await res.json();
        setSelect.innerHTML = '<option value="">All Sets</option>';
        data.data.forEach(set => {
            if (set.set_type !== 'promo' && set.set_type !== 'token' && set.set_type !== 'memorabilia') {
                const option = document.createElement('option');
                option.value = set.code;
                option.textContent = `${set.name} (${set.code.toUpperCase()})`;
                setSelect.appendChild(option);
            }
        });
    }
    populateSets();

    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        const set = setSelect.value;
        if (query) fetchCards(query, set);
    });

    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') searchButton.click();
    });

    async function fetchCards(query, set) {
        showLoading();
        try {
            let fullQuery = query;
            if (set) fullQuery += ` set:${set}`;
            const response = await fetch(`${apiUrl}?q=${encodeURIComponent(fullQuery)}`);
            const data = await response.json();
            displayResults(data.data); // Scryfall returns cards in 'data'
        } catch (error) {
            resultsContainer.innerHTML = '<p style="color:#d7263d;">Error fetching cards.</p>';
        }
    }

    function showLoading() {
        resultsContainer.innerHTML = '<div class="loading-spinner"></div>';
    }

    function getManaColors(card) {
        // Prefer 'colors', fallback to 'color_identity'
        return (card.colors && card.colors.length > 0 ? card.colors : card.color_identity && card.color_identity.length > 0 ? card.color_identity : ['C']);
    }

    function manaColorToHex(color) {
        switch (color) {
            case 'W': return '#fffcd0'; // White
            case 'U': return '#a9dff9'; // Blue
            case 'B': return '#cbc3bd'; // Black
            case 'R': return '#faa88c'; // Red
            case 'G': return '#97d9ae'; // Green
            case 'C': return '#dedcd8'; // Colorless
            default: return '#fffff';  // Fallback
        }
    }

    function getBorderStyleForCard(card) {
        const colors = getManaColors(card);
        if (colors.length === 1) {
            return manaColorToHex(colors[0]);
        } else if (colors.length > 1) {
            // Create a linear gradient for multicolor cards
            const hexes = colors.map(manaColorToHex).join(', ');
            return `linear-gradient(90deg, ${colors.map(manaColorToHex).join(', ')})`;
        } else {
            return manaColorToHex('C');
        }
    }

    function displayResults(cards) {
        resultsContainer.innerHTML = '';
        const placeholderImg = 'https://via.placeholder.com/223x310?text=No+Image';
        if (cards && cards.length > 0) {
            cards.forEach(card => {
                const cardElement = document.createElement('div');
                cardElement.classList.add('card');

                let imgUrl = placeholderImg;
                if (card.image_uris && card.image_uris.normal) {
                    imgUrl = card.image_uris.normal;
                } else if (
                    card.card_faces &&
                    card.card_faces[0] &&
                    card.card_faces[0].image_uris &&
                    card.card_faces[0].image_uris.normal
                ) {
                    imgUrl = card.card_faces[0].image_uris.normal;
                }

                // Mana color circles
                const manaColors = getManaColors(card);
                const circles = manaColors.map(color =>
                    `<span style="background:${manaColorToHex(color)}" title="${color}"></span>`
                ).join('');

                const manaCostIcons = renderManaCost(card.mana_cost);

                cardElement.innerHTML = `
                    <div class="card-image-wrapper">
                        <div class="card-image-spinner"></div>
                        <img src="${imgUrl}" alt="${card.name}" style="display:none;" onload="this.style.display='block';this.previousElementSibling.style.display='none';" onerror="this.style.display='block';this.previousElementSibling.style.display='none';this.src='${placeholderImg}';">
                    </div>
                    <div class="card-info">
                        <div class="card-set">
                            ${card.set_name ? card.set_name : ''}${card.set ? ` (${card.set.toUpperCase()})` : ''}
                        </div>
                        <div class="card-rarity ${card.rarity ? card.rarity : ''}">
                            ${card.rarity ? card.rarity : ''}
                        </div>
                        <h3>${card.name}</h3>
                        <div class="mana-cost">${manaCostIcons}</div>
                        <div class="card-type"><strong>${card.type_line || ''}</strong></div>
                        <div class="card-text">${card.oracle_text || ''}</div>
                    </div>
                `;
                resultsContainer.appendChild(cardElement);

                cardElement.addEventListener('click', () => {
                    // Create overlay
                    const overlay = document.createElement('div');
                    overlay.className = 'card-fullscreen-overlay';

                    // Card content (reuse card info, but bigger)
                    overlay.innerHTML = `
                        <div class="card-fullscreen-content">
                            <button class="card-fullscreen-close" title="Close">&times;</button>
                            <div class="card-3d-artwork">
                                <div class="card-3d-artwork-inner"
                                    data-tilt
                                    data-tilt-glare="true"
                                    data-tilt-max="18"
                                    data-tilt-glare-max="0.45"
                                    data-tilt-scale="1.08"
                                >
                                    <img src="${imgUrl}" alt="${card.name}">
                                </div>
                            </div>
                            <div class="card-fullscreen-info">
                                <div class="card-set">
                                    ${card.set_name ? card.set_name : ''}${card.set ? ` (${card.set.toUpperCase()})` : ''}
                                </div>
                                <div class="card-rarity ${card.rarity ? card.rarity : ''}">
                                    ${card.rarity ? card.rarity : ''}
                                </div>
                                <h3>${card.name}</h3>
                                <div class="mana-cost">${renderManaCost(card.mana_cost)}</div>
                                <div class="card-type"><strong>${card.type_line || ''}</strong></div>
                                <div class="card-text">${card.oracle_text || ''}</div>
                            </div>
                        </div>
                    `;
                    document.body.appendChild(overlay);

                    // ---- THIS IS IMPORTANT: ----
                    // Wait for the next tick to ensure the element is in the DOM
                    setTimeout(() => {
                        if (window.VanillaTilt) {
                            VanillaTilt.init(overlay.querySelectorAll(".card-3d-artwork-inner"), {
                                max: 18,
                                speed: 400,
                                glare: true,
                                "max-glare": 0.45,
                                scale: 1.08,
                            });
                        }
                    }, 0);

                    // Close logic
                    function closeOverlay() {
                        overlay.remove();
                        document.removeEventListener('keydown', escListener);
                    }
                    overlay.querySelector('.card-fullscreen-close').onclick = closeOverlay;
                    overlay.onclick = (e) => { if (e.target === overlay) closeOverlay(); };
                    function escListener(e) { if (e.key === 'Escape') closeOverlay(); }
                    document.addEventListener('keydown', escListener);
                });
            });
        } else {
            resultsContainer.innerHTML = '<p>No cards found.</p>';
        }
    }
});

let scryfallSymbols = {};

async function fetchScryfallSymbols() {
    const res = await fetch('https://api.scryfall.com/symbology');
    const data = await res.json();
    scryfallSymbols = {};
    data.data.forEach(symbol => {
        scryfallSymbols[symbol.symbol] = symbol.svg_uri;
    });
}
fetchScryfallSymbols();

function renderManaCost(manaCost) {
    if (!manaCost) return '';
    return manaCost.replace(/\{(.*?)\}/g, (match) => {
        const svg = scryfallSymbols[match];
        if (svg) {
            return `<img src="${svg}" alt="${match}" title="${match}"/>`;
        } else {
            return match; // fallback to text if not found
        }
    });
}