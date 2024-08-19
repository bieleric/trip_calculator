const cron = require('node-cron');
const { createTriggerForGroupCreation } = require('./databaseQueries');


const initializeDatabaseTriggers = async (db) => {

    // Trigger for closing insertion after group creation
    db.serialize(() => {
        db.run(createTriggerForGroupCreation, (err) => {
            if (err) {
                return console.error("Trigger creation failed:", err.message);
            }
            console.log("Trigger created successfully");
        });
    });
}

module.exports = {
    initializeDatabaseTriggers
};