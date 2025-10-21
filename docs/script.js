// Configuration
const API_URL = 'https://sbtatrot-backend.onrender.com/api';

// DOM Elements
const shuffleBtn = document.getElementById('shuffleBtn');
const drawBtn = document.getElementById('drawBtn');
const resetBtn = document.getElementById('resetBtn');
const contextSelect = document.getElementById('context');
const statusDiv = document.getElementById('status');
const shuffleAnimation = document.getElementById('shuffleAnimation');
const cardDisplay = document.getElementById('cardDisplay');
const cardName = document.getElementById('cardName');
const cardImage = document.getElementById('cardImage');
const cardMeaning = document.getElementById('cardMeaning');
const cardMetadata = document.getElementById('cardMetadata');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    statusDiv.textContent = '🌙 Welcome to the mystical realm. Click "Shuffle Deck" to begin your journey...';
    checkBackendStatus();
});

// Shuffle deck with animation
shuffleBtn.addEventListener('click', async () => {
    try {
        shuffleBtn.disabled = true;
        shuffleBtn.innerHTML = '🔄 Shuffling...';
        
        // Show shuffle animation
        shuffleAnimation.classList.add('active');
        cardDisplay.classList.add('hidden');
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

// Draw single card
drawBtn.addEventListener('click', async () => {
    try {
        const context = contextSelect.value;
        
        drawBtn.disabled = true;
        drawBtn.innerHTML = '⏳ Revealing...';
        
        // Hide card display first
        cardDisplay.classList.add('hidden');
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
        console.log('Drew card:', data.card.display_name, `- ${data.cards_remaining} cards remaining`);
        
        // Display the card
        displayCard(data);
        
        cardDisplay.classList.remove('hidden');
        statusDiv.textContent = `🔮 Your card is revealed. ${data.cards_remaining} cards remain in the deck.`;
        
        // Smooth scroll to card
        setTimeout(() => {
            cardDisplay.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
        
    } catch (error) {
        statusDiv.textContent = `❌ The veil cannot be lifted: ${error.message}`;
        console.error('Draw error:', error);
    } finally {
        drawBtn.disabled = false;
        drawBtn.innerHTML = '✨ Draw Card';
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
        cardDisplay.classList.add('hidden');
        
    } catch (error) {
        statusDiv.textContent = `❌ Error in the cosmic flow: ${error.message}`;
        console.error('Reset error:', error);
    } finally {
        resetBtn.disabled = false;
        resetBtn.innerHTML = '🔄 Reset Deck';
    }
});

// Display a card
function displayCard(data) {
    if (!data || !data.card) {
        console.error('No card data received');
        return;
    }
    
    // Display card name
    cardName.textContent = data.card.display_name;
    
    // Display card image
    cardImage.src = `https://sbtatrot-backend.onrender.com/${data.card.image_path}`;
    cardImage.alt = data.card.display_name;
    
    // Display metadata (Yes/No, +/-)
    displayMetadata(data.metadata);
    
    // Display meaning
    cardMeaning.innerHTML = `
        <strong>📖 ${data.context} Reading</strong>
        <p>${data.meaning}</p>
    `;
    
    // Handle image loading errors
    cardImage.onerror = () => {
        cardImage.alt = '⚠️ Image not found';
        cardImage.style.border = '2px dashed #d4af37';
    };
}

// Display metadata (Yes/No, +/-)
function displayMetadata(metadata) {
    if (!metadata || Object.keys(metadata).length === 0) {
        cardMetadata.innerHTML = '';
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
    
    cardMetadata.innerHTML = metadataHTML;
}

// Check backend status on load
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
