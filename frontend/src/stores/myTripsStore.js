import { defineStore } from 'pinia'

const getDefaultState = () => {
    return {
        myTrips: [],
        monthNames: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'September', 'Oktober', 'November', 'Dezember']
    }
}

export const useMyTripsStore = defineStore('myTripsStore', {
    state: () => getDefaultState(),
    getters: {
        getAllMyTrips: (state) => state.myTrips,
        getAllMyTripsClassified: (state) => {
            const classifiedTrips = {};

            state.myTrips.forEach((trip) => {
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

    },
    actions: {
        setupMyTripsStore(data) {
            data.forEach((trip) => {
                this.myTrips.push(trip);
            })
        },
        addTrip(trip) {
            this.myTrips.push(trip);
        },
        updateTrip(trip) {
            this.myTrips.find(oldTrip => {
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
            this.myTrips = this.myTrips.filter(trip => trip.id !== id);
        },
        resetStore() {
            Object.assign(this, getDefaultState());
        }
    }
})