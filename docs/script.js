// Configuration - UPDATE THIS with your Render backend URL
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
        // Disable button and show loading
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
        statusDiv.textContent = `❌ Error: ${error.message}. Make sure the backend server is running.`;
        console.error('Shuffle error:', error);
    } finally {
        // Re-enable button
        shuffleBtn.disabled = false;
        shuffleBtn.innerHTML = '🎴 Shuffle Deck';
    }
});

// Draw card
drawBtn.addEventListener('click', async () => {
    try {
        const context = contextSelect.value;
        
        // Disable button and show loading
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
        
        // Display card image
        cardImage.src = `/${data.card.image_path}`;
        cardImage.alt = data.card.display_name;
        
        // Display metadata (Yes/No, +/-)
        displayMetadata(data.metadata);
        
        // Display meaning
        cardMeaning.innerHTML = `
            <strong>📖 ${data.context} Reading</strong>
            <p>${data.meaning}</p>
        `;
        
        // Show card display
        cardDisplay.classList.remove('hidden');
        statusDiv.textContent = `🎴 ${data.cards_remaining} cards remaining in deck.`;
        
        // Scroll to card
        cardDisplay.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
    } catch (error) {
        statusDiv.textContent = `❌ Error: ${error.message}. Make sure the backend server is running.`;
        console.error('Draw error:', error);
    } finally {
        // Re-enable button
        drawBtn.disabled = false;
        drawBtn.innerHTML = '✨ Draw Card';
    }
});

// Reset deck
resetBtn.addEventListener('click', async () => {
    try {
        // Disable button and show loading
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
        // Re-enable button
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
    
    // Display Yes/No and +/- if available
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
    cardImage.alt = '⚠️ Image not found. Please add card images to assets/images/';
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
        console.warn('⚠️ Backend not responding:', error);
        statusDiv.textContent = '⚠️ Backend server not responding. Please wait or refresh the page.';
    }
}

// Check status when page loads
checkBackendStatus();
