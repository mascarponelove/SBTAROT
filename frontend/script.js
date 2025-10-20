// Configuration
const API_URL = 'http://localhost:5000/api';

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

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    statusDiv.textContent = '👋 Welcome! Click "Shuffle Deck" to begin your reading.';
});

// Shuffle deck
shuffleBtn.addEventListener('click', async () => {
    try {
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
    }
});

// Draw card
drawBtn.addEventListener('click', async () => {
    try {
        const context = contextSelect.value;
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
        
        // Display card
        cardName.textContent = data.card.display_name;
        cardImage.src = `/${data.card.image_path}`;
        cardImage.alt = data.card.display_name;
        
        cardMeaning.innerHTML = `
            <strong>📖 ${data.context} Reading</strong>
            <p>${data.meaning}</p>
        `;
        
        cardDisplay.classList.remove('hidden');
        statusDiv.textContent = `🎴 ${data.cards_remaining} cards remaining in deck.`;
        
        // Scroll to card
        cardDisplay.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
    } catch (error) {
        statusDiv.textContent = `❌ Error: ${error.message}. Make sure the backend server is running.`;
        console.error('Draw error:', error);
    }
});

// Reset deck
resetBtn.addEventListener('click', async () => {
    try {
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
    }
});

// Handle image loading errors
cardImage.addEventListener('error', () => {
    cardImage.alt = '⚠️ Image not found. Please add card images to assets/images/';
    cardImage.style.border = '2px dashed #ccc';
});
