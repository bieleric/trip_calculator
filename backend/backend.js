const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcryptjs = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const { checkDatabaseAndCreateTables } = require('./services/initializeDatabase.js');
const { validateApiKey, validateToken, authorizeAdmin } = require('./services/middleware.js');
const { jwtKey, port } = require('./services/constants.js');
const { getUserByEmail, insertUser, getUserIdByEmail, insertGroupMember, getGroupsByUserId, getGroupsAndUserInformationByUserId, getAdminSettingsByGroupId, getUsersByGroupId, getFavoritesByUserIdAndGroupId, getTripsByGroupId, getClosingsByGroupId, resetSelectedGroupByUserId, setSelectedGroupByUserIdAndGroupId, insertInvitation, getInvitationByToken, setInvitationAsUsed, deleteUserFromGroupByUserIdAndGroupId, insertFavorite, getLatestFavorite, insertTrip, getLatestTrip, deleteTripByUserIdAndTripIdAndGroupId, updateTripByUserIdAndTripIdAndGroupId, deleteFavoriteByUserIdAndTripIdAndGroupId, updateFavoriteByUserIdAndTripIdAndGroupId, updateAdminSettingsByGroupId, insertClosing, getLatestClosingByGroupId, deleteClosingByClosingIdAndGroupId } = require('./services/databaseQueries.js');

const app = express();
app.use(express.json());

const db = new sqlite3.Database('../trip_calculator.db', (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    // Enable foreign key support
    db.run('PRAGMA foreign_keys = ON;', (err) => {
      if (err) {
        console.error('Failed to enable foreign keys:', err.message);
      }
    });
  }
});

checkDatabaseAndCreateTables(db);

// Sign Up Endpoints
app.post('/signUp', async (req, res) => {
  const { name, email, password } = req.body;
  const saltRounds = 10;
  const hashedPassword = await bcryptjs.hash(password, saltRounds);

  db.serialize(() => {
    db.run("BEGIN TRANSACTION");

    db.run(insertUser, [email, name, hashedPassword, 0], (err) => {
      if (err) {
          db.run("ROLLBACK");
          console.error('Could not insert user: ', err.message);
          return res.status(500).json({ error: err.message });
      }

      db.run("COMMIT");
      return res.status(200).json({ message: 'Success' });
    });
  });
});

// Sign In Endpoints
app.post('/signIn', (req, res) => {
  const { email, password } = req.body;

  db.run("BEGIN TRANSACTION");

  db.all(getUserByEmail, [email], async (err, rows) => {
    if (err) {
        db.run("ROLLBACK");
        console.error('Could not find user: ', err.message);
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!rows) {
      db.run("ROLLBACK");
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    user = rows[0];

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      db.run("ROLLBACK");
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    db.all(getGroupsAndUserInformationByUserId, [user.id], (err, rows) => {
      if (err) {
          db.run("ROLLBACK");
          console.error('Could not get groups by user_id: ', err.message);
          return res.status(500).json({ error: err.message });
      }

      groups = []; 
      selectedGroupId = null;

      rows.forEach((row) => {
        if(row.selected === 1) {
          selectedGroupId = row.group_id;
        }

        groups.push({
          groupId: row.group_id,
          groupName: row.group_name,
          roleId: row.role_id,
          roleName: row.role_name
        })
      });

      const token = jwt.sign({
        userId: user.id,
        email: user.email,
        name: user.name,
        active: user.active,
        groups: groups,
      }, jwtKey, { expiresIn: '1h' });
  
      db.run("COMMIT");
      res.status(200).json({ token, selectedGroupId, message: 'Success' });
    });
  });
});

// Group Endpoints
// Get groups for user
app.get('/api/groups', validateApiKey, validateToken, (req, res) => {
  const token = req.headers['authorization'];
  let userId = '';
  
  jwt.verify(token, jwtKey, (err, decoded) => {
    userId = decoded.userId;
  });

  db.serialize(() => {
    db.run("BEGIN TRANSACTION");

    db.all(getGroupsByUserId, [userId], (err, rows) => {
      if (err) {
          db.run("ROLLBACK");
          console.error('Could not find groups of user: ', err.message);
          return res.status(500).json({ error: err.message });
      }

      db.run("COMMIT");
      return res.status(200).json({ message: 'success', groups: rows });
    });
  });
});

// Select group
app.post('/api/groups/select', validateApiKey, validateToken, (req, res) => {
  const { groupId } = req.body;

  const token = req.headers['authorization'];
  let userId = '';
  
  jwt.verify(token, jwtKey, (err, decoded) => {
    userId = decoded.userId;
  });

  db.serialize(() => {
    db.run("BEGIN TRANSACTION");

    db.run(resetSelectedGroupByUserId, [userId], (err, rows) => {
      if (err) {
          db.run("ROLLBACK");
          console.error('Could not reset group selection: ', err.message);
          return res.status(500).json({ error: err.message });
      }

      db.run(setSelectedGroupByUserIdAndGroupId, [userId, groupId], (err, rows) => {
        if (err) {
            db.run("ROLLBACK");
            console.error('Could not set group selection: ', err.message);
            return res.status(500).json({ error: err.message });
        }

        db.run("COMMIT");
        return res.status(200).json({ message: 'success' });
      });
    });
  });
});

// Create invitation for group
app.post('/api/groups/createInvitation', validateApiKey, validateToken, authorizeAdmin, async (req, res) => {
  const { groupId } = req.body;
  const invitationToken = crypto.randomBytes(20).toString('hex');
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 3); // link is 3 days valid

  db.serialize(() => {
    db.run("BEGIN TRANSACTION");

    db.run(insertInvitation, [groupId, invitationToken, expirationDate], (err) => {
      if (err) {
        db.run("ROLLBACK");
        console.error('Could not create invitation: ', err.message);
        return res.status(500).json({ error: err.message });
      }

      db.run("COMMIT");
      // TODO: change hostname
      return res.status(200).json({ message: 'success', invitationLink: `http://localhost:5173/joinGroup/${invitationToken}` });
    });
  });
});

// Join group by invitation token
app.post('/api/groups/joinGroup', validateApiKey, validateToken, async (req, res) => {
  const { invitationToken } = req.body;
  const token = req.headers['authorization'];
  let userId = '';
  let email = '';
  let active = '';

  jwt.verify(token, jwtKey, (err, decoded) => {
    userId = decoded.userId
    email = decoded.email,
    active = decoded.active
  });



  db.serialize(() => {
    db.run("BEGIN TRANSACTION");

    db.all(getInvitationByToken, [invitationToken], (err, rows) => {
      if (err) {
          db.run("ROLLBACK");
          console.error('Could not find invitation: ', err.message);
          return res.status(500).json({ error: err.message });
      }

      if(rows.length > 0) {
        const groupId = rows[0].group_id
        const used = rows[0].used
        const expirationDate = rows[0].expiration_date
    
        if(groupId && !used && new Date() <= new Date(expirationDate)) {
          db.run(resetSelectedGroupByUserId, [userId], (err) => {
            if (err) {
              db.run("ROLLBACK");
              console.error('Could not reset selected groups: ', err.message);
              return res.status(500).json({ error: err.message });
            }

            db.run(insertGroupMember, [userId, groupId, 2, 1], (err) => {
              if (err) {
                db.run("ROLLBACK");
                console.error('Could not insert user to group members: ', err.message);
                return res.status(500).json({ error: err.message });
              }

              db.run(setInvitationAsUsed, [invitationToken], (err) => {
                if (err) {
                  db.run("ROLLBACK");
                  console.error('Could not set invitation as used: ', err.message);
                  return res.status(500).json({ error: err.message });
                }

                db.all(getGroupsAndUserInformationByUserId, [userId], (err, rows) => {
                  if (err) {
                      db.run("ROLLBACK");
                      console.error('Could not get groups by user_id: ', err.message);
                      return res.status(500).json({ error: err.message });
                  }
            
                  groups = []; 
            
                  rows.forEach((row) => {
                    groups.push({
                      groupId: row.group_id,
                      groupName: row.group_name,
                      roleId: row.role_id,
                      roleName: row.role_name
                    })
                  });
            
                  const newToken = jwt.sign({
                    userId: userId,
                    email: email,
                    active: active,
                    groups: groups,
                  }, jwtKey, { expiresIn: '1h' });

                  db.run("COMMIT");
                  return res.status(200).json({ token: newToken, message: 'success' });
                });
              });  
            });
          });
        }
        else {
          db.run("ROLLBACK");
          return res.status(400).json({ error: 'Invitation link not valid' });
        }
      }
      else {
        db.run("ROLLBACK");
        return res.status(400).json({ error: 'Invitation link not valid' });
      }
    });
  });
});

// Leave group
app.post('/api/groups/leave', validateApiKey, validateToken, async (req, res) => {
  const { groupId } = req.body;
  const token = req.headers['authorization'];
  let userId = '';

  jwt.verify(token, jwtKey, (err, decoded) => {
    userId = decoded.userId
  });

  db.serialize(() => {
    db.run("BEGIN TRANSACTION");

    db.run(deleteUserFromGroupByUserIdAndGroupId, [userId, groupId], (err) => {
      if (err) {
        db.run("ROLLBACK");
        console.error('Could not leave group: ', err.message);
        return res.status(500).json({ error: err.message });
      }

      db.run("COMMIT");
      return res.status(200).json({ message: 'success' });
    });
  });
});

// Admin Settings Endpoints
// Get admin settings for group
app.get('/api/adminSettings/:groupId', validateApiKey, validateToken, (req, res) => {
  const groupId = req.params.groupId;
  
  db.serialize(() => {
    db.run("BEGIN TRANSACTION");

    db.all(getAdminSettingsByGroupId, [groupId], (err, rows) => {
      if (err) {
          db.run("ROLLBACK");
          console.error('Could not find admin settings: ', err.message);
          return res.status(500).json({ error: err.message });
      }

      db.run("COMMIT");
      return res.status(200).json({ message: 'success', settings: rows });
    });
  });
});

// User Endpoints
// Get users of group
app.get('/api/users/:groupId', validateApiKey, validateToken, (req, res) => {
  const groupId = req.params.groupId;

  db.serialize(() => {
    db.run("BEGIN TRANSACTION");

    db.all(getUsersByGroupId, [groupId], (err, rows) => {
      if (err) {
          db.run("ROLLBACK");
          console.error('Could not find admin settings: ', err.message);
          return res.status(500).json({ error: err.message });
      }

      db.run("COMMIT");
      return res.status(200).json({ message: 'success', users: rows });
    });
  });
});

// Remove user from group
app.post('/api/users/removeUser', validateApiKey, validateToken, authorizeAdmin, (req, res) => {
  const { userId, groupId } = req.body;

  db.serialize(() => {
    db.run("BEGIN TRANSACTION");

    db.run(deleteUserFromGroupByUserIdAndGroupId, [userId, groupId], (err) => {
      if (err) {
          db.run("ROLLBACK");
          console.error('Could not remove user from group: ', err.message);
          return res.status(500).json({ error: err.message });
      }

      db.run("COMMIT");
      return res.status(200).json({ message: 'Success' });
    });
  });
});

// TODO: delete user for account deletion
app.delete('/api/users/:userId', validateApiKey, validateToken, authorizeAdmin, (req, res) => {
  const userId = req.params.userId;

  const token = req.headers['authorization'];
  let groupId = '';
  
  jwt.verify(token, jwtKey, (err, decoded) => {
    groupId = decoded.group_id
  });

  db.run("DELETE FROM users WHERE id = ? AND group_id = ?", [userId, groupId], function(err) {
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
// Get all trips by group
app.get('/api/trips/:groupId', validateApiKey, validateToken, (req, res) => {
  const groupId = req.params.groupId;

  db.serialize(() => {
    db.run("BEGIN TRANSACTION");

    db.all(getTripsByGroupId, [groupId], (err, rows) => {
      if (err) {
        db.run("ROLLBACK");
        console.error('Could not find trips of group: ', err.message);
        return res.status(500).json({ error: err.message });
      }

      db.run("COMMIT");
      return res.status(200).json({ message: 'success', allTrips: rows });
    });
  });
});

// Add trip with favorite or just add trip
app.post('/api/trips', validateApiKey, validateToken, (req, res) => {
  const { groupId, userName, transport, start, destination, costs, distance, singleTrip, date, favorites } = req.body;
  const token = req.headers['authorization'];
  let userId = '';
  
  jwt.verify(token, jwtKey, (err, decoded) => {
    userId = decoded.userId
  });

  if(favorites) {
    db.serialize(() => {
      db.run("BEGIN TRANSACTION");

      db.run(insertFavorite, [userId, start, destination, transport, costs, distance, singleTrip, groupId], (err) => {
        if (err) {
          db.run("ROLLBACK");
          console.error('Could not insert favorite: ', err.message);
          return res.status(500).json({ error: err.message });
        }

        db.get(getLatestFavorite, [userId], (err, favoriteRow) => {
          if (err) {
            db.run("ROLLBACK");
            console.error('Could not get latest favorite: ', err.message);
            return res.status(500).json({ error: err.message });
          }

          db.run(insertTrip, [userId, start, destination, date, transport, costs, distance, singleTrip, groupId, userName], (err) => {
            if (err) {
              db.run("ROLLBACK");
              console.error('Could not insert trip: ', err.message);
              return res.status(500).json({ error: err.message });
            }

            db.get(getLatestTrip, [userId], (err, tripRow) => {
              if(err) {
                db.run("ROLLBACK");
                console.error('Could not insert trip: ', err.message);
                return res.status(500).json({ error: err.message });
              }

              db.run("COMMIT");
              return res.status(200).json({ message: 'success', favorite: favoriteRow, trip: tripRow });
            })
          });
        })
      });
    });
  }
  else {
    db.serialize(() => {
      db.run("BEGIN TRANSACTION");

      db.run(insertTrip, [userId, start, destination, date, transport, costs, distance, singleTrip, groupId, userName], (err) => {
        if (err) {
          db.run("ROLLBACK");
          console.error('Could not insert trip: ', err.message);
          return res.status(500).json({ error: err.message });
        }

        db.get(getLatestTrip, [userId], (err, tripRow) => {
          if(err) {
            db.run("ROLLBACK");
            console.error('Could not insert trip: ', err.message);
            return res.status(500).json({ error: err.message });
          }

          db.run("COMMIT");
          return res.status(200).json({ message: 'success', favorite: null, trip: tripRow });
        })
      });
    });
  }
});

// Delete a trip
app.delete('/api/trips/:tripId/group/:groupId', validateApiKey, validateToken, (req, res) => {
  const tripId = req.params.tripId;
  const groupId = req.params.groupId;
  const token = req.headers['authorization'];
  let userId = '';
  
  jwt.verify(token, jwtKey, (err, decoded) => {
    userId = decoded.userId
  });

  db.serialize(() => {
    db.run("BEGIN TRANSACTION");

    db.run(deleteTripByUserIdAndTripIdAndGroupId, [userId, tripId, groupId], (err) => {
      if(err) {
        db.run("ROLLBACK");
        console.error('Could not delete trip: ', err.message);
        return res.status(500).json({ error: err.message });
      }

      db.run("COMMIT");
      return res.status(200).json({ message: 'success' });      
    });
  });
});

// Update a trip 
app.post('/api/trips/:tripId', validateApiKey, validateToken, (req, res) => {
  const { transport, start, destination, costs, distance, date, singleTrip, groupId } = req.body;
  const tripId = req.params.tripId;
  const token = req.headers['authorization'];
  let userId = '';
  
  jwt.verify(token, jwtKey, (err, decoded) => {
    userId = decoded.userId
  });

  db.serialize(() => {
    db.run("BEGIN TRANSACTION");

    db.run(updateTripByUserIdAndTripIdAndGroupId, [start, destination, transport, costs, distance, date, singleTrip, userId, tripId, groupId], (err) => {
      if(err) {
        db.run("ROLLBACK");
        console.error('Could not insert trip: ', err.message);
        return res.status(500).json({ error: err.message });
      }

      db.run("COMMIT");
      return res.status(200).json({ message: 'success' });
    });
  })
});

// Favorites Endpoints
// Get favorites for user and current group
app.get('/api/favorites/:groupId', validateApiKey, validateToken, (req, res) => {
  const groupId = req.params.groupId;
  const token = req.headers['authorization'];
  let userId = '';
  
  jwt.verify(token, jwtKey, (err, decoded) => {
    userId = decoded.userId;
  });

  db.serialize(() => {
    db.run("BEGIN TRANSACTION");

    db.all(getFavoritesByUserIdAndGroupId, [userId, groupId], (err, rows) => {
      if (err) {
        db.run("ROLLBACK");
        console.error('Could not find favorites of user: ', err.message);
        return res.status(500).json({ error: err.message });
      }

      db.run("COMMIT");
      return res.status(200).json({ message: 'success', favorites: rows });
    });
  });
});

// Delete from favorites
app.delete('/api/favorites/:favoriteId/group/:groupId', validateApiKey, validateToken, (req, res) => {
  const favoriteId = req.params.favoriteId;
  const groupId = req.params.groupId;
  const token = req.headers['authorization'];
  let userId = '';
  
  jwt.verify(token, jwtKey, (err, decoded) => {
    userId = decoded.userId
  });

  db.serialize(() => {
    db.run("BEGIN TRANSACTION");

    db.run(deleteFavoriteByUserIdAndTripIdAndGroupId, [userId, favoriteId, groupId], (err) => {
      if (err) {
        db.run("ROLLBACK");
        console.error('Could not delete favorite of user: ', err.message);
        return res.status(500).json({ error: err.message });
      }

      db.run("COMMIT");
      return res.status(200).json({ message: 'success' });
    });
  });
});

// Update a favorite
app.post('/api/favorites/:favoriteId', validateApiKey, validateToken, (req, res) => {
  const favoriteId = req.params.favoriteId;
  const { transport, start, destination, costs, distance, singleTrip, groupId } = req.body;

  const token = req.headers['authorization'];
  let userId = '';
  
  jwt.verify(token, jwtKey, (err, decoded) => {
    userId = decoded.userId
  });

  db.serialize(() => {
    db.run("BEGIN TRANSACTION");

    db.run(updateFavoriteByUserIdAndTripIdAndGroupId, [start, destination, transport, costs, distance, singleTrip, userId, favoriteId, groupId], (err) => {
      if (err) {
        db.run("ROLLBACK");
        console.error('Could not update favorite of user: ', err.message);
        return res.status(500).json({ error: err.message });
      }

      db.run("COMMIT");
      return res.status(200).json({ message: 'success' });
    });
  });
});

// Admin settings endpoint
app.post('/api/adminSettings', validateApiKey, validateToken, authorizeAdmin, (req, res) => {
  const { budget, pricePerKilometer, groupId } = req.body;

  const token = req.headers['authorization'];
  let groups = null;
  
  jwt.verify(token, jwtKey, (err, decoded) => {
    groups = decoded.groups;
  });

  const isMemberOfGroup = groups.find((group) => group.groupId === groupId);

  if(isMemberOfGroup) {
    db.serialize(() => {
      db.run("BEGIN TRANSACTION");
  
      db.run(updateAdminSettingsByGroupId, [budget, pricePerKilometer, groupId], (err) => {
        if (err) {
          db.run("ROLLBACK");
          console.error('Could not update admin settings: ', err.message);
          return res.status(500).json({ error: err.message });
        }
  
        db.run("COMMIT");
        return res.status(200).json({ message: 'success' });
      });
    });
  }
  else {
    console.error('Not allowed to change admin settings of this group');
    return res.status(403).json({ error: 'Not allowed to change admin settings of this group' });
  }
});

// Closings Endpoints
app.get('/api/closings/:groupId', validateApiKey, validateToken, (req, res) => {
  const groupId = req.params.groupId;

  db.serialize(() => {
    db.run("BEGIN TRANSACTION");

    db.all(getClosingsByGroupId, [groupId], (err, rows) => {
      if (err) {
        db.run("ROLLBACK");
        console.error('Could not find closings of group: ', err.message);
        return res.status(500).json({ error: err.message });
      }

      db.run("COMMIT");
      return res.status(200).json({ message: 'success', closings: rows });
    });
  });
});

app.post('/api/closings', validateApiKey, validateToken, authorizeAdmin, (req, res) => {
  const { period, closed, budget, pricePerKilometer, groupId } = req.body;

  db.serialize(() => {
    db.run("BEGIN TRANSACTION");

    db.run(insertClosing, [period, closed, budget, pricePerKilometer, groupId], (err) => {
      if (err) {
        db.run("ROLLBACK");
        console.error('Could not insert closing to group: ', err.message);
        return res.status(500).json({ error: err.message });
      }

      db.get(getLatestClosingByGroupId, [groupId], (err, closingRow) => {
        if(err) {
          db.run("ROLLBACK");
          console.error('Could not get latest closing of group: ', err.message);
          return res.status(500).json({ error: err.message });
        }
  
        db.run("COMMIT");
        return res.status(200).json({ message: 'success', closing: closingRow });
      });
    });
  });
});

app.delete('/api/closings/:closingId/group/:groupId', validateApiKey, validateToken, authorizeAdmin, (req, res) => {
  const closingId = req.params.closingId;
  const groupId = req.params.groupId;

  const token = req.headers['authorization'];
  let groups = null;
  
  jwt.verify(token, jwtKey, (err, decoded) => {
    groups = decoded.groups;
  });

  const isMemberOfGroup = groups.find((group) => group.groupId === Number(groupId));

  if(isMemberOfGroup) {
    db.serialize(() => {
      db.run("BEGIN TRANSACTION");

      db.run(deleteClosingByClosingIdAndGroupId, [closingId, groupId], (err) => {
        if (err) {
          db.run("ROLLBACK");
          console.error('Could not delete closing from group: ', err.message);
          return res.status(500).json({ error: err.message });
        }

        db.run("COMMIT");
        return res.status(200).json({ message: 'success' });
      });
    });
  }
  else {
    console.error('Not allowed to change closings of this group');
    return res.status(403).json({ error: 'Not allowed to change closings of this group' });
  }
});


app.use(express.static(path.join(__dirname, '../client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});