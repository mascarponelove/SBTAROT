// Configuration - Backend serves assets from root
const API_URL = 'https://sbtatrot-backend.onrender.com/api';

// DOM Elements
const shuffleBtn = document.getElementById('shuffleBtn');
const drawBtn = document.getElementById('drawBtn');
const resetBtn = document.getElementById('resetBtn');
const contextSelect = document.getElementById('context');
const statusDiv = document.getElementById('status');
const cardDisplay = document.getElementById('cardDisplay');
const cardName = document.getElementById('cardName');
const cardImage = document.getElementById('cardImage');
const cardMeaning = document.getElementById('cardMeaning');
const cardMetadata = document.getElementById('cardMetadata');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    statusDiv.textContent = '👋 Welcome! Click "Shuffle Deck" to begin your reading.';
});

// Shuffle deck
shuffleBtn.addEventListener('click', async () => {
    try {
        shuffleBtn.disabled = true;
        shuffleBtn.innerHTML = '🔄 Shuffling...';
        statusDiv.textContent = '🔄 Shuffling deck...';
        
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
        statusDiv.textContent = `✅ Deck shuffled! ${data.cards_remaining} cards ready for reading.`;
        cardDisplay.classList.add('hidden');
        
    } catch (error) {
        statusDiv.textContent = `❌ Error: ${error.message}. Backend may be sleeping (first load takes 30 sec).`;
        console.error('Shuffle error:', error);
    } finally {
        shuffleBtn.disabled = false;
        shuffleBtn.innerHTML = '🎴 Shuffle Deck';
    }
});

// Draw card
drawBtn.addEventListener('click', async () => {
    try {
        const context = contextSelect.value;
        
        drawBtn.disabled = true;
        drawBtn.innerHTML = '⏳ Drawing...';
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
        
        // Display card name
        cardName.textContent = data.card.display_name;
        
        // Display card image - Load from backend
        cardImage.src = `https://sbtatrot-backend.onrender.com/${data.card.image_path}`;
        cardImage.alt = data.card.display_name;
        
        // Display metadata
        displayMetadata(data.metadata);
        
        // Display meaning
        cardMeaning.innerHTML = `
            <strong>📖 ${data.context} Reading</strong>
            <p>${data.meaning}</p>
        `;
        
        cardDisplay.classList.remove('hidden');
        statusDiv.textContent = `🎴 ${data.cards_remaining} cards remaining in deck.`;
        
        cardDisplay.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
    } catch (error) {
        statusDiv.textContent = `❌ Error: ${error.message}. Make sure the backend server is running.`;
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
        statusDiv.textContent = '🔄 Resetting deck...';
        
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
        statusDiv.textContent = `🔄 Deck reset! ${data.cards_remaining} cards available.`;
        cardDisplay.classList.add('hidden');
        
    } catch (error) {
        statusDiv.textContent = `❌ Error: ${error.message}. Make sure the backend server is running.`;
        console.error('Reset error:', error);
    } finally {
        resetBtn.disabled = false;
        resetBtn.innerHTML = '🔄 Reset';
    }
});

// Display metadata function
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

// Handle image loading errors
cardImage.addEventListener('error', () => {
    cardImage.alt = '⚠️ Image not found. Please check backend server.';
    cardImage.style.border = '2px dashed #ccc';
    cardImage.style.padding = '20px';
    cardImage.style.minHeight = '300px';
});

// Check backend status on load
async function checkBackendStatus() {
    try {
        const response = await fetch(`${API_URL}/status`);
        if (response.ok) {
            console.log('✅ Backend connected successfully');
        }
    } catch (error) {
        console.warn('⚠️ Backend not responding (may be sleeping):', error);
        statusDiv.textContent = '⚠️ Backend starting up... First load takes ~30 seconds on free tier.';
    }
}

checkBackendStatus();
