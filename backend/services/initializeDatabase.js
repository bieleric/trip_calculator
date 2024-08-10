function checkDatabaseAndCreateTables(db) {
    return new Promise((resolve, reject) => {
        initializeGroupsTable(db, (success) => {
            if (!success) {
                console.error("Fehler beim Initialisieren der Tabelle 'groups'.");
                reject(false);
            } 
            else {
                console.log("Die Tabelle 'groups' ist einsatzbereit.");
                resolve(true);
            }
        });
        initializeRolesTable(db, (success) => {
            if (!success) {
                console.error("Fehler beim Initialisieren der Tabelle 'roles'.");
                reject(false);
            } 
            else {
                console.log("Die Tabelle 'roles' ist einsatzbereit.");
                resolve(true);
            }
        });
        initializeUsersTable(db, (success) => {
            if (!success) {
                console.error("Fehler beim Initialisieren der Tabelle 'users'.");
                reject(false);
            } 
            else {
                console.log("Die Tabelle 'users' ist einsatzbereit.");
                resolve(true);
            }
        });
        initializeInvitationsTable(db, (success) => {
            if (!success) {
                console.error("Fehler beim Initialisieren der Tabelle 'invitations'.");
                reject(false);
            } 
            else {
                console.log("Die Tabelle 'invitations' ist einsatzbereit.");
                resolve(true);
            }
        });
        initializeTripsTable(db, (success) => {
            if (!success) {
                console.error("Fehler beim Initialisieren der Tabelle 'trips'.");
                reject(false);
            } 
            else {
                console.log("Die Tabelle 'trips' ist einsatzbereit.");
                resolve(true);
            }
        });
        initializeFavoritesTable(db, (success) => {
            if (!success) {
                console.error("Fehler beim Initialisieren der Tabelle 'favorites'.");
                reject(false);
            } 
            else {
                console.log("Die Tabelle 'favorites' ist einsatzbereit.");
                resolve(true);
            }
        });
        initializeAdminSettingsTable(db, (success) => {
            if (!success) {
                console.error("Fehler beim Initialisieren der Tabelle 'admin_settings'.");
                reject(false);
            } 
            else {
                console.log("Die Tabelle 'admin_settings' ist einsatzbereit.");
                resolve(true);
            }
        });
        initializeClosingsTable(db, (success) => {
            if (!success) {
                console.error("Fehler beim Initialisieren der Tabelle 'closings'.");
                reject(false);
            } 
            else {
                console.log("Die Tabelle 'closings' ist einsatzbereit.");
                resolve(true);
            }
        });
    });
}

function initializeRolesTable(db, callback) {
    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='roles'", function(err, row) {
        if (err) {
            console.error("Fehler beim Abfragen der Tabelle 'roles': ", err.message);
            callback(false);
            return;
        }

        if (!row) {
            db.run("CREATE TABLE roles (role_id INTEGER PRIMARY KEY, role_name TEXT NOT NULL)", function(err) {
                if (err) {
                    console.error("Fehler beim Erstellen der Tabelle 'roles': ", err.message);
                    callback(false);
                } 
                else {
                    console.log("Tabelle 'roles' erfolgreich erstellt.");
                    db.run("INSERT INTO roles (role_id, role_name) VALUES (0, 'superuser'), (1, 'admin'), (2, 'user')", function(err) {
                        if (err) {
                            console.error("Fehler beim Initialisieren der Tabelle 'roles': ", err.message);
                            callback(false);
                        } else {
                            console.log("Tabelle 'roles' erfolgreich initialisiert.");
                            callback(true);
                        }
                    });
                }
            });
        } 
        else {
            console.log("Die Tabelle 'roles' bereits erstellt.");
            callback(true);
        }
    });
}

function initializeGroupsTable(db, callback) {
    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='groups'", function(err, row) {
        if (err) {
            console.error("Fehler beim Abfragen der Tabelle 'users': ", err.message);
            callback(false);
            return;
        }

        if (!row) {
            db.run("CREATE TABLE groups (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP)", function(err) {
                if (err) {
                    console.error("Fehler beim Erstellen der Tabelle 'groups': ", err.message);
                    callback(false);
                } 
                else {
                    db.run("INSERT INTO groups (name) VALUES ('demo')", function(err) {
                        if (err) {
                            console.error("Fehler beim Initialisieren der Tabelle 'groups': ", err.message);
                            callback(false);
                        } else {
                            console.log("Tabelle 'groups' erfolgreich initialisiert.");
                            callback(true);
                        }
                    });
                }
            });
        } 
        else {
            console.log("Die Tabelle 'groups' bereits erstellt.");
            callback(true);
        }
    });
}

function initializeUsersTable(db, callback) {
    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'", function(err, row) {
        if (err) {
            console.error("Fehler beim Abfragen der Tabelle 'users': ", err.message);
            callback(false);
            return;
        }

        if (!row) {
            db.run("CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL, createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, role_id INTEGER, group_id INTEGER, active INTEGER NOT NULL, FOREIGN KEY (role_id) REFERENCES roles(role_id), FOREIGN KEY (group_id) REFERENCES groups(id))", function(err) {
                if (err) {
                    console.error("Fehler beim Erstellen der Tabelle 'users': ", err.message);
                    callback(false);
                } 
                else {
                    db.run("INSERT INTO users (name, email, password, role_id, group_id, active) VALUES ('admin', 'admin@email.com', '$2b$10$guYiV7swGTprgsqMKTHmhuzd7xE2qV5yD9gfoNinjZKslcySP7T5K', 0, 1, 1)", function(err) {
                        if (err) {
                            console.error("Fehler beim Initialisieren der Tabelle 'users': ", err.message);
                            callback(false);
                        } else {
                            console.log("Tabelle 'users' erfolgreich initialisiert.");
                            callback(true);
                        }
                    });
                }
            });
        } 
        else {
            console.log("Die Tabelle 'users' bereits erstellt.");
            callback(true);
        }
    });
}

function initializeInvitationsTable(db, callback) {
    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='invitations'", function(err, row) {
        if (err) {
            console.error("Fehler beim Abfragen der Tabelle 'invitations': ", err.message);
            callback(false);
            return;
        }

        if (!row) {
            db.run("CREATE TABLE invitations (id INTEGER PRIMARY KEY AUTOINCREMENT, group_id INTEGER, invitation_token TEXT UNIQUE,expiration_date DATETIME, used INTEGER DEFAULT 0, FOREIGN KEY (group_id) REFERENCES groups(id));", function(err) {
                if (err) {
                    console.error("Fehler beim Erstellen der Tabelle 'invitations': ", err.message);
                    callback(false);
                } 
                else {
                    console.log("Tabelle 'invitations' erfolgreich erstellt.");
                    callback(true);
                }
            });
        } 
        else {
            console.log("Die Tabelle 'invitations' bereits erstellt.");
            callback(true);
        }
    });
}

function initializeTripsTable(db, callback) {
    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='trips'", function(err, row) {
        if (err) {
            console.error("Fehler beim Abfragen der Tabelle 'trips': ", err.message);
            callback(false);
            return;
        }

        if (!row) {
            db.run("CREATE TABLE trips (id INTEGER PRIMARY KEY AUTOINCREMENT, start TEXT NOT NULL, destination TEXT NOT NULL, date TIMESTAMP NOT NULL, transport TEXT NOT NULL, costs REAL, distance INTEGER, single_trip INTEGER NOT NULL, createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, user_id INTEGER, user_name TEXT NOT NULL, group_id INTEGER, FOREIGN KEY (user_id) REFERENCES users(id), FOREIGN KEY (group_id) REFERENCES groups(id))", function(err) {
                if (err) {
                    console.error("Fehler beim Erstellen der Tabelle 'trips': ", err.message);
                    callback(false);
                } 
                else {
                    console.log("Tabelle 'trips' erfolgreich erstellt.");
                    callback(true);
                }
            });
        } 
        else {
            console.log("Die Tabelle 'trips' bereits erstellt.");
            callback(true);
        }
    });
}

function initializeFavoritesTable(db, callback) {
    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='favorites'", function(err, row) {
        if (err) {
            console.error("Fehler beim Abfragen der Tabelle 'favorites': ", err.message);
            callback(false);
            return;
        }

        if (!row) {
            db.run("CREATE TABLE favorites (id INTEGER PRIMARY KEY AUTOINCREMENT, start TEXT NOT NULL, destination TEXT NOT NULL,  transport TEXT NOT NULL, costs REAL, distance INTEGER, single_trip INTEGER NOT NULL, createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, user_id INTEGER, group_id INTEGER, FOREIGN KEY (user_id) REFERENCES users(id), FOREIGN KEY (group_id) REFERENCES groups(id))", function(err) {
                if (err) {
                    console.error("Fehler beim Erstellen der Tabelle 'favorites': ", err.message);
                    callback(false);
                } 
                else {
                    console.log("Tabelle 'favorites' erfolgreich erstellt.");
                    callback(true);
                }
            });
        } 
        else {
            console.log("Die Tabelle 'favorites' bereits erstellt.");
            callback(true);
        }
    });
}

function initializeAdminSettingsTable(db, callback) {
    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='admin_settings'", function(err, row) {
        if (err) {
            console.error("Fehler beim Abfragen der Tabelle 'admin_settings': ", err.message);
            callback(false);
            return;
        }

        if (!row) {
            db.run("CREATE TABLE admin_settings (id INTEGER PRIMARY KEY AUTOINCREMENT, budget REAL NOT NULL, price_per_kilometer REAL NOT NULL, group_id INTEGER, FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE)", function(err) {
                if (err) {
                    console.error("Fehler beim Erstellen der Tabelle 'admin_settings': ", err.message);
                    callback(false);
                } 
                else {
                    db.run("INSERT INTO admin_settings (budget, price_per_kilometer, group_id) VALUES (500, 0.3, 1)", function(err) {
                        if (err) {
                            console.error("Fehler beim Initialisieren der Tabelle 'admin_settings': ", err.message);
                            callback(false);
                        } else {
                            console.log("Tabelle 'admin_settings' erfolgreich initialisiert.");
                            callback(true);
                        }
                    });
                }
            });
        } 
        else {
            console.log("Die Tabelle 'admin_settings' bereits erstellt.");
            callback(true);
        }
    });
}

function initializeClosingsTable(db, callback) {
    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='closings'", function(err, row) {
        if (err) {
            console.error("Fehler beim Abfragen der Tabelle 'closings': ", err.message);
            callback(false);
            return;
        }

        if (!row) {
            db.run("CREATE TABLE closings (id INTEGER PRIMARY KEY AUTOINCREMENT, period TIMESTAMP NOT NULL UNIQUE, closed INTEGER NOT NULL, budget REAL NOT NULL, price_per_kilometer REAL NOT NULL, createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, group_id INTEGER, FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE)", function(err) {
                if (err) {
                    console.error("Fehler beim Erstellen der Tabelle 'closings': ", err.message);
                    callback(false);
                } 
                else {
                    console.log("Tabelle 'closings' erfolgreich initialisiert.");
                    callback(true);
                }
            });
        } 
        else {
            console.log("Die Tabelle 'closings' bereits erstellt.");
            callback(true);
        }
    });
}

module.exports = {
    checkDatabaseAndCreateTables: checkDatabaseAndCreateTables
};
