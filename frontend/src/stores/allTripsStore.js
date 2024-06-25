import { defineStore } from 'pinia'
import { useSettingsStore } from './settingsStore';
import { useClosingsStore } from './closingsStore';
import { useUserStore } from './userStore';
import { getMonthAsNumeral, getMonthsNames, getUser } from '@/services/helpers';

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
        getAllTripsClassifiedByMonthAndYear: (state) => {
            const classifiedTrips = {};

            state.getAllTrips.forEach((trip) => {
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
        getAllTripsClassfiedByUser: (state) => {
            const classifiedTrips = {};

            state.getAllTrips.forEach((trip) => {
                const userStore = useUserStore();
                const userOfTrip = userStore.getActiveUsers.find(activeUser => activeUser.id === trip.user_id);

                if(!classifiedTrips[trip.user_id]) {
                    classifiedTrips[trip.user_id] = { userId: trip.user_id, userName: userOfTrip.name, trips: []}
                }

                classifiedTrips[trip.user_id].trips.push(trip);
            });

            let classifiedArray = Object.values(classifiedTrips).map(entry => {
                entry.trips.sort((a, b) => new Date(b.date) - new Date(a.date));
                return entry;
            });

            classifiedArray.sort((a, b) => a.userName.localeCompare(b.userName));

            return classifiedArray;
        },
        getTripsOfCurrentUser: (state) => {
            const currentUser = getUser();
            const tripsOfCurrentUser = [];

            state.getAllTrips.forEach(trip => {
                if(trip.user_id === currentUser.userId) {
                    tripsOfCurrentUser.push(trip);
                }
            });

            return tripsOfCurrentUser;
        },
        getTripsClassifiedByMonthAndYearForCurrentUser: (state) => {
            const classifiedTrips = {};
            const currentUser = getUser();

            state.getAllTrips.forEach((trip) => {
                const date = new Date(trip.date);
                const monthYear = `${state.monthNames[date.getMonth()]} ${date.getFullYear()}`;

                if(!classifiedTrips[monthYear]) {
                    classifiedTrips[monthYear] = { title: monthYear, userId: currentUser.userId, trips: []}
                }

                if(trip.user_id === currentUser.userId) {
                    classifiedTrips[monthYear].trips.push(trip);
                }
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
        getTripsOfCurrentMonthByCurrentUser: (state) => {
            const currentUser = getUser();
            const currentDate = new Date();
            const tripsByCurrentUser = state.getAllTripsClassfiedByUser.find(tripsByUser => tripsByUser.userId === currentUser.userId);
            const tripsOfCurrentMonthByCurrentUser = tripsByCurrentUser.trips.filter(tripByCurrentUser => {
                return new Date(tripByCurrentUser.date).getMonth() === currentDate.getMonth();
            });
            return [{
                userId: currentUser.userId,
                title: getMonthsNames()[currentDate.getMonth()] + ' ' + currentDate.getFullYear(),
                trips: tripsOfCurrentMonthByCurrentUser
            }]
        },
        getTripsOfLastMonthByCurrentUser: (state) => {
            const currentUser = getUser();
            const currentDate = new Date();
            const tripsByCurrentUser = state.getAllTripsClassfiedByUser.find(tripsByUser => tripsByUser.userId === currentUser.userId);
            const tripsOfLastMonthByCurrentUser = tripsByCurrentUser.trips.filter(tripByCurrentUser => {
                return new Date(tripByCurrentUser.date).getMonth() === new Date().getMonth() - 1;
            });
            return [{
                userId: currentUser.userId,
                title: getMonthsNames()[currentDate.getMonth() - 1] + ' ' + currentDate.getFullYear(),
                trips: tripsOfLastMonthByCurrentUser
            }]
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
                const tripsOfMonth = state.getAllTripsClassifiedByMonthAndYear.find(month => month.title === monthName)
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

                return Number(costsOfMonth).toFixed(2);
            }
        },
        getTripsOfMonthByMonthName: (state) => {
            return (monthName) => {
                const userStore = useUserStore();
                const tripsOfMonth = state.getAllTripsClassifiedByMonthAndYear.find(month => month.title === monthName);

                // add user name by id
                if(tripsOfMonth) {
                    tripsOfMonth.trips.forEach(trip => {
                        const userOfTrip = userStore.getActiveUsers.find(activeUser => activeUser.id === trip.user_id);
                        trip.userName = userOfTrip ? userOfTrip.name : 'Unknown User';
                    });
                }
                return tripsOfMonth ? tripsOfMonth.trips : [];
            }
        },
        getTripsClassifiedByUserForMonthAndYear: (state) => {
            const userStore = useUserStore();

            return (month, year) => {
                const monthIndex = getMonthAsNumeral(month) - 1;
                const classifiedByUser = {};
        
                state.allTrips.forEach((trip) => {
                    const tripDate = new Date(trip.date);
                    const tripMonth = tripDate.getMonth();
                    const tripYear = tripDate.getFullYear();

                    if (tripMonth === monthIndex && tripYear === year) {
                        if (!classifiedByUser[trip.user_name]) {
                            classifiedByUser[trip.user_name] = { title: trip.user_name, userId: trip.user_id, trips: [] };
                        }
                        
                        classifiedByUser[trip.user_name].trips.push(trip);
                    }
                });

                Object.values(classifiedByUser).forEach(user => {
                    user.trips.sort((a, b) => new Date(b.date) - new Date(a.date));
                });
        
                return Object.values(classifiedByUser);
            };
        },
        getCostsByUserForMonth: (state) => {
            const settingsStore = useSettingsStore();
            const closingsStore = useClosingsStore();

            return (userObject, month, year) => {
                const closing = closingsStore.getClosingByMonthAndYear(getMonthAsNumeral(month), Number(year));
                const pricePerKilometer = closing ? closing.price_per_kilometer : settingsStore.getPricePerKilometer;
                const classifiedByUser = state.getTripsClassifiedByUserForMonthAndYear(month, year);
                let costs = 0;

                classifiedByUser.map(user => {
                    if(userObject.userId === user.userId) {
                        user.trips.forEach(trip => {
                            if(trip.costs) {
                                costs += trip.single_trip ? trip.costs : 2 * trip.costs;
                            }
                            else if(trip.distance) {
                                costs += trip.single_trip ? pricePerKilometer * trip.distance : 2 * pricePerKilometer * trip.distance;
                            }
                        });
                    }
                });
                return costs.toFixed(2);
            }
        },
        getPendingAmountOfMoneyByUserForMonth: (state) => {
            const settingsStore = useSettingsStore();
            const closingsStore = useClosingsStore();

            return (userObject, month, year) => {
                const closing = closingsStore.getClosingByMonthAndYear(getMonthAsNumeral(month), Number(year));
                const budget = closing ? closing.budget : settingsStore.getBudget;
                const costsOfMonthByMonthName = state.getCostsOfMonthByMonthName(month + ' ' + year);
                const costsByUserForMonth = state.getCostsByUserForMonth(userObject, month, year);
                if(budget === 0 || costsOfMonthByMonthName <= budget) {
                    return costsByUserForMonth;
                }
                else if(costsOfMonthByMonthName > budget) {
                    const pendingPercentageOfUser = costsByUserForMonth / costsOfMonthByMonthName;
                    return (pendingPercentageOfUser * budget).toFixed(2);
                }           
            }
        },
        getStatsOfUserByMonthAndYear: (state) => {
            return (userObject, month, year) => {
                const tripsOfUser = state.getTripsClassifiedByUserForMonthAndYear(month, year).find(tripsOfUser => tripsOfUser.userId === userObject.userId);
                const pending = state.getPendingAmountOfMoneyByUserForMonth(userObject, month, year);
                const costs = state.getCostsByUserForMonth(userObject, month, year)

                return {
                    userName: tripsOfUser ? tripsOfUser.title : '',
                    userId: tripsOfUser ? tripsOfUser.userId : '',
                    trips: tripsOfUser ? tripsOfUser.trips : [],
                    pending: pending,
                    costs: costs
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
                    oldTrip.single_trip = trip.singleTrip ? 1 : 0;
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