import os
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from tarot_deck import TarotDeck

app = Flask(__name__)

# CORS Configuration - Update with your GitHub username
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "http://localhost:5000",
            "https://mascarponelove.github.io",
            "https://sbtatrot-backend.onrender.com"
        ]
    }
})

# Initialize deck
deck = TarotDeck(assets_path="assets")

@app.route('/')
def index():
    """Serve the HTML dashboard."""
    return send_from_directory('frontend', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    """Serve static files (CSS, JS)."""
    return send_from_directory('frontend', path)

@app.route('/assets/<path:path>')
def serve_assets(path):
    """Serve image and meaning files."""
    return send_from_directory('assets', path)

@app.route('/api/shuffle', methods=['POST'])
def shuffle():
    """Shuffle the deck using Fisher-Yates algorithm."""
    result = deck.shuffle()
    return jsonify(result)

@app.route('/api/draw', methods=['POST'])
def draw():
    """Draw a card with contextual interpretation."""
    data = request.json
    context = data.get('context', 'Soul')
    
    card = deck.draw_card()
    if not card:
        return jsonify({"error": "Deck is empty. Please shuffle to reset."}), 400
    
    # Extract meaning based on context
    meaning = deck.extract_meaning(card, context)
    
    # Get additional card data (Yes/No, +/-, etc.)
    card_metadata = deck.get_all_card_data(card)
    
    response = {
        "card": card,
        "meaning": meaning,
        "context": context,
        "cards_remaining": len(deck.current_deck),
        "metadata": card_metadata  # Includes Yes/No, +/-, Card Name, etc.
    }
    
    return jsonify(response)

@app.route('/api/reset', methods=['POST'])
def reset():
    """Reset the deck to full 78 cards."""
    result = deck.reset()
    return jsonify(result)

@app.route('/api/status', methods=['GET'])
def status():
    """Get current deck status."""
    return jsonify({
        "cards_remaining": len(deck.current_deck),
        "total_cards": len(deck.deck),
        "status": "operational"
    })

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint for monitoring."""
    return jsonify({
        "status": "healthy",
        "service": "SBTATROT Backend",
        "version": "1.0.0"
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
