const cron = require('node-cron');
const { getAllGroups, getLatestClosingByGroupId, insertClosing } = require('./databaseQueries');


const getGroups = (db) => {
    try {
        return new Promise((resolve, reject) => {
            db.all(getAllGroups, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    } catch (error) {
        console.error('Error fetching groups:', error.message);
    }
}

const getLatestClosing = (db, groupId) => {
    try {
        return new Promise((resolve, reject) => {
            db.get(getLatestClosingByGroupId, [groupId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    } catch (error) {
        console.error('Error fetching latest group:', error.message);
    }
}

// execute cron job at the 1st of every month at 3:30am and add one new closing period to every group
const initializeCronJobForUpdatingClosings = async (db) => {
    cron.schedule('30 3 1 * *', async () => {
        const groups = await getGroups(db);

        groups.forEach(async (group) => {
            const latestClosing = await getLatestClosing(db, group.id);

            if(latestClosing) {
                const latestClosingPeriod = new Date(latestClosing.period)
                const newClosingPeriodDateString = new Date(latestClosingPeriod.setMonth(latestClosingPeriod.getMonth() + 1)).toDateString();

                db.run(insertClosing, [newClosingPeriodDateString, 0, latestClosing.budget, latestClosing.price_per_kilometer, group.id], (err) => {
                    if (err) {
                      console.error('Could not insert closing to group: ', err.message);
                      return;
                    }
                    
                    console.log(`Cronjob executed! Added new closing period ${newClosingPeriodDateString} to group with id: ${group.id}`);
                    return;
                });
            }
        });
    });
    console.log('Cronjob initialized');
}

module.exports = {
    initializeCronJobForUpdatingClosings
};