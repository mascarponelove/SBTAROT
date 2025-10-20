import random

class TarotDeck:
    """
    Implements a 78-card Rider-Waite-Smith tarot deck with 
    Fisher-Yates shuffle algorithm for unbiased randomization.
    """
    
    def __init__(self):
        """Initialize deck with all 78 cards in order."""
        # 22 Major Arcana (0-21)
        self.major_arcana = [
            "0 - The Fool",
            "I - The Magician",
            "II - The High Priestess",
            "III - The Empress",
            "IV - The Emperor",
            "V - The Hierophant",
            "VI - The Lovers",
            "VII - The Chariot",
            "VIII - Strength",
            "IX - The Hermit",
            "X - Wheel of Fortune",
            "XI - Justice",
            "XII - The Hanged Man",
            "XIII - Death",
            "XIV - Temperance",
            "XV - The Devil",
            "XVI - The Tower",
            "XVII - The Star",
            "XVIII - The Moon",
            "XIX - The Sun",
            "XX - Judgement",
            "XXI - The World"
        ]
        
        # 56 Minor Arcana (4 suits × 14 cards)
        suits = ["Wands", "Cups", "Swords", "Pentacles"]
        ranks = ["Ace", "Two", "Three", "Four", "Five", "Six", 
                 "Seven", "Eight", "Nine", "Ten", "Page", 
                 "Knight", "Queen", "King"]
        
        self.minor_arcana = [f"{rank} of {suit}" 
                             for suit in suits 
                             for rank in ranks]
        
        # Combine into full deck
        self.deck = self.major_arcana + self.minor_arcana
        self.current_deck = self.deck.copy()
    
    def shuffle(self):
        """
        Shuffle the deck using Fisher-Yates algorithm.
        Python's random.shuffle() implements this internally.
        Complexity: O(n), produces unbiased permutation.
        """
        self.current_deck = self.deck.copy()  # Reset to full deck
        random.shuffle(self.current_deck)
        print("Deck shuffled using Fisher-Yates algorithm.")
    
    def draw_card(self):
        """
        Draw one random card from the shuffled deck.
        Returns: Card name as string, or None if deck is empty.
        """
        if not self.current_deck:
            return None
        
        card = self.current_deck.pop()  # Remove and return last card
        return card
    
    def reset(self):
        """Reset deck to original unshuffled state."""
        self.current_deck = self.deck.copy()
        print("Deck reset to original order.")


# Usage Example
if __name__ == "__main__":
    # Initialize deck
    deck = TarotDeck()
    
    # Shuffle the deck
    deck.shuffle()
    
    # Draw one random card
    drawn_card = deck.draw_card()
    
    print(f"\n{'='*50}")
    print(f"Your card: {drawn_card}")
    print(f"{'='*50}\n")
    
    # Optional: Show remaining cards in deck
    print(f"Cards remaining in deck: {len(deck.current_deck)}")
```

## Technical Explanation

### **1. Data Structure**
- **Major Arcana:** List of 22 cards with traditional Roman numeral notation
- **Minor Arcana:** Generated programmatically using list comprehension for efficiency
- **Total verification:** 22 + (4 suits × 14 ranks) = 78 cards

### **2. Shuffling Algorithm**
Python's `random.shuffle()` implements the **Fisher-Yates shuffle**:
```
for i from n−1 down to 1 do
    j ← random integer such that 0 ≤ j ≤ i
    swap array[i] and array[j]
