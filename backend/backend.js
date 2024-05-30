const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const dotenv = require('dotenv');
const path = require('path');
const { checkDatabaseAndCreateTables } = require('./initializeDatabase.js');

const app = express();
dotenv.config();
app.use(express.json());

const port = process.env.PORT || 3000;
const apiKey = process.env.API_KEY;

// setup database if required
const db = new sqlite3.Database('../trip_calculator.db');
checkDatabaseAndCreateTables(db);

// middleware for api validation
function validateApiKey(req, res, next) {
  const requestApiKey = req.headers['x-api-key'];
  if (!requestApiKey || requestApiKey !== apiKey) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
}

// API endpoints
app.get('/api/users', validateApiKey, (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({
      "message": "success",
      "data": rows
    });
  });
});

app.get('/api/roles', validateApiKey, (req, res) => {
  db.all("SELECT * FROM roles", [], (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({
      "message": "success",
      "data": rows
    });
  });
});

app.get('/api/trips', validateApiKey, (req, res) => {
  db.all("SELECT * FROM trips", [], (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({
      "message": "success",
      "data": rows
    });
  });
});

app.get('/api/adminSettings', validateApiKey, (req, res) => {
  db.all("SELECT * FROM admin_settings", [], (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({
      "message": "success",
      "data": rows
    });
  });
});


app.use(express.static(path.join(__dirname, '../client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});