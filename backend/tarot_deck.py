import random
from pathlib import Path
from docx import Document

class TarotDeck:
    """
    Enhanced Tarot Deck with file system integration.
    Handles images and contextual meanings from Word documents.
    """
    
    def __init__(self, assets_path="assets"):
        self.assets_path = Path(assets_path)
        
        # Major Arcana card names (standardized)
        self.major_names = [
            "FOOL", "MAGICIAN", "HIGH_PRIESTESS", "EMPRESS", 
            "EMPEROR", "HIEROPHANT", "LOVERS", "CHARIOT", 
            "STRENGTH", "HERMIT", "WHEEL_OF_FORTUNE", "JUSTICE", 
            "HANGED_MAN", "DEATH", "TEMPERANCE", "DEVIL", 
            "TOWER", "STAR", "MOON", "SUN", "JUDGEMENT", "WORLD"
        ]
        
        # Minor Arcana parameters
        self.suits = ["cups", "pentacles", "swords", "wands"]
        self.ranks = ["ACE", "TWO", "THREE", "FOUR", "FIVE", "SIX", 
                      "SEVEN", "EIGHT", "NINE", "TEN", "PAGE", 
                      "KNIGHT", "QUEEN", "KING"]
        
        # Build full deck structure
        self.deck = self._build_deck()
        self.current_deck = self.deck.copy()
    
    def _build_deck(self):
        """Construct deck with file path references."""
        deck = []
        
        # Add Major Arcana
        for card_name in self.major_names:
            deck.append({
                "type": "major",
                "name": card_name,
                "display_name": card_name.replace("_", " ").title(),
                "image_path": f"assets/images/major/{card_name}.png",
                "meaning_path": f"assets/meanings/major/{card_name}.docx"
            })
        
        # Add Minor Arcana
        for suit in self.suits:
            for rank in self.ranks:
                deck.append({
                    "type": "minor",
                    "suit": suit,
                    "rank": rank,
                    "name": f"{rank}_OF_{suit.upper()}",
                    "display_name": f"{rank.title()} of {suit.title()}",
                    "image_path": f"assets/images/minor/{suit}/{rank}.png",
                    "meaning_path": f"assets/meanings/minor/{suit}/{rank}.docx"
                })
        
        return deck
    
    def shuffle(self):
        """Fisher-Yates shuffle implementation."""
        self.current_deck = self.deck.copy()
        random.shuffle(self.current_deck)
        return {"status": "shuffled", "cards_remaining": len(self.current_deck)}
    
    def draw_card(self):
        """Draw one card from deck."""
        if not self.current_deck:
            return None
        return self.current_deck.pop()
    
    def extract_meaning(self, card, context="General"):
        """
        Extract meaning from Word document based on context.
        
        Args:
            card (dict): Card dictionary from deck
            context (str): Context type (General, Love, Career, Finance, Health, Spiritual)
        
        Returns:
            str: Contextual meaning
        """
        meaning_file = self.assets_path / card["meaning_path"].replace("assets/", "")
        
        if not meaning_file.exists():
            return f"⚠️ Meaning file not found: {card['display_name']}. Please add the Word document."
        
        try:
            doc = Document(meaning_file)
            
            # Parse table (assuming first table contains meanings)
            if doc.tables:
                table = doc.tables[0]
                for row in table.rows:
                    cells = row.cells
                    if len(cells) >= 2:
                        row_context = cells[0].text.strip()
                        if row_context.lower() == context.lower():
                            return cells[1].text.strip()
            
            return f"Context '{context}' not found in meaning file."
        
        except Exception as e:
            return f"Error reading meaning: {str(e)}"
    
    def reset(self):
        """Reset deck to full 78 cards."""
        self.current_deck = self.deck.copy()
        return {"status": "reset", "cards_remaining": len(self.current_deck)}
