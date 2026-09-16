# RentRide — Multi-Vendor Vehicle Rental Marketplace

Production-grade vehicle rental marketplace connecting Customers, Vehicle Vendors, and Administrators.

## Project Structure

- `server/`: Node.js + Express + MongoDB REST API backend
- `client/`: React + Vite + Tailwind CSS + Redux Toolkit frontend
- `ai-service/`: Python + FastAPI + scikit-learn Machine Learning microservice
- `docs/`: Comprehensive Architecture & Technical Documentation ([View Docs](docs/README.md))


## Quick Start

### 1. Backend Setup
```bash
cd server
npm install
cp .env.example .env
npm run dev
```

### 2. Frontend Setup
```bash
cd client
npm install
cp .env.example .env
npm run dev
```

### 3. AI Service Setup
```bash
cd ai-service
python -m venv venv
# On Windows: venv\Scripts\activate
# On Linux/macOS: source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
