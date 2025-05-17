// Minimal Express backend for Guide Finder App
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'guideFinderDB';

app.use(cors());
app.use(bodyParser.json());

let db;

// Connect to MongoDB
MongoClient.connect(MONGO_URI, { useUnifiedTopology: true })
  .then(client => {
    db = client.db(DB_NAME);
    app.listen(PORT, () => console.log(`API server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });

// JWT middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Guide validation helper
function validateGuide(guide) {
  const errors = [];
  if (!guide.title || typeof guide.title !== 'string' || guide.title.trim().length < 5) {
    errors.push('Title must be at least 5 characters.');
  }
  if (!guide.description || typeof guide.description !== 'string' || guide.description.trim().length < 10) {
    errors.push('Description must be at least 10 characters.');
  }
  if (!Array.isArray(guide.steps) || guide.steps.length < 2) {
    errors.push('Guide must have at least 2 steps.');
  } else if (guide.steps.some(step => typeof step !== 'string' || step.trim().length < 5)) {
    errors.push('Each step must be a string of at least 5 characters.');
  }
  return { valid: errors.length === 0, errors };
}

// Login endpoint
app.post('/api/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    const token = jwt.sign({ role: 'admin', exp: Math.floor(Date.now() / 1000) + 60 * 60 }, JWT_SECRET);
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

// Get all guides
app.get('/api/guides', async (req, res) => {
  try {
    const guides = await db.collection('guides').find({}).toArray();
    res.json(guides);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch guides' });
  }
});

// Add a new guide (admin only)
app.post('/api/guides', authenticateToken, async (req, res) => {
  try {
    const guide = req.body;
    const { valid, errors } = validateGuide(guide);
    if (!valid) {
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }
    await db.collection('guides').insertOne(guide);
    res.status(201).json({ message: 'Guide added' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add guide' });
  }
});

// Update a guide (admin only)
app.put('/api/guides/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const guide = req.body;
    const { valid, errors } = validateGuide(guide);
    if (!valid) {
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }
    await db.collection('guides').updateOne({ id }, { $set: guide });
    res.json({ message: 'Guide updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update guide' });
  }
});

// Delete a guide (admin only)
app.delete('/api/guides/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('guides').deleteOne({ id });
    res.json({ message: 'Guide deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete guide' });
  }
});
