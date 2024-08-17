// check tables
const getRolesTable = `SELECT name 
    FROM sqlite_master 
    WHERE type='table' AND name='roles'`;

const getGroupsTable = `SELECT name 
    FROM sqlite_master 
    WHERE type='table' AND name='groups'`;

const getUsersTable = `SELECT name 
    FROM sqlite_master 
    WHERE type='table' AND name='users'`;

const getGroupMembersTable = `SELECT name 
    FROM sqlite_master 
    WHERE type='table' AND name='group_members'`;

const getInvitationsTable = `SELECT name 
    FROM sqlite_master 
    WHERE type='table' AND name='invitations'`;

const getTripsTable = `SELECT name 
    FROM sqlite_master 
    WHERE type='table' AND name='trips'`;

const getFavoritesTable = `SELECT name 
    FROM sqlite_master 
    WHERE type='table' AND name='favorites'`;

const getAdminSettingsTable = `SELECT name 
    FROM sqlite_master 
    WHERE type='table' AND name='admin_settings'`;

const getClosingsTable = `SELECT name 
    FROM sqlite_master 
    WHERE type='table' AND name='closings'`;


// create tables
const createRolesTable = `CREATE TABLE roles (
    id INTEGER PRIMARY KEY, 
    role_name TEXT NOT NULL
)`;

const createGroupsTable = `CREATE TABLE groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    name TEXT NOT NULL, 
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

const createUsersTable = `CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    name TEXT NOT NULL, 
    email TEXT UNIQUE NOT NULL, 
    password TEXT NOT NULL, 
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    active INTEGER NOT NULL
)`;

const createGroupMembersTable = `CREATE TABLE group_members (
    group_id INTEGER, 
    user_id INTEGER,
    role_id INTEGER,
    selected INTEGER NOT NULL,
    PRIMARY KEY (group_id, user_id), 
    FOREIGN KEY (group_id) REFERENCES groups(id), 
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (role_id) REFERENCES roles(id)
)`;

const createInvitationTable = `CREATE TABLE invitations (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    group_id INTEGER, 
    invitation_token TEXT UNIQUE,
    expiration_date DATETIME, 
    used INTEGER DEFAULT 0, 
    FOREIGN KEY (group_id) REFERENCES groups(id)
);`;

const createTripsTable = `CREATE TABLE trips (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    start TEXT NOT NULL, 
    destination TEXT NOT NULL, 
    date TIMESTAMP NOT NULL, 
    transport TEXT NOT NULL, 
    costs REAL, 
    distance INTEGER, 
    single_trip INTEGER NOT NULL, 
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    user_id INTEGER, 
    user_name TEXT NOT NULL,
    group_id INTEGER, 
    FOREIGN KEY (user_id) REFERENCES users(id), 
    FOREIGN KEY (group_id) REFERENCES groups(id)
)`;

const createFavoritesTable = `CREATE TABLE favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    start TEXT NOT NULL, 
    destination TEXT NOT NULL,
    transport TEXT NOT NULL, 
    costs REAL, 
    distance INTEGER, 
    single_trip INTEGER NOT NULL, 
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    user_id INTEGER, 
    group_id INTEGER, 
    FOREIGN KEY (user_id) REFERENCES users(id), 
    FOREIGN KEY (group_id) REFERENCES groups(id)
)`;

const createAdminSettingsTable = `CREATE TABLE admin_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    budget REAL NOT NULL, 
    price_per_kilometer REAL NOT NULL, 
    group_id INTEGER, 
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
)`;

const createClosingsTable = `CREATE TABLE closings (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    period TIMESTAMP NOT NULL UNIQUE, 
    closed INTEGER NOT NULL, 
    budget REAL NOT NULL, 
    price_per_kilometer REAL NOT NULL, 
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    group_id INTEGER, 
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
)`;


// insert initial values
const insertInitialRoles = `INSERT INTO roles (id, role_name) VALUES 
    (0, 'superuser'), 
    (1, 'admin'), 
    (2, 'user')
`;

const insertInitialGroup = `INSERT INTO groups (name) VALUES 
    ('demo')
`;

const insertInitialUser = `INSERT INTO users (name, email, password, active) VALUES 
    ('admin', 'admin@email.com', '$2b$10$guYiV7swGTprgsqMKTHmhuzd7xE2qV5yD9gfoNinjZKslcySP7T5K', 1)
`;

const insertInitialGroupMember = `INSERT INTO group_members (group_id, user_id, role_id, selected) VALUES 
    (1, 1, 0, 1)
`;

const insertInitialAdminSettings = `INSERT INTO admin_settings (budget, price_per_kilometer, group_id) VALUES 
    (500, 0.3, 1)
`;


// inserts
const insertUser = `INSERT INTO users (email, name, password, active) VALUES 
    (?, ?, ?, ?)
`;

const insertGroupMember = `INSERT INTO group_members (user_id, group_id, role_id, selected) VALUES 
    (?, ?, ?, ?)
`;

const insertInvitation = `INSERT INTO invitations (group_id, invitation_token, expiration_date) VALUES 
    (?, ?, ?)
`;

const insertFavorite = `INSERT INTO favorites (user_id, start, destination, transport, costs, distance, single_trip, group_id) VALUES 
    (?, ?, ?, ?, ?, ?, ?, ?)
`;

const insertTrip = `INSERT INTO trips (user_id, start, destination, date, transport, costs, distance, single_trip, group_id, user_name) VALUES        
    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

const insertClosing = `INSERT INTO closings (period, closed, budget, price_per_kilometer, group_id) VALUES 
    (?, ?, ?, ?, ?)
`;

// updates
const resetSelectedGroupByUserId = `UPDATE group_members 
    SET selected = 0 
    WHERE user_id = ? AND selected = 1;
`;

const setSelectedGroupByUserIdAndGroupId = `UPDATE group_members 
    SET selected = 1 
    WHERE user_id = ? AND group_id = ?;
`;

const setInvitationAsUsed = `UPDATE invitations 
    SET used = 1 
    WHERE invitation_token = ?
`;

const updateTripByUserIdAndTripIdAndGroupId = `UPDATE trips 
    SET start = ?, destination = ?, transport = ?, costs = ?, distance = ?, date = ?, single_trip = ? 
    WHERE user_id = ? AND id = ? AND group_id = ?
`;

const updateFavoriteByUserIdAndTripIdAndGroupId = `UPDATE favorites 
    SET start = ?, destination = ?, transport = ?, costs = ?, distance = ?, single_trip = ? 
    WHERE user_id = ? AND id = ? AND group_id = ?
`;

const updateAdminSettingsByGroupId = `UPDATE admin_settings 
    SET budget = ?, price_per_kilometer = ? 
    WHERE group_id = ?
`;


// gets
const getUserIdByEmail = `SELECT user_id 
    FROM users 
    WHERE email = ?
`;

const getUserByEmail = `SELECT *
    FROM users 
    WHERE email = ?
`;

const getGroupsAndUserInformationByUserId = `SELECT users.id, users.name, users.email, groups.id AS group_id, groups.name AS group_name, roles.id AS role_id, roles.role_name AS role_name, group_members.selected
    FROM users
    JOIN group_members ON users.id = group_members.user_id
    JOIN groups ON group_members.group_id = groups.id
    JOIN roles ON group_members.role_id = roles.id
    WHERE users.id = ?;
`;

const getAdminSettingsByGroupId = `SELECT * 
    FROM admin_settings 
    WHERE group_id = ?
`;

const getUsersByGroupId = `SELECT users.id, users.name, users.email, roles.id AS role_id, roles.role_name AS role_name
    FROM group_members
    JOIN users ON users.id = group_members.user_id
    JOIN groups ON group_members.group_id = groups.id
    JOIN roles ON group_members.role_id = roles.id
    WHERE group_members.group_id = ?;
`;

const getFavoritesByUserIdAndGroupId = `SELECT * 
    FROM favorites 
    WHERE user_id = ? AND group_id = ?
`;

const getTripsByGroupId = `SELECT * 
    FROM trips 
    WHERE group_id = ?
`;

const getClosingsByGroupId = `SELECT * 
    FROM closings 
    WHERE group_id = ?
`;

const getGroupsByUserId = `SELECT groups.id AS group_id, groups.name AS group_name, group_members.selected, roles.id AS role_id, roles.role_name AS role_name
    FROM users
    JOIN group_members ON users.id = group_members.user_id
    JOIN groups ON group_members.group_id = groups.id
    JOIN roles ON group_members.role_id = roles.id
    WHERE users.id = ?;
`;

const getInvitationByToken = `SELECT * 
    FROM invitations 
    WHERE invitation_token = ?
`;

const getLatestFavorite = `SELECT * 
    FROM favorites 
    WHERE user_id = ? 
    ORDER BY id DESC LIMIT 1
`;

const getLatestTrip = `SELECT * 
    FROM trips 
    WHERE user_id = ? 
    ORDER BY id DESC LIMIT 1
`;

const getLatestClosingByGroupId = `SELECT * 
    FROM closings
    WHERE group_id = ?
    ORDER BY id DESC LIMIT 1
`;

// deletes
const deleteUserFromGroupByUserIdAndGroupId = `DELETE FROM group_members 
    WHERE user_id = ? AND group_id = ?
`;

const deleteTripByUserIdAndTripIdAndGroupId = `DELETE FROM trips 
    WHERE user_id = ? AND id = ? AND group_id = ?
`;

const deleteFavoriteByUserIdAndTripIdAndGroupId = `DELETE FROM favorites 
    WHERE user_id = ? AND id = ? AND group_id = ?
`;

const deleteClosingByClosingIdAndGroupId = `DELETE FROM closings 
    WHERE id = ? AND group_id = ?
`;


module.exports = {
    getRolesTable: getRolesTable,
    getGroupsTable: getGroupsTable,
    getUsersTable: getUsersTable,
    getGroupMembersTable: getGroupMembersTable,
    getInvitationsTable: getInvitationsTable,
    getTripsTable: getTripsTable,
    getFavoritesTable: getFavoritesTable,
    getAdminSettingsTable: getAdminSettingsTable,
    getClosingsTable: getClosingsTable,
    createRolesTable: createRolesTable,
    createGroupsTable: createGroupsTable,
    createUsersTable: createUsersTable,
    createGroupMembersTable: createGroupMembersTable,
    createInvitationTable: createInvitationTable,
    createTripsTable: createTripsTable,
    createFavoritesTable: createFavoritesTable,
    createAdminSettingsTable: createAdminSettingsTable,
    createClosingsTable: createClosingsTable,
    insertInitialRoles: insertInitialRoles,
    insertInitialGroup: insertInitialGroup,
    insertInitialUser: insertInitialUser,
    insertInitialGroupMember: insertInitialGroupMember,
    insertInitialAdminSettings: insertInitialAdminSettings,
    insertUser: insertUser,
    insertGroupMember: insertGroupMember,
    getUserIdByEmail: getUserIdByEmail,
    getUserByEmail: getUserByEmail,
    getGroupsAndUserInformationByUserId: getGroupsAndUserInformationByUserId,
    getAdminSettingsByGroupId: getAdminSettingsByGroupId,
    getUsersByGroupId: getUsersByGroupId,
    getFavoritesByUserIdAndGroupId: getFavoritesByUserIdAndGroupId,
    getTripsByGroupId: getTripsByGroupId,
    getClosingsByGroupId: getClosingsByGroupId,
    getGroupsByUserId: getGroupsByUserId,
    resetSelectedGroupByUserId: resetSelectedGroupByUserId,
    setSelectedGroupByUserIdAndGroupId: setSelectedGroupByUserIdAndGroupId,
    insertInvitation: insertInvitation,
    getInvitationByToken: getInvitationByToken,
    setInvitationAsUsed: setInvitationAsUsed,
    deleteUserFromGroupByUserIdAndGroupId: deleteUserFromGroupByUserIdAndGroupId,
    insertFavorite: insertFavorite,
    getLatestFavorite: getLatestFavorite,
    insertTrip: insertTrip,
    getLatestTrip: getLatestTrip,
    deleteTripByUserIdAndTripIdAndGroupId: deleteTripByUserIdAndTripIdAndGroupId,
    updateTripByUserIdAndTripIdAndGroupId: updateTripByUserIdAndTripIdAndGroupId,
    deleteFavoriteByUserIdAndTripIdAndGroupId: deleteFavoriteByUserIdAndTripIdAndGroupId,
    updateFavoriteByUserIdAndTripIdAndGroupId: updateFavoriteByUserIdAndTripIdAndGroupId,
    updateAdminSettingsByGroupId: updateAdminSettingsByGroupId,
    insertClosing: insertClosing,
    getLatestClosingByGroupId: getLatestClosingByGroupId,
    deleteClosingByClosingIdAndGroupId: deleteClosingByClosingIdAndGroupId
};
