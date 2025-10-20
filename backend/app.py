import os
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from tarot_deck import TarotDeck

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": ["*"]  # Update with your frontend URL in production
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
    """Serve image files."""
    return send_from_directory('assets', path)

@app.route('/api/shuffle', methods=['POST'])
def shuffle():
    """Shuffle the deck."""
    result = deck.shuffle()
    return jsonify(result)

@app.route('/api/draw', methods=['POST'])
def draw():
    """Draw a card with context."""
    data = request.json
    context = data.get('context', 'General')
    
    card = deck.draw_card()
    if not card:
        return jsonify({"error": "Deck is empty. Please shuffle to reset."}), 400
    
    # Extract meaning based on context
    meaning = deck.extract_meaning(card, context)
    
    response = {
        "card": card,
        "meaning": meaning,
        "context": context,
        "cards_remaining": len(deck.current_deck)
    }
    
    return jsonify(response)

@app.route('/api/reset', methods=['POST'])
def reset():
    """Reset the deck."""
    result = deck.reset()
    return jsonify(result)

@app.route('/api/status', methods=['GET'])
def status():
    """Get current deck status."""
    return jsonify({
        "cards_remaining": len(deck.current_deck),
        "total_cards": len(deck.deck)
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
