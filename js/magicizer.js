const apiUrl = 'https://api.scryfall.com/cards/search';
const autocompleteUrl = 'https://api.scryfall.com/cards/autocomplete';
const setsUrl = 'https://api.scryfall.com/sets';

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const resultsContainer = document.getElementById('results');
    const setSelectBtn = document.getElementById('set-select-btn');
    const setModal = document.getElementById('set-modal');
    const setList = document.getElementById('set-list');
    const setSearch = document.getElementById('set-search');
    const setModalClose = document.getElementById('set-modal-close');

    let allSets = [];
    let selectedSets = []; // Now an array

    function updateSetChips() {
        setSelectBtn.innerHTML = '';
        if (selectedSets.length === 0) {
            // Render "All Sets" as a non-clickable chip
            const allSetsChip = document.createElement('span');
            allSetsChip.className = 'set-chip all-sets';
            allSetsChip.textContent = 'All Sets';
            setSelectBtn.appendChild(allSetsChip);
        } else {
            selectedSets.forEach(code => {
                const set = allSets.find(s => s.code === code);
                const chip = document.createElement('span');
                chip.className = 'set-chip selected-chip';
                chip.textContent = set ? `${set.name} (${set.code.toUpperCase()})` : code.toUpperCase();
                chip.onclick = (e) => {
                    e.stopPropagation();
                    selectedSets = selectedSets.filter(c => c !== code);
                    updateSetChips();
                };
                setSelectBtn.appendChild(chip);
            });
        }
        // Always add the "+" button
        const addBtn = document.createElement('button');
        addBtn.className = 'add-set-btn';
        addBtn.title = 'Add another set';
        addBtn.innerHTML = '+';
        addBtn.onclick = (e) => {
            e.stopPropagation();
            setModal.style.display = 'flex';
            setSearch.value = '';
            renderSetList('');
            setSearch.focus();
        };
        setSelectBtn.appendChild(addBtn);
    }

    async function populateSets() {
        const res = await fetch(setsUrl);
        const data = await res.json();
        allSets = data.data.filter(set =>
            set.set_type !== 'promo' && set.set_type !== 'token' && set.set_type !== 'memorabilia'
        );
        renderSetList('');
        updateSetChips();
    }
    populateSets();

    function renderSetList(filter) {
        setList.innerHTML = '';
        const filtered = allSets.filter(set =>
            set.name.toLowerCase().includes(filter.toLowerCase()) ||
            set.code.toLowerCase().includes(filter.toLowerCase())
        );
        filtered.forEach(set => {
            const li = document.createElement('li');
            li.textContent = `${set.name} (${set.code.toUpperCase()})`;
            li.onclick = () => {
                if (!selectedSets.includes(set.code)) {
                    selectedSets.push(set.code);
                }
                setModal.style.display = 'none';
                updateSetChips();
            };
            // Highlight if already selected
            if (selectedSets.includes(set.code)) {
                li.classList.add('selected');
                li.setAttribute('aria-selected', 'true');
            }
            setList.appendChild(li);
        });
        // Add "All Sets" option
        if (filter === '' || 'all sets'.includes(filter.toLowerCase())) {
            const li = document.createElement('li');
            li.textContent = 'All Sets';
            li.onclick = () => {
                selectedSets = [];
                setModal.style.display = 'none';
                updateSetChips();
            };
            if (selectedSets.length === 0) {
                li.style.background = '#444';
                li.style.fontWeight = 'bold';
            }
            setList.insertBefore(li, setList.firstChild);
        }
    }

    setSelectBtn.onclick = () => {
        setModal.style.display = 'flex';
        setSearch.value = '';
        renderSetList('');
        setSearch.focus();
    };
    setModalClose.onclick = () => setModal.style.display = 'none';
    setSearch.oninput = () => renderSetList(setSearch.value);
    setModal.onclick = (e) => { if (e.target === setModal) setModal.style.display = 'none'; };

    // Update search logic to use selectedSets
    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) fetchCards(query, selectedSets);
    });
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.stopPropagation(); // Prevent bubbling to other handlers
            searchButton.click();
        }
    });

    async function fetchCards(query, sets) {
        showLoading();
        try {
            let fullQuery = query;
            if (sets && sets.length > 0) {
                fullQuery += ' (';
                fullQuery += sets.map(s => `set:${s}`).join(' OR ');
                fullQuery += ')';
            }
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

    function renderAutocomplete(suggestions) {
        let autocompleteList = document.getElementById('autocomplete-list');
        if (!autocompleteList) {
            autocompleteList = document.createElement('ul');
            autocompleteList.id = 'autocomplete-list'; // Always set the id!
            autocompleteList.className = 'autocomplete-list';
            const searchBox = searchInput.closest('.search-box');
            (searchBox || searchInput.parentNode).appendChild(autocompleteList);
        }
        // Always clear before adding new items
        autocompleteList.innerHTML = '';
        suggestions.forEach(suggestion => {
            const li = document.createElement('li');
            li.textContent = suggestion;
            li.tabIndex = 0;
            li.onclick = () => {
                searchInput.value = suggestion;
                autocompleteList.innerHTML = '';
                autocompleteList.style.display = 'none'; // Hide the box
                searchButton.click();
            };
            li.onkeydown = (e) => {
                if (e.key === 'Enter') {
                    li.click();
                }
            };
            autocompleteList.appendChild(li);
        });
        // Show or hide the list
        autocompleteList.style.display = suggestions.length ? 'block' : 'none';
    }

    // Hide autocomplete when clicking outside
    document.addEventListener('click', (e) => {
        const autocompleteList = document.getElementById('autocomplete-list');
        if (autocompleteList && !autocompleteList.contains(e.target) && e.target !== searchInput) {
            autocompleteList.style.display = 'none';
        }
    });

    searchInput.addEventListener('input', async () => {
        const value = searchInput.value.trim();
        const autocompleteList = document.getElementById('autocomplete-list');
        if (value.length > 1) {
            const res = await fetch(`${autocompleteUrl}?q=${encodeURIComponent(value)}`);
            const data = await res.json();
            renderAutocomplete(data.data);
        } else if (autocompleteList) {
            autocompleteList.style.display = 'none';
        }
    });
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