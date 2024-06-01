function getUserByEmail(db, email, callback) {
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) {
          return callback(err, null);
        }
        callback(null, row);
    });
}

module.exports = {
    getUserByEmail: getUserByEmail
};
