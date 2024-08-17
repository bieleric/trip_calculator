const { 
    getRolesTable, 
    getGroupsTable, 
    getUsersTable, 
    getGroupMembersTable, 
    getInvitationsTable, 
    getTripsTable, 
    getFavoritesTable, 
    getAdminSettingsTable, 
    getClosingsTable, 
    createRolesTable, 
    createGroupsTable, 
    createUsersTable,
    createGroupMembersTable,
    createInvitationTable,
    createTripsTable,
    createFavoritesTable,
    createAdminSettingsTable,
    createClosingsTable,
    insertInitialRoles,
    insertInitialGroup,
    insertInitialUser,
    insertInitialGroupMember,
    insertInitialAdminSettings,
 } = require("./databaseQueries");


const checkDatabaseAndCreateTables = (db) => {
    // intialize tables iteratively
    initializeTableWithInitialValues(db, 'groups', getGroupsTable, createGroupsTable, insertInitialGroup, (success) => {
        if (!success) {
            console.error("Fehler beim Initialisieren der Tabelle 'groups'.");
            return;
        }
        else {
            initializeTableWithInitialValues(db, 'roles', getRolesTable, createRolesTable, insertInitialRoles, (success) => {
                if (!success) {
                    console.error("Fehler beim Initialisieren der Tabelle 'roles'.");
                    return;
                }
                else {
                    initializeTableWithInitialValues(db, 'users', getUsersTable, createUsersTable, insertInitialUser, (success) => {
                        if (!success) {
                            console.error("Fehler beim Initialisieren der Tabelle 'users'.");
                            return;
                        }
                        else {
                            initializeTableWithInitialValues(db, 'group_members', getGroupMembersTable, createGroupMembersTable, insertInitialGroupMember, (success) => {
                                if (!success) {
                                    console.error("Fehler beim Initialisieren der Tabelle 'group_members'.");
                                    return;
                                }
                                else {
                                    initializeTableWithoutInitialValues(db, 'favorites', getFavoritesTable, createFavoritesTable, (success) => {
                                        if (!success) {
                                            console.error("Fehler beim Initialisieren der Tabelle 'favorites'.");
                                            return;
                                        }
                                        else {
                                            initializeTableWithoutInitialValues(db, 'invitations', getInvitationsTable, createInvitationTable, (success) => {
                                                if (!success) {
                                                    console.error("Fehler beim Initialisieren der Tabelle 'invitations'.");
                                                    return;
                                                }
                                                else {
                                                    initializeTableWithoutInitialValues(db, 'trips', getTripsTable, createTripsTable, (success) => {
                                                        if (!success) {
                                                            console.error("Fehler beim Initialisieren der Tabelle 'trips'.");
                                                            return;
                                                        }
                                                        else {
                                                            initializeTableWithInitialValues(db, 'admin_settings', getAdminSettingsTable, createAdminSettingsTable, insertInitialAdminSettings, (success) => {
                                                                if (!success) {
                                                                    console.error("Fehler beim Initialisieren der Tabelle 'admin_settings'.");
                                                                    return;
                                                                }
                                                                else {
                                                                    initializeTableWithoutInitialValues(db, 'closings', getClosingsTable, createClosingsTable, (success) => {
                                                                        if (!success) {
                                                                            console.error("Fehler beim Initialisieren der Tabelle 'closings'.");
                                                                            return;
                                                                        }
                                                                        else {
                                                                            console.log("All tables were successfully created and initialized");
                                                                            return;
                                                                        }
                                                                    })
                                                                }
                                                            })
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
}

const initializeTableWithInitialValues = (db, tableName, getTableQuery, createTableQuery, insertInitialValuesQuery, callback) => {
    db.get(getTableQuery, (err, row) => {
        if (err) {
            console.error(`Fehler beim Abfragen der Tabelle '${ tableName }': `, err.message);
            callback(false);
            return;
        }

        // create table if not found
        if (!row) {
            db.run(createTableQuery, (err) => {
                if (err) {
                    console.error(`Fehler beim Erstellen der Tabelle '${ tableName }': `, err.message);
                    callback(false);
                } 
                else {
                    // insert initial values
                    console.log(`Tabelle '${ tableName }' erfolgreich erstellt.`);
                    db.run(insertInitialValuesQuery, (err) => {
                        if (err) {
                            console.error(`Fehler beim Initialisieren der Tabelle '${ tableName }': `, err.message);
                            callback(false);
                        } else {
                            console.log(`Tabelle '${ tableName }' erfolgreich initialisiert.`);
                            callback(true);
                        }
                    });
                }
            });
        } 
        else {
            console.log(`Die Tabelle '${ tableName }' bereits erstellt.`);
            callback(true);
        }
    });
}

const initializeTableWithoutInitialValues = (db, tableName, getTableQuery, createTableQuery, callback) => {
    db.get(getTableQuery, (err, row) => {
        if (err) {
            console.error(`Fehler beim Abfragen der Tabelle '${ tableName }': `, err.message);
            callback(false);
            return;
        }

        // create table if not found
        if (!row) {
            db.run(createTableQuery, (err) => {
                if (err) {
                    console.error(`Fehler beim Erstellen der Tabelle '${ tableName }': `, err.message);
                    callback(false);
                } 
                else {
                    console.log(`Tabelle '${ tableName }' erfolgreich erstellt.`);
                    callback(true);
                }
            });
        } 
        else {
            console.log(`Die Tabelle '${ tableName }' bereits erstellt.`);
            callback(true);
        }
    });
}

module.exports = {
    checkDatabaseAndCreateTables: checkDatabaseAndCreateTables
};
