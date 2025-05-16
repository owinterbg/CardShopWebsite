# CardShopWebsite

A full-stack web application to manage and showcase a personal Pokémon card collection. It also serves as a storefront framework for licensed card distribution. This project emphasizes modular design, full separation between frontend and backend, and introduces machine learning for object detection in future development.

## 🚀 Tech Stack

* **Frontend**: React + Redux
* **Backend**: Flask (Python)
* **Database**: SQLite (dev only)
* **Environment**: WSL2 (Ubuntu), VS Code
* **Node Management**: `nvm`
* **Python**: via system packages or pyenv
* **Future Tooling**: Docker, PyTorch, OpenCV

## 💻 Development Environment Setup

### 1. Prerequisites

* WSL2 with Ubuntu installed (e.g., via [Windows Terminal](https://learn.microsoft.com/en-us/windows/wsl/install))
* [VS Code](https://code.visualstudio.com/) with **Remote - WSL** extension
* [Node.js](https://github.com/nvm-sh/nvm) (install via `nvm`)
* Python 3.x and `pip`

### 2. Clone the Repository

```bash
git clone https://github.com/owinterbg/CardShopWebsite.git
cd CardShopWebsite
```

### 3. Set Up Python Virtual Environment

```bash
# Inside backend/ directory
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

> Ensure the virtual environment is activated for all backend operations.

## 📦 Project Structure

```
CardShopWebsite/
├── backend/          # Flask app
├── frontend/         # React app
├── run.bash          # Script to launch frontend & backend
└── README.md
```

## 🛠 Getting Started

### 1. Install Dependencies

```bash
# In frontend/
nvm use <version>
npm install

# In backend/
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Set Up SQLite Database

```bash
# From within backend/
python setup_db.py  # or run the initialization logic manually if provided
```

### 3. Start the App (Unified Script)

```bash
# From project root
bash run.bash
```

This script does the following:

* Activates the Python virtual environment
* Launches the Flask backend
* Starts the React frontend with `npm start`

> Make sure the script is executable:

```bash
chmod +x run.bash
```

## 🔁 Development Workflow

* All work is done inside WSL2 Ubuntu shell
* Frontend: `npm start` (auto reload)
* Backend: `flask run` or `python app.py`
* Environment vars stored in `.env` files (you may need to create one manually)
* Use VS Code Source Control panel to manage Git changes and pushes

## 🗃 Database Management

* Default SQLite file is stored in `backend/`
* You can clear/reset the DB by removing the `.db` file and rerunning the setup

---

For questions or contributions, reach out via GitHub Issues or PRs!
