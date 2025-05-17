# Guide Finder App

## Overview
The Guide Finder App is a web application designed to help users find step-by-step instructions or guides for various software installations and service deployments. The app features a user-friendly interface that allows users to search for guides, view detailed instructions, and even request missing guides through AI assistance.

## Features
- **Search Functionality**: Users can enter queries to search for specific guides in the database.
- **Guide List**: Displays a list of available guides based on the search query.
- **Guide Details**: Provides detailed information about a selected guide, including step-by-step instructions.
- **AI Assistance**: If a guide is not found, the app uses AI to search for the missing instructions, validate them, and add them to the database.
- **Admin Panel**: Allows reviewing, editing, and deleting guides, with authentication and feedback features.

## Project Structure
```
guide-finder-app/
├── api/
│   └── server.js
├── public/
│   └── index.html
├── src/
│   ├── api/
│   ├── components/
│   ├── db/
│   ├── pages/
│   └── types/
├── .env.example
├── package.json
├── README.md
└── ...
```

## Installation
1. Clone the repository:
   ```
   git clone https://github.com/yourusername/guide-finder-app.git
   ```
2. Navigate to the project directory:
   ```
   cd guide-finder-app
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage
1. Start the development server:
   ```
   npm start
   ```
2. Open your browser and navigate to `http://localhost:3000` to access the application.

## Deployment Instructions

### 1. Backend Setup
- Copy `.env.example` to `.env` in `guide-finder-app/` and fill in your MongoDB URI, JWT secret, and admin password.
- Install backend dependencies:
  ```bash
  cd guide-finder-app
  npm install express cors body-parser jsonwebtoken mongodb dotenv
  ```
- Start the backend server:
  ```bash
  node api/server.js
  ```
  The backend will run on `http://localhost:4000` by default.

### 2. Frontend Setup
- In a new terminal, install frontend dependencies:
  ```bash
  npm install
  ```
- Start the frontend development server:
  ```bash
  npm start
  ```
  The frontend will run on `http://localhost:3000` by default.

### 3. Production Build & Deployment
- Build the frontend for production:
  ```bash
  npm run build
  ```
- Deploy the `build/` directory to your static hosting (Vercel, Netlify, etc.).
- Deploy the backend (e.g., to Render, Heroku, or your own server).
- Ensure environment variables are set in your production environment.
- Make sure the frontend’s API calls point to your deployed backend.

### Notes
- The backend must be running and accessible to the frontend.
- MongoDB must be available and configured in `.env`.
- All admin API calls require a valid JWT (obtain via `/api/login`).

## Contribution
Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.