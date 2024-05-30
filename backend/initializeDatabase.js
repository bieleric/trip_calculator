function checkDatabaseAndCreateTables(db) {
    return new Promise((resolve, reject) => {
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
                    db.run("INSERT INTO roles (role_id, role_name) VALUES (1, 'admin'), (2, 'user')", function(err) {
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

function initializeUsersTable(db, callback) {
    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'", function(err, row) {
        if (err) {
            console.error("Fehler beim Abfragen der Tabelle 'users': ", err.message);
            callback(false);
            return;
        }

        if (!row) {
            db.run("CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, createdAt TIMESTAMP DEFAULT      CURRENT_TIMESTAMP, role_id INTEGER, FOREIGN KEY (role_id) REFERENCES roles(role_id))", function(err) {
                if (err) {
                    console.error("Fehler beim Erstellen der Tabelle 'users': ", err.message);
                    callback(false);
                } 
                else {
                    console.log("Tabelle 'users' erfolgreich erstellt.");
                    callback(true);
                }
            });
        } 
        else {
            console.log("Die Tabelle 'users' bereits erstellt.");
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
            db.run("CREATE TABLE trips (id INTEGER PRIMARY KEY AUTOINCREMENT, start TEXT NOT NULL, destination TEXT NOT NULL, date TIMESTAMP NOT NULL, transport TEXT NOT NULL, costs REAL, distance INTEGER, single_trip INTEGER NOT NULL, favorite INTEGER NOT NULL DEFAULT 0, createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, user_id INTEGER, FOREIGN KEY (user_id) REFERENCES users(id))", function(err) {
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

function initializeAdminSettingsTable(db, callback) {
    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='admin_settings'", function(err, row) {
        if (err) {
            console.error("Fehler beim Abfragen der Tabelle 'admin_settings': ", err.message);
            callback(false);
            return;
        }

        if (!row) {
            db.run("CREATE TABLE admin_settings (id INTEGER PRIMARY KEY AUTOINCREMENT, primary_color TEXT NOT NULL DEFAULT '#369551', secondary_color TEXT NOT NULL DEFAULT '#FFFFFF', budget REAL NOT NULL DEFAULT 500)", function(err) {
                if (err) {
                    console.error("Fehler beim Erstellen der Tabelle 'admin_settings': ", err.message);
                    callback(false);
                } 
                else {
                    console.log("Tabelle 'admin_settings' erfolgreich erstellt.");
                    callback(true);
                }
            });
        } 
        else {
            console.log("Die Tabelle 'admin_settings' bereits erstellt.");
            callback(true);
        }
    });
}

module.exports = {
    checkDatabaseAndCreateTables: checkDatabaseAndCreateTables
};
