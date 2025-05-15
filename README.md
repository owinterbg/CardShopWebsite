# CardShop Website

A full-stack web application to manage personal Pokémon card inventory and serve as a storefront for licensed distribution.

## 📦 Tech Stack

- **Frontend:** React + TypeScript
- **Backend:** Flask (Python)
- **Dev Tools:** VS Code, WSL2, Docker (later), Bash
- **API:** [Pokémon TCG SDK](https://github.com/PokemonTCG/pokemon-tcg-sdk-python)

## 🔧 Development Setup

### Requirements

- Node.js (via `nvm`)
- Python 3 (via WSL2)
- VS Code with WSL and recommended extensions

### Installation

```bash
# Clone the repository
git clone https://github.com/yourname/cardshop-website.git
cd cardshop-website

# Frontend setup
cd frontend
npm install

# Backend setup
cd ../backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
