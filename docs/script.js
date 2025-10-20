// Configuration
const API_URL = 'https://sbtatrot-backend.onrender.com/api';

// DOM Elements
const shuffleBtn = document.getElementById('shuffleBtn');
const drawBtn = document.getElementById('drawBtn');
const resetBtn = document.getElementById('resetBtn');
const contextSelect = document.getElementById('context');
const statusDiv = document.getElementById('status');
const shuffleAnimation = document.getElementById('shuffleAnimation');
const singleCardDisplay = document.getElementById('singleCardDisplay');
const threeCardDisplay = document.getElementById('threeCardDisplay');

// Radio buttons
const singleCardRadio = document.getElementById('singleCard');
const threeCardRadio = document.getElementById('threeCard');

// Single card elements
const singleElements = {
    name: document.getElementById('singleName'),
    image: document.getElementById('singleImage'),
    meaning: document.getElementById('singleMeaning'),
    metadata: document.getElementById('singleMetadata')
};

// Card elements for 3-card spread
const pastElements = {
    name: document.getElementById('pastName'),
    image: document.getElementById('pastImage'),
    meaning: document.getElementById('pastMeaning'),
    metadata: document.getElementById('pastMetadata')
};

const presentElements = {
    name: document.getElementById('presentName'),
    image: document.getElementById('presentImage'),
    meaning: document.getElementById('presentMeaning'),
    metadata: document.getElementById('presentMetadata')
};

const futureElements = {
    name: document.getElementById('futureName'),
    image: document.getElementById('futureImage'),
    meaning: document.getElementById('futureMeaning'),
    metadata: document.getElementById('futureMetadata')
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    statusDiv.textContent = '🌙 Welcome to the mystical realm. Click "Shuffle Deck" to begin your journey...';
    checkBackendStatus();
    updateDrawButtonText();
});

// Update button text based on spread type selection
function updateDrawButtonText() {
    const isSingleCard = singleCardRadio.checked;
    drawBtn.innerHTML = isSingleCard ? '✨ Draw Card' : '✨ Draw Spread';
}

// Add event listeners to radio buttons
singleCardRadio.addEventListener('change', updateDrawButtonText);
threeCardRadio.addEventListener('change', updateDrawButtonText);

// Shuffle deck with animation
shuffleBtn.addEventListener('click', async () => {
    try {
        shuffleBtn.disabled = true;
        shuffleBtn.innerHTML = '🔄 Shuffling...';
        
        // Show shuffle animation
        shuffleAnimation.classList.add('active');
        singleCardDisplay.classList.add('hidden');
        threeCardDisplay.classList.add('hidden');
        statusDiv.textContent = '🌀 Shuffling the cosmic deck...';
        
        const response = await fetch(`${API_URL}/shuffle`, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Keep animation visible for 2 seconds
        setTimeout(() => {
            shuffleAnimation.classList.remove('active');
            statusDiv.textContent = `✨ The cards are ready. ${data.cards_remaining} cards await your question...`;
        }, 2000);
        
    } catch (error) {
        shuffleAnimation.classList.remove('active');
        statusDiv.textContent = `❌ The cosmic forces are misaligned: ${error.message}`;
        console.error('Shuffle error:', error);
    } finally {
        setTimeout(() => {
            shuffleBtn.disabled = false;
            shuffleBtn.innerHTML = '🎴 Shuffle Deck';
        }, 2000);
    }
});

// Draw cards (1 or 3 based on selection)
drawBtn.addEventListener('click', async () => {
    try {
        const context = contextSelect.value;
        const isSingleCard = singleCardRadio.checked;
        
        drawBtn.disabled = true;
        drawBtn.innerHTML = '⏳ Revealing...';
        
        // Hide both displays first
        singleCardDisplay.classList.add('hidden');
        threeCardDisplay.classList.add('hidden');
        
        if (isSingleCard) {
            // Draw single card
            statusDiv.textContent = '✨ Drawing your card...';
            
            const response = await fetch(`${API_URL}/draw`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({ context })
            });
            
            if (!response.ok) {
                const error = await response.json();
                statusDiv.textContent = `❌ ${error.error}`;
                return;
            }
            
            const data = await response.json();
            
            // Display single card
            displayCard(data, singleElements, 'Your Card');
            singleCardDisplay.classList.remove('hidden');
            statusDiv.textContent = `🔮 Your card is revealed. ${data.cards_remaining} cards remain in the deck.`;
            
            // Smooth scroll
            setTimeout(() => {
                singleCardDisplay.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
            
        } else {
            // Draw 3-card spread with better error handling
            statusDiv.textContent = '✨ Drawing your Past, Present, and Future...';
            
            const cards = [];
            const positions = ['Past', 'Present', 'Future'];
            
            // Draw 3 cards sequentially with individual error handling
            for (let i = 0; i < 3; i++) {
                try {
                    const response = await fetch(`${API_URL}/draw`, {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json' 
                        },
                        body: JSON.stringify({ context })
                    });
                    
                    if (!response.ok) {
                        const error = await response.json();
                        throw new Error(`${error.error || 'Failed to draw card'}`);
                    }
                    
                    const data = await response.json();
                    console.log(`Drew ${positions[i]} card:`, data.card.display_name, `- ${data.cards_remaining} cards left`);
                    cards.push(data);
                    
                } catch (drawError) {
                    statusDiv.textContent = `❌ Error drawing ${positions[i]} card: ${drawError.message}`;
                    console.error(`Error drawing card ${i + 1}:`, drawError);
                    return; // Stop drawing if any card fails
                }
            }
            
            // Verify we got exactly 3 cards
            if (cards.length !== 3) {
                statusDiv.textContent = `❌ Error: Only drew ${cards.length} cards instead of 3. Please try again.`;
                return;
            }
            
            // Display the 3-card spread
            displayCard(cards[0], pastElements, 'Past');
            displayCard(cards[1], presentElements, 'Present');
            displayCard(cards[2], futureElements, 'Future');
            
            threeCardDisplay.classList.remove('hidden');
            
            // Show final card count from the last draw
            const finalCardCount = cards[2].cards_remaining;
            statusDiv.textContent = `🔮 Your spread is revealed. ${finalCardCount} cards remain in the deck.`;
            
            // Verification log
            console.log('Spread complete:', {
                drewCards: 3,
                expectedRemaining: 75,
                actualRemaining: finalCardCount,
                cardsMatch: finalCardCount === 75
            });
            
            // Smooth scroll
            setTimeout(() => {
                threeCardDisplay.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        }
        
    } catch (error) {
        statusDiv.textContent = `❌ The veil cannot be lifted: ${error.message}`;
        console.error('Draw error:', error);
    } finally {
        drawBtn.disabled = false;
        updateDrawButtonText();
    }
});

// Reset deck
resetBtn.addEventListener('click', async () => {
    try {
        resetBtn.disabled = true;
        resetBtn.innerHTML = '⏳ Resetting...';
        statusDiv.textContent = '🔄 Returning the cards to the cosmic deck...';
        
        const response = await fetch(`${API_URL}/reset`, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        statusDiv.textContent = `🌟 The deck is whole again. ${data.cards_remaining} cards ready for guidance.`;
        singleCardDisplay.classList.add('hidden');
        threeCardDisplay.classList.add('hidden');
        
    } catch (error) {
        statusDiv.textContent = `❌ Error in the cosmic flow: ${error.message}`;
        console.error('Reset error:', error);
    } finally {
        resetBtn.disabled = false;
        resetBtn.innerHTML = '🔄 Reset Deck';
    }
});

// Display a single card
function displayCard(data, elements, position) {
    // Verify data exists
    if (!data || !data.card) {
        console.error(`No data for ${position} card`);
        return;
    }
    
    // Display card name
    elements.name.textContent = data.card.display_name;
    
    // Display card image
    elements.image.src = `https://sbtatrot-backend.onrender.com/${data.card.image_path}`;
    elements.image.alt = data.card.display_name;
    
    // Display metadata
    displayMetadata(data.metadata, elements.metadata);
    
    // Display meaning
    elements.meaning.innerHTML = `
        <strong>📖 ${data.context} Reading</strong>
        <p>${data.meaning}</p>
    `;
    
    // Handle image loading errors
    elements.image.onerror = () => {
        elements.image.alt = '⚠️ Image not found';
        elements.image.style.border = '2px dashed #d4af37';
    };
}

// Display metadata (Yes/No, +/-)
function displayMetadata(metadata, metadataElement) {
    if (!metadata || Object.keys(metadata).length === 0) {
        metadataElement.innerHTML = '';
        return;
    }
    
    let metadataHTML = '';
    
    if (metadata['Yes/No']) {
        metadataHTML += `
            <div class="metadata-item">
                <div class="metadata-label">Yes/No</div>
                <div class="metadata-value">${metadata['Yes/No']}</div>
            </div>
        `;
    }
    
    if (metadata['+/-']) {
        metadataHTML += `
            <div class="metadata-item">
                <div class="metadata-label">Energy</div>
                <div class="metadata-value">${metadata['+/-']}</div>
            </div>
        `;
    }
    
    metadataElement.innerHTML = metadataHTML;
}

// Check backend status
async function checkBackendStatus() {
    try {
        const response = await fetch(`${API_URL}/status`);
        if (response.ok) {
            console.log('✨ Connected to the cosmic realm');
        }
    } catch (error) {
        console.warn('⚠️ The cosmic connection is weak:', error);
        statusDiv.textContent = '⚠️ Awakening the cosmic forces... (First load takes ~30 seconds)';
    }
}
