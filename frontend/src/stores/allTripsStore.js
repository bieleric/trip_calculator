import { defineStore } from 'pinia'
import { useSettingsStore } from './settingsStore';
import { useUserStore } from './userStore';

const getDefaultState = () => {
    return {
        allTrips: [],
        monthNames: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'September', 'Oktober', 'November', 'Dezember']
    }
}

export const useAllTripsStore = defineStore('allTripsStore', {
    state: () => getDefaultState(),
    getters: {
        getAllTrips: (state) => state.allTrips,
        getAllTripsClassified: (state) => {
            const classifiedTrips = {};

            state.allTrips.forEach((trip) => {
                const date = new Date(trip.date);
                const monthYear = `${state.monthNames[date.getMonth()]} ${date.getFullYear()}`;

                if(!classifiedTrips[monthYear]) {
                    classifiedTrips[monthYear] = { title: monthYear, trips: []}
                }

                classifiedTrips[monthYear].trips.push(trip);
            });

            let classifiedArray = Object.values(classifiedTrips).map(entry => {
                entry.trips.sort((a, b) => new Date(b.date) - new Date(a.date));
                return entry;
            });

            classifiedArray.sort((a, b) => {
                const [monthA, yearA] = a.title.split(' ');
                const [monthB, yearB] = b.title.split(' ');
                const dateA = new Date(`${yearA}-${state.monthNames.indexOf(monthA) + 1}-01`);
                const dateB = new Date(`${yearB}-${state.monthNames.indexOf(monthB) + 1}-01`);
                return dateB - dateA;
            });

            return classifiedArray;
        },
        getTripsOfCurrentMonth: (state) => {
            return state.getAllMyTripsClassified.filter(tripMonth => {
                const [month, year] = tripMonth.title.split(' ');
                const date = new Date(`${year}-${state.monthNames.indexOf(month) + 1}-01`);
                return date.getMonth() === new Date().getMonth();
            });
        },
        getTripsOfLastMonth: (state) => {
            return state.getAllMyTripsClassified.filter(tripMonth => {
                const [month, year] = tripMonth.title.split(' ');
                const date = new Date(`${year}-${state.monthNames.indexOf(month) + 1}-01`);
                return date.getMonth() === new Date().getMonth() - 1;
            });
        },
        getCostsOfMonthByMonthName: (state) => {
            return (monthName) => {
                const settingsStore = useSettingsStore();
                const tripsOfMonth = state.getAllTripsClassified.find(month => month.title === monthName)
                let costsOfMonth = 0;
                if(tripsOfMonth) {
                    tripsOfMonth.trips.forEach(trip => {
                        if(trip.costs) {
                            costsOfMonth += trip.single_trip ? trip.costs : 2 * trip.costs;
                        }
                        else if(trip.distance) {
                            costsOfMonth += trip.single_trip ? settingsStore.getPricePerKilometer * trip.distance : 2 * settingsStore.getPricePerKilometer * trip.distance;
                        } 
                    });
                }

                return costsOfMonth.toFixed(2);
            }
        },
        getTripsOfMonthByMonthName: (state) => {
            return (monthName) => {
                const userStore = useUserStore();
                const tripsOfMonth = state.getAllTripsClassified.find(month => month.title === monthName);

                // add user name by id
                if(tripsOfMonth) {
                    tripsOfMonth.trips.forEach(trip => {
                        const userOfTrip = userStore.getActiveUsers.find(activeUser => activeUser.id === trip.user_id);
                        trip.userName = userOfTrip.name;
                    });
                }
                return tripsOfMonth ? tripsOfMonth.trips : [];
            }
        },
        getTripsClassifiedByUserForMonthAndYear: (state) => {
            const userStore = useUserStore();

            return (monthName, year) => {
                const monthIndex = state.monthNames.indexOf(monthName);
                const classifiedByUser = {};
        
                state.allTrips.forEach((trip) => {
                    const tripDate = new Date(trip.date);
                    const tripMonth = tripDate.getMonth();
                    const tripYear = tripDate.getFullYear();
        
                    if (tripMonth === monthIndex && tripYear === year) {
                        const user = userStore.getActiveUsers.find(user => user.id === trip.user_id);
                        const userName = user ? user.name : 'Unknown User';
        
                        if (!classifiedByUser[userName]) {
                            classifiedByUser[userName] = { title: userName, trips: [] };
                        }
                        
                        classifiedByUser[userName].trips.push(trip);
                    }
                });
        
                return Object.values(classifiedByUser);
            };
        },
        getCostsByUserForMonth: (state) => {
            const settingsStore = useSettingsStore();
            return (userName, month, year) => {
                const classifiedByUser = state.getTripsClassifiedByUserForMonthAndYear(month, year);
                let costs = 0;
                classifiedByUser.map(user => {
                    if(userName.title === user.title) {
                        user.trips.forEach(trip => {
                            if(trip.costs) {
                                costs += trip.single_trip ? trip.costs : 2 * trip.costs;
                            }
                            else if(trip.distance) {
                                costs += trip.single_trip ? settingsStore.getPricePerKilometer * trip.distance : 2 * settingsStore.getPricePerKilometer * trip.distance;
                            }
                        });
                    }
                });
                return costs.toFixed(2);
            }
        },
        getPendingAmountOfMoneyByUserForMonth: (state) => {
            const settingsStore = useSettingsStore();
            return (userName, month, year) => {
                const costsOfMonthByMonthName = state.getCostsOfMonthByMonthName(month + ' ' + year);
                const costsByUserForMonth = state.getCostsByUserForMonth(userName, month, year);
                if(settingsStore.getBudget === 0 || costsOfMonthByMonthName <= settingsStore.getBudget) {
                    return costsByUserForMonth;
                }
                else if(costsOfMonthByMonthName > settingsStore.getBudget) {
                    const pendingPercentageOfUser = costsByUserForMonth / costsOfMonthByMonthName;
                    return (pendingPercentageOfUser * settingsStore.getBudget).toFixed(2);
                }           
            }
        }
    },
    actions: {
        setupAllTripsStore(data) {
            data.forEach((trip) => {
                this.allTrips.push(trip);
            })
        },
        addTrip(trip) {
            this.allTrips.push(trip);
        },
        updateTrip(trip) {
            this.allTrips.find(oldTrip => {
                if(oldTrip.id === Number(trip.id)) {
                    oldTrip.transport = trip.transport;
                    oldTrip.start = trip.start;
                    oldTrip.destination = trip.destination;
                    oldTrip.costs = trip.costs;
                    oldTrip.distance = trip.distance;
                    oldTrip.date = trip.date;
                    oldTrip.single_trip = trip.singleSingle;
                }
            });
        },
        deleteTrip(id) {
            this.allTrips = this.allTrips.filter(trip => trip.id !== id);
        },
        resetStore() {
            Object.assign(this, getDefaultState());
        }
    }
})