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
    const setModalApply = document.getElementById('set-modal-apply');

    let allSets = [];
    let selectedSets = []; // Now an array
    let modalSelectedSets = []; // <-- Add this line
    let loading = false; // Add this at the top of your DOMContentLoaded handler

    // Add fullscreen loading overlay to the DOM
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'fullscreen-loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="fullscreen-loading-svg">
            <!-- Spinner SVG -->
            <svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" stroke="#FFFFFFFF" class="svg-spinner">
              <g fill="none" fill-rule="evenodd" stroke-width="2">
                <circle cx="22" cy="22" r="1">
                  <animate attributeName="r" begin="0s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite"/>
                  <animate attributeName="stroke-opacity" begin="0s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite"/>
                </circle>
                <circle cx="22" cy="22" r="1">
                  <animate attributeName="r" begin="-0.9s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite"/>
                  <animate attributeName="stroke-opacity" begin="-0.9s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite"/>
                </circle>
              </g>
            </svg>
        </div>
    `;
    loadingOverlay.style.display = 'none';
    document.body.appendChild(loadingOverlay);

    function updateSetChips() {
        setSelectBtn.innerHTML = '';
        if (loading) {
            setSelectBtn.classList.add('disabled');
        } else {
            setSelectBtn.classList.remove('disabled');
        }
        if (selectedSets.length === 0) {
            // Render "All Sets" as a non-clickable chip
            const allSetsChip = document.createElement('span');
            allSetsChip.className = 'set-chip all-sets';
            allSetsChip.textContent = 'All Sets';
            if (loading) allSetsChip.classList.add('disabled');
            setSelectBtn.appendChild(allSetsChip);
        } else {
            selectedSets.forEach(code => {
                const set = allSets.find(s => s.code === code);
                const chip = document.createElement('span');
                chip.className = 'set-chip selected-chip';
                chip.textContent = set ? `${set.name} (${set.code.toUpperCase()})` : code.toUpperCase();
                if (loading) {
                    chip.classList.add('disabled');
                    chip.onclick = null;
                } else {
                    chip.onclick = (e) => {
                        e.stopPropagation();
                        selectedSets = selectedSets.filter(c => c !== code);
                        updateSetChips();
                        // Always trigger a search when a set is removed
                        searchButton.click();
                    };
                }
                setSelectBtn.appendChild(chip);
            });
        }
        // Always add the "+" button
        const addBtn = document.createElement('button');
        addBtn.className = 'add-set-btn';
        addBtn.title = 'Add another set';
        addBtn.innerHTML = '+';
        if (loading) {
            addBtn.disabled = true;
            addBtn.classList.add('disabled');
            addBtn.onclick = null;
        } else {
            addBtn.disabled = false;
            addBtn.classList.remove('disabled');
            addBtn.onclick = (e) => {
                e.stopPropagation();
                // When opening modal, copy selectedSets to modalSelectedSets
                modalSelectedSets = [...selectedSets];
                setModal.style.display = 'flex';
                setSearch.value = '';
                renderSetList('');
                setSearch.focus();
            };
        }
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
                if (modalSelectedSets.includes(set.code)) {
                    modalSelectedSets = modalSelectedSets.filter(c => c !== set.code);
                } else {
                    modalSelectedSets.push(set.code);
                }
                renderSetList(filter); // Re-render to update highlights
            };
            if (modalSelectedSets.includes(set.code)) {
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
                modalSelectedSets = [];
                renderSetList(filter);
            };
            if (modalSelectedSets.length === 0) {
                li.style.background = '#444';
                li.style.fontWeight = 'bold';
            }
            setList.insertBefore(li, setList.firstChild);
        }
    }

    setSelectBtn.onclick = () => {
        // When opening modal, copy selectedSets to modalSelectedSets
        modalSelectedSets = [...selectedSets];
        setModal.style.display = 'flex';
        setSearch.value = '';
        renderSetList('');
        setSearch.focus();
    };
    setModalClose.onclick = () => {
        setModal.style.display = 'none';
        // Only update selectedSets when closing
        selectedSets = [...modalSelectedSets];
        updateSetChips();
        // Always trigger a search when closing (acts as Apply)
        searchButton.click();
    };
    setSearch.oninput = () => renderSetList(setSearch.value);
    setModal.onclick = (e) => { if (e.target === setModal) setModal.style.display = 'none'; };

    // Update search logic to use selectedSets
    searchButton.addEventListener('click', () => {
        let query = searchInput.value.trim();
        if (!query) {
            query = '*'; // Use asterisk if input is empty
        }
        fetchCards(query, selectedSets);
    });
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.stopPropagation(); // Prevent bubbling to other handlers
            searchButton.click();
        }
    });

    function showInlineSpinner() {
        const spinner = document.querySelector('.loading-spinner');
        if (spinner) spinner.style.display = 'flex';
    }

    function hideInlineSpinner() {
        const spinner = document.querySelector('.loading-spinner');
        if (spinner) spinner.style.display = 'none';
    }

    async function fetchCards(query, sets) {
        loading = true;
        updateSetChips();
        // Show fullscreen loading overlay
        document.getElementById('fullscreen-loading-overlay').style.display = 'flex';
        showLoading();
        // Show busy cursor
        document.body.classList.add('loading');
        document.getElementById('fullscreen-loading-overlay').classList.add('loading');
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
        } finally {
            loading = false;
            updateSetChips();
            // Hide fullscreen loading overlay
            document.getElementById('fullscreen-loading-overlay').style.display = 'none';
            // Hide busy cursor
            document.body.classList.remove('loading');
            document.getElementById('fullscreen-loading-overlay').classList.remove('loading');
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

                // --- Add price and year ---
                const price = card.prices && card.prices.usd ? `$${parseFloat(card.prices.usd).toFixed(2)}` : 'N/A';
                const year = card.released_at ? new Date(card.released_at).getFullYear() : '';

                cardElement.innerHTML = `
                    <div class="card-image-wrapper">
                        <div class="card-image-spinner">
                          <svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" stroke="#FFFFFFFF" class="svg-spinner">
                            <g fill="none" fill-rule="evenodd" stroke-width="2">
                              <circle cx="22" cy="22" r="1">
                                <animate attributeName="r" begin="0s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite"/>
                                <animate attributeName="stroke-opacity" begin="0s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite"/>
                              </circle>
                              <circle cx="22" cy="22" r="1">
                                <animate attributeName="r" begin="-0.9s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite"/>
                                <animate attributeName="stroke-opacity" begin="-0.9s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite"/>
                              </circle>
                            </g>
                          </svg>
                        </div>
                        <img src="${imgUrl}" alt="${card.name}" style="display:none;" onload="this.style.display='block';this.previousElementSibling.style.display='none';" onerror="this.style.display='block';this.previousElementSibling.style.display='none';this.src='${placeholderImg}';">
                    </div>
                    <div class="card-info">
                        <div class="card-set">
                            ${card.set_name ? card.set_name : ''}${card.set ? ` (${card.set.toUpperCase()})` : ''}
                            ${year ? `<span class="card-year"> • ${year}</span>` : ''}
                        </div>
                        <div class="card-rarity ${card.rarity ? card.rarity : ''}">
                            ${card.rarity ? card.rarity : ''}
                        </div>
                        <h3>${card.name}</h3>
                        <div class="mana-cost">${manaCostIcons}</div>
                        <div class="card-type"><strong>${card.type_line || ''}</strong></div>
                        <div class="card-text">${renderManaCost(card.oracle_text || '')}</div>
                        <span class="card-price">${price}</span>
                    </div>
                `;
                resultsContainer.appendChild(cardElement);

                // Only add the click event to the card image
                const cardImg = cardElement.querySelector('.card-image-wrapper img');
                if (cardImg) {
                    cardImg.addEventListener('click', (event) => {
                        event.stopPropagation(); // Prevent bubbling to cardElement
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
                                        ${year ? `<span class="card-year"> • ${year}</span>` : ''}
                                    </div>
                                    <div class="card-rarity ${card.rarity ? card.rarity : ''}">
                                        ${card.rarity ? card.rarity : ''}
                                    </div>
                                    <h3>${card.name}</h3>
                                    <div class="mana-cost">${renderManaCost(card.mana_cost)}</div>
                                    <div class="card-type"><strong>${card.type_line || ''}</strong></div>
                                    <div class="card-text">${card.oracle_text || ''}</div>
                                    <div class="card-price">Price: <strong>${price}</strong></div>
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
                }
            });
        } else {
            resultsContainer.innerHTML = '<p>No cards found.</p>';
        }
    }

    function truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength - 3) + '...';
    }

    async function renderAutocomplete(suggestions) {
        let autocompleteList = document.getElementById('autocomplete-list');
        if (!autocompleteList) {
            autocompleteList = document.createElement('ul');
            autocompleteList.id = 'autocomplete-list';
            autocompleteList.className = 'autocomplete-list';
            autocompleteList.setAttribute('role', 'listbox');
            const searchBox = searchInput.closest('.search-box');
            (searchBox || searchInput.parentNode).appendChild(autocompleteList);
        }
        autocompleteList.innerHTML = '';
        autocompleteList.style.display = suggestions.length ? 'block' : 'none';

        // Limit to first 10 suggestions for performance
        const visibleSuggestions = suggestions.slice(0, 10);

        // Fetch set names in parallel
        const cardData = await Promise.all(
            visibleSuggestions.map(async (name) => {
                try {
                    const res = await fetch(`https://api.scryfall.com/cards/named?exact=${encodeURIComponent(name)}`);
                    if (!res.ok) throw new Error();
                    const card = await res.json();
                    return { name, set_name: card.set_name || '' };
                } catch {
                    return { name, set_name: '' };
                }
            })
        );

        cardData.forEach(({ name, set_name }, idx) => {
            const li = document.createElement('li');
            // Truncate name if too long
            const truncatedName = truncateText(name, 28);
            const truncatedSet = set_name ? truncateText(set_name, 32) : '';
            li.innerHTML = `${truncatedName}${truncatedSet ? ` <span class="autocomplete-set">${truncatedSet}</span>` : ''}`;
            li.tabIndex = -1;
            li.setAttribute('role', 'option');
            li.setAttribute('id', `autocomplete-item-${idx}`);
            li.dataset.name = name; // <-- Add this line
            li.onclick = () => {
                searchInput.value = name;
                autocompleteList.innerHTML = '';
                autocompleteList.style.display = 'none';
                searchButton.click();
            };
            autocompleteList.appendChild(li);
        });

        // Keyboard navigation state
        autocompleteList.selectedIndex = -1;
    }

    let lastTypedValue = ""; // Track what the user last typed

    searchInput.addEventListener('input', async () => {
        lastTypedValue = searchInput.value;
        const value = searchInput.value.trim();
        if (value.length > 1) {
            try {
                // Fetch autocomplete suggestions
                const res = await fetch(`${autocompleteUrl}?q=${encodeURIComponent(value)}`);
                const data = await res.json();
                let suggestions = data.data || [];
                renderAutocomplete(suggestions);
            } catch {
                renderAutocomplete([]);
            }
        } else {
            closeAutocomplete();
        }
    });

    function closeAutocomplete() {
        const autocompleteList = document.getElementById('autocomplete-list');
        if (autocompleteList) {
            autocompleteList.style.display = 'none';
            autocompleteList.innerHTML = '';
            autocompleteList.selectedIndex = -1;
        }
    }

    // Keyboard navigation for autocomplete
    searchInput.addEventListener('keydown', (e) => {
        const autocompleteList = document.getElementById('autocomplete-list');
        if (!autocompleteList || autocompleteList.style.display !== 'block') {
            // Only trigger search if autocomplete is closed and Enter is pressed
            if (e.key === 'Enter') {
                e.preventDefault();
                searchButton.click();
            }
            return;
        }

        const items = Array.from(autocompleteList.querySelectorAll('li'));
        if (!items.length) return;

        // Prevent page scroll with arrow keys
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
        }

        if (e.key === 'ArrowDown') {
            autocompleteList.selectedIndex = (autocompleteList.selectedIndex ?? -1) + 1;
            if (autocompleteList.selectedIndex >= items.length) autocompleteList.selectedIndex = 0;
            items.forEach((li, idx) => {
                li.classList.toggle('focused', idx === autocompleteList.selectedIndex);
                if (idx === autocompleteList.selectedIndex) {
                    li.scrollIntoView({ block: 'nearest' });
                }
            });
        } else if (e.key === 'ArrowUp') {
            autocompleteList.selectedIndex = (autocompleteList.selectedIndex ?? items.length) - 1;
            if (autocompleteList.selectedIndex < 0) autocompleteList.selectedIndex = items.length - 1;
            items.forEach((li, idx) => {
                li.classList.toggle('focused', idx === autocompleteList.selectedIndex);
                if (idx === autocompleteList.selectedIndex) {
                    li.scrollIntoView({ block: 'nearest' });
                }
            });
        } else if (e.key === 'Enter') {
            // Only select if selectedIndex is set by keyboard navigation
            if (
                typeof autocompleteList.selectedIndex === 'number' &&
                autocompleteList.selectedIndex >= 0 &&
                autocompleteList.selectedIndex < items.length
            ) {
                e.preventDefault();
                const selectedName = items[autocompleteList.selectedIndex].dataset.name; // <-- Use dataset.name
                searchInput.value = selectedName;
                lastTypedValue = selectedName;
                closeAutocomplete();
                // Use exact match query
                fetchCards(`!"${selectedName}"`, selectedSets);
            } else {
                // No item highlighted, just search for what's typed
                e.preventDefault();
                closeAutocomplete();
                searchButton.click();
            }
        } else if (e.key === 'Escape') {
            closeAutocomplete();
        }
    });

    // Mouse hover should highlight, but not change input value until clicked
    document.addEventListener('mouseover', (e) => {
        const autocompleteList = document.getElementById('autocomplete-list');
        if (!autocompleteList) return;
        const items = Array.from(autocompleteList.querySelectorAll('li'));
        items.forEach((li, idx) => {
            if (li === e.target) {
                // Only add .focused for styling, do NOT update selectedIndex
                li.classList.add('focused');
            } else {
                li.classList.remove('focused');
            }
        });
    });

    // Mouse click on suggestion
    document.addEventListener('mousedown', (e) => {
        const autocompleteList = document.getElementById('autocomplete-list');
        if (!autocompleteList) return;
        const items = Array.from(autocompleteList.querySelectorAll('li'));
        const idx = items.indexOf(e.target);
        if (idx !== -1) {
            e.preventDefault();
            const selectedName = items[idx].dataset.name;
            searchInput.value = selectedName;
            lastTypedValue = selectedName;
            closeAutocomplete();
            // Use exact match query
            fetchCards(`!"${selectedName}"`, selectedSets);
        }
    });

    // Close autocomplete when clicking outside of search input or autocomplete list
    document.addEventListener('mousedown', (e) => {
        const autocompleteList = document.getElementById('autocomplete-list');
        if (!autocompleteList || autocompleteList.style.display !== 'block') return;
        if (
            !autocompleteList.contains(e.target) &&
            e.target !== searchInput
        ) {
            closeAutocomplete();
        }
    });

    setModalApply.onclick = () => {
        setModal.style.display = 'none';
        // Only update selectedSets when applying
        selectedSets = [...modalSelectedSets];
        updateSetChips();
        // Trigger a search if there's a query
        if (searchInput.value.trim()) {
            searchButton.click();
        }
    };
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