# Stock Market Simulator

PurrMoney is powered by real market data from the Colombo Stock Exchange (CSE).
This platform allows users to practice stock trading with virtual money while using live or near real-time data from the Sri Lankan stock market.


## Tech Stack
### Frontend
* React JS
* Tailwind CSS

### Backend
* Node JS
* Express
* Mongo DB

## Preview

<img src="https://iili.io/qCDSxh7.png" width="800">

## Installation

Clone the repo:

```
git clone https://github.com/Imira-S-R/stock-market-simulator.git
```

Install dependencies:

```
npm install
cd server
npm install
```

Create a .env file in the project root:

```
VITE_API_URL=http://localhost:3000/api
VITE_GOOGLE_REDIRECT_URI=http://localhost:3000/api/google/callback
```

Create a .env file in the ```/server``` folder

```
FRONTEND_URL="http://localhost:5173/dashboard"
SECRET_KEY="SECRET"
DATABASE_URL="MONGO DB URL"
CLIENT_ID="GOOGLE OAUTH ID"
CLIENT_SECRET="GOOGLE OAUTH SECRET"
WEBSITE_URL="http://localhost:3000"
CALLBACK_URL="http://localhost:3000"
```

### ⚠️ Disclaimer

This project is for educational purposes only.
It does not provide financial advice and is not affiliated with the Colombo Stock Exchange.
