# SBTATROT - Tarot Card Reading Application

A full-stack web application for tarot card readings using the Rider-Waite-Smith deck with comprehensive contextual interpretations.

## 🌟 Features

- **78-card tarot deck** (22 Major Arcana + 56 Minor Arcana)
- **Fisher-Yates shuffle algorithm** for true randomization
- **10 contextual interpretations** for each card:
  - Soul Reading
  - Essence/Prediction
  - Example
  - Past
  - Present
  - Future
  - Health
  - Profession
  - Relationship
  - Guidance
- **Yes/No and +/- indicators** for each card
- **Custom card images** with your unique designs
- **Interactive web dashboard** with beautiful gradient UI
- **RESTful API** for programmatic access

## 🛠️ Tech Stack

- **Backend:** Python 3.11, Flask, python-docx
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Deployment:** 
  - Backend: Render (Free tier)
  - Frontend: GitHub Pages
- **Card Data:** Microsoft Word documents (.docx) with 2-column table format

## 📁 Project Structure

```
SBTATROT/
├── backend/
│   ├── app.py                 # Flask API server
│   ├── tarot_deck.py         # Deck logic and card parsing
│   ├── requirements.txt       # Python dependencies
│   └── __init__.py           # Package marker
├── frontend/
│   ├── index.html            # Main dashboard
│   ├── style.css             # Styling
│   └── script.js             # API integration
├── assets/
│   ├── images/
│   │   ├── major/            # 22 Major Arcana images
│   │   └── minor/            # 56 Minor Arcana images
│   │       ├── cups/
│   │       ├── pentacles/
│   │       ├── swords/
│   │       └── wands/
│   └── meanings/
│       ├── major/            # 22 .docx files
│       └── minor/            # 56 .docx files (same structure)
├── docs/                     # GitHub Pages deployment
├── .gitignore
├── README.md
├── runtime.txt               # Python version for Render
└── Procfile                  # Render deployment config
```

## 🚀 Installation & Setup

### Prerequisites
- Python 3.8+
- pip
- Git

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mascarponelove/SBTAROT.git
   cd SBTAROT
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r backend/requirements.txt
   ```

3. **Run the application:**
   ```bash
   python backend/app.py
   ```

4. **Open in browser:**
   ```
   http://localhost:5000
   ```

## 📝 Word Document Format

Each card's meaning file must be a 2-column table:

| Category | Content |
|----------|---------|
| Card Name | Eight of Swords |
| Yes/No | No |
| +/- | - |
| Soul | [Soul reading text] |
| Essence/Prediction | [Essence text] |
| Example | [Example text] |
| Past | [Past interpretation] |
| Present | [Present interpretation] |
| Future | [Future interpretation] |
| Health | [Health guidance] |
| Profession | [Career guidance] |
| Relationship | [Relationship guidance] |
| Guidance | [General guidance] |

## 🌐 Deployment

### Backend (Render)

1. Push code to GitHub
2. Go to [render.com](https://render.com)
3. Create new Web Service
4. Connect your repository
5. Configuration:
   - **Build Command:** `pip install -r backend/requirements.txt`
   - **Start Command:** `gunicorn -w 4 -b 0.0.0.0:$PORT backend.app:app`
   - **Instance Type:** Free

### Frontend (GitHub Pages)

1. Copy frontend files to `docs/` folder:
   ```bash
   mkdir docs
   cp -r frontend/* docs/
   cp -r assets docs/
   ```

2. Push to GitHub:
   ```bash
   git add docs/
   git commit -m "Deploy to GitHub Pages"
   git push
   ```

3. Enable GitHub Pages:
   - Repository Settings → Pages
   - Source: main branch
   - Folder: /docs
   - Save

4. Your site will be at: `https://YOUR_USERNAME.github.io/SBTAROT/`

## 🔧 API Endpoints

### POST /api/shuffle
Shuffle the deck.

**Response:**
```json
{
  "status": "shuffled",
  "cards_remaining": 78
}
```

### POST /api/draw
Draw a card with contextual interpretation.

**Request:**
```json
{
  "context": "Soul"
}
```

**Response:**
```json
{
  "card": {
    "name": "EIGHT_OF_SWORDS",
    "display_name": "Eight Of Swords",
    "type": "minor",
    "suit": "swords",
    "image_path": "assets/images/minor/swords/EIGHT.png"
  },
  "meaning": "[Soul reading text from Word document]",
  "context": "Soul",
  "cards_remaining": 77,
  "metadata": {
    "Card Name": "Eight of Swords",
    "Yes/No": "No",
    "+/-": "-",
    "Soul": "...",
    ...
  }
}
```

### POST /api/reset
Reset deck to 78 cards.

**Response:**
```json
{
  "status": "reset",
  "cards_remaining": 78
}
```

### GET /api/status
Get current deck status.

**Response:**
```json
{
  "cards_remaining": 78,
  "total_cards": 78,
  "status": "operational"
}
```

## 🎨 Card Naming Convention

### Images
- **Major Arcana:** `FOOL.png`, `MAGICIAN.png`, `HIGH_PRIESTESS.png`, etc.
- **Minor Arcana:** `ACE.png`, `TWO.png`, `THREE.png`, ..., `KING.png`

### Meaning Documents
- Match image names exactly
- Use `.docx` extension
- Example: `EIGHT.docx` (for Eight of Swords)

## 🐛 Troubleshooting

### "Meaning file not found"
- Verify .docx files are in correct folders
- Check file names match exactly (UPPERCASE)
- Ensure .docx extension

### "Image not found"
- Check image files exist in assets/images/
- Verify file extensions (.png or .jpg)
- Ensure UPPERCASE naming

### CORS errors
- Update `backend/app.py` with your GitHub Pages URL
- Redeploy backend on Render

### Backend not responding
- Check Render deployment logs
- Verify environment variables
- Free tier sleeps after 15 min inactivity (first request takes 30 seconds)

## 📊 Cost

- **GitHub:** Free (unlimited public repos)
- **Render:** Free tier (750 hours/month)
- **GitHub Pages:** Free (100GB bandwidth/month)
- **Total:** $0/month

## 🤝 Contributing

Contributions welcome! Please follow standard Git workflow.

## 📄 License

MIT License - Feel free to use for personal or commercial projects.

## 👤 Author

Created with ❤️ for spiritual guidance seekers.

## 🙏 Acknowledgments

- Rider-Waite-Smith Tarot Deck tradition
- Flask and Python communities
- GitHub for free hosting

## 📞 Support

For issues or questions, please open a GitHub issue.

---

**Live Demo:** [https://mascarponelove.github.io/SBTAROT/](https://mascarponelove.github.io/SBTAROT/)

**Backend API:** [https://sbtatrot-backend.onrender.com](https://sbtatrot-backend.onrender.com)
