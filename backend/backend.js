const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const dotenv = require('dotenv');
const path = require('path');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { checkDatabaseAndCreateTables } = require('./services/initializeDatabase.js');
const { getUserByEmail } = require('./services/databaseQueries.js');

const app = express();
dotenv.config();
app.use(express.json());

const port = process.env.PORT || 3000;
const apiKey = process.env.API_KEY;
const jwtKey = process.env.JWT_KEY;

// setup database if required
const db = new sqlite3.Database('../trip_calculator.db');
checkDatabaseAndCreateTables(db);

// middleware for api validation
const validateApiKey = (req, res, next) => {
  const requestApiKey = req.headers['x-api-key'];
  if (!requestApiKey || requestApiKey !== apiKey) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
}

// middleware for token validation
const validateToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if(!token) {
    return res.status(401).json({ error: 'Access denied' });
  }

  jwt.verify(token, jwtKey, (err, decoded) => {
    if(err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    next();
  });
}

// middleware for authorization
const authorizeAdmin = (req, res, next) => {
  const token = req.headers['authorization'];
  
  jwt.verify(token, jwtKey, (err, decoded) => {
    if(decoded.role_id !== 1) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  });
}

// Sign In Endpoints
app.post('/signIn', (req, res) => {
  const { email, password } = req.body;

  getUserByEmail(db, email, async (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ 
      userId: user.id,
      email: user.email,
      role_id: user.role_id
    }, jwtKey, { expiresIn: '1h' });

    res.status(200).json({ token, user, message: 'Success' });
  });
});

// User Endpoints
app.get('/api/users', validateApiKey, validateToken, (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    return res.status(200).json({ message: 'success', users: rows });
  });
});

app.post('/api/users', validateApiKey, validateToken, authorizeAdmin, (req, res) => {
  const { email, name, role } = req.body;
  db.run("INSERT INTO users (email, name, password, role_id, active) VALUES (?, ?, ?, ?, ?)", [email, name, '', role, 0], (err, rows) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    return res.status(200).json({ message: 'success' });
  });
});

app.delete('/api/users/:email', validateApiKey, validateToken, authorizeAdmin, (req, res) => {
  const userEmail = req.params.email;
  db.run("DELETE FROM users WHERE email = ?", [userEmail], function(err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ message: 'Success' });
  });
});

// Trips Endpoints
app.get('/api/trips', validateApiKey, validateToken, (req, res) => {
  const token = req.headers['authorization'];
  let userId = '';
  
  jwt.verify(token, jwtKey, (err, decoded) => {
    userId = decoded.userId
  });

  db.all("SELECT * FROM trips WHERE user_id = ?", [userId], (err, rows) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    return res.status(200).json({ message: 'success', myTrips: rows });
  });
});

app.post('/api/trips', validateApiKey, validateToken, (req, res) => {
  const { transport, start, destination, costs, distance, singleTrip, date, favorites } = req.body;
  const token = req.headers['authorization'];
  let userId = '';
  
  jwt.verify(token, jwtKey, (err, decoded) => {
    userId = decoded.userId
  });

  if(favorites) {
    db.run("INSERT INTO favorites (user_id, start, destination, transport, costs, distance, single_trip) VALUES (?, ?, ?, ?, ?, ?, ?)", [userId, start, destination, transport, costs, distance, singleTrip], (err, rows) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      db.get("SELECT * FROM favorites WHERE user_id = ? ORDER BY id DESC LIMIT 1", [userId], (err, favoriteRow) => {
        if(err) {
          return res.status(400).json({ error: err.message });
        }
        
        db.run("INSERT INTO trips (user_id, start, destination, date, transport, costs, distance, single_trip) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [userId, start, destination, date, transport, costs, distance, singleTrip], (err, rows) => {
          if (err) {
            return res.status(400).json({ error: err.message });
          }
      
          db.get("SELECT * FROM trips WHERE user_id = ? ORDER BY id DESC LIMIT 1", [userId], (err, tripRow) => {
            if(err) {
              return res.status(400).json({ error: err.message });
            }

            return res.status(200).json({ message: 'success', favorite: favoriteRow, trip: tripRow });
          });
        });
      });
    });
  }
  else {
    db.run("INSERT INTO trips (user_id, start, destination, date, transport, costs, distance, single_trip) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [userId, start, destination, date, transport, costs, distance, singleTrip], (err, rows) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
  
      db.get("SELECT * FROM trips WHERE user_id = ? ORDER BY id DESC LIMIT 1", [userId], (err, tripRow) => {
        if(err) {
          return res.status(400).json({ error: err.message });
        }

        return res.status(200).json({ message: 'success', favorite: null, trip: tripRow });
      });
    });
  }
});

app.delete('/api/trips/:id', validateApiKey, validateToken, (req, res) => {
  const tripId = req.params.id;
  const token = req.headers['authorization'];
  let userId = '';
  
  jwt.verify(token, jwtKey, (err, decoded) => {
    userId = decoded.userId
  });

  db.run("DELETE FROM trips WHERE user_id = ? AND id = ?", [userId, tripId], function(err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    return res.status(200).json({ message: 'Success' });
  });
});

app.post('/api/trips/:id', validateApiKey, validateToken, (req, res) => {
  const tripId = req.params.id;
  const { transport, start, destination, costs, distance, date, singleTrip } = req.body;

  const token = req.headers['authorization'];
  let userId = '';
  
  jwt.verify(token, jwtKey, (err, decoded) => {
    userId = decoded.userId
  });

  db.run("UPDATE trips SET start = ?, destination = ?, transport = ?, costs = ?, distance = ?, date = ?, single_trip = ? WHERE user_id = ? AND id = ?", [start, destination, transport, costs, distance, date, singleTrip, userId, tripId], function(err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    return res.status(200).json({ message: 'Success' });
  });
});

app.get('/api/allTrips', validateApiKey, validateToken, (req, res) => {
  db.all("SELECT * FROM trips", (err, rows) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    return res.status(200).json({ message: 'success', allTrips: rows });
  });
});

// Favorites Endpoints
app.get('/api/favorites', validateApiKey, validateToken, (req, res) => {
  const token = req.headers['authorization'];
  let userId = '';
  
  jwt.verify(token, jwtKey, (err, decoded) => {
    userId = decoded.userId
  });

  db.all("SELECT * FROM favorites WHERE user_id LIKE ?", [userId], (err, rows) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    return res.status(200).json({ message: 'success', favorites: rows });
  });
});

app.delete('/api/favorites/:id', validateApiKey, validateToken, (req, res) => {
  const favoriteId = req.params.id;
  const token = req.headers['authorization'];
  let userId = '';
  
  jwt.verify(token, jwtKey, (err, decoded) => {
    userId = decoded.userId
  });

  db.run("DELETE FROM favorites WHERE user_id = ? AND id = ?", [userId, favoriteId], function(err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    return res.status(200).json({ message: 'Success' });
  });
});

app.post('/api/favorites/:id', validateApiKey, validateToken, (req, res) => {
  const favoriteId = req.params.id;
  const { transport, start, destination, costs, distance, singleTrip } = req.body;

  const token = req.headers['authorization'];
  let userId = '';
  
  jwt.verify(token, jwtKey, (err, decoded) => {
    userId = decoded.userId
  });

  db.run("UPDATE favorites SET start = ?, destination = ?, transport = ?, costs = ?, distance = ?, single_trip = ? WHERE user_id = ? AND id = ?", [start, destination, transport, costs, distance, singleTrip, userId, favoriteId], function(err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    return res.status(200).json({ message: 'Success' });
  });
});

// Admin Settings Endpoints
app.get('/api/adminSettings', validateApiKey, validateToken, (req, res) => {
  db.all("SELECT * FROM admin_settings", [], (err, rows) => {
    if (err) {
      return res.status(400).json({ "error": err.message });
    }

    return res.status(200).json({ message: 'success', settings: rows });
  });
});

app.post('/api/adminSettings', validateApiKey, validateToken, authorizeAdmin, (req, res) => {
  const { budget, pricePerKilometer } = req.body;

  db.run("UPDATE admin_settings SET budget = ?, price_per_kilometer = ?", [budget, pricePerKilometer], function(err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Admin setting not found' });
    }

    return res.status(200).json({ message: 'Success' });
  });
});

// Closings Endpoints
app.get('/api/closings', validateApiKey, validateToken, (req, res) => {
  db.all("SELECT * FROM closings", (err, rows) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    return res.status(200).json({ message: 'success', closings: rows });
  });
});

app.post('/api/closings', validateApiKey, validateToken, authorizeAdmin, (req, res) => {
  const { period, closed, budget, pricePerKilometer } = req.body;

  db.run("INSERT INTO closings (period, closed, budget, price_per_kilometer) VALUES (?, ?, ?, ?)", [period, closed, budget, pricePerKilometer], (err, rows) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    db.get("SELECT * FROM closings ORDER BY id DESC LIMIT 1", (err, closingRow) => {
      if(err) {
        return res.status(400).json({ error: err.message });
      }

      return res.status(200).json({ message: 'success', closing: closingRow });
    });
  });
});

app.delete('/api/closings/:id', validateApiKey, validateToken, authorizeAdmin, (req, res) => {
  const closingId = req.params.id;

  db.run("DELETE FROM closings WHERE id = ?", [closingId], function(err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Closing not found' });
    }

    return res.status(200).json({ message: 'Success' });
  });
});


// TODO: adopt jwt verification
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


app.use(express.static(path.join(__dirname, '../client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});