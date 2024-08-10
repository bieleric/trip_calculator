import axios from "axios";
import { useSettingsStore } from "@/stores/settingsStore";
import { useUserStore } from "@/stores/userStore";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { useAllTripsStore } from "@/stores/allTripsStore";
import { useClosingsStore } from "@/stores/closingsStore";

const apiKey = import.meta.env.VITE_API_KEY;
const backendHost = import.meta.env.VITE_BACKEND;

// fetch data
export const fetchAllData = async () => {
    try {
        await fetchAdminSettings();
        await fetchAllUsers();
        await fetchFavoritesOfUser();
        await fetchClosings();
        await fetchAllTrips();
    } catch (err) {
        throw new Error('Could not fetch data');
    };
}

export const fetchAdminSettings = async () => {
    return axios.get(`${backendHost}/api/adminSettings`, {
        headers: {
            'x-api-key': apiKey,
            'Authorization': localStorage.getItem('jwt')
        }
    })
    .then(response => {
        const settingsStore = useSettingsStore();
        settingsStore.setupSettingsStore(response.data.settings[0]);
    })
    .catch(err => {
        console.error('Fehler beim Abrufen der Daten:', err);
        throw err;
    });
};

export const fetchAllUsers = async () => {
    return axios.get(`${backendHost}/api/users`, {
      headers: {
        'x-api-key': apiKey,
        'Authorization': localStorage.getItem('jwt')
      }
    })
    .then(response => {
        const userStore = useUserStore();
        userStore.setupUsersStore(response.data.users)
    })
    .catch(err => {
        console.error('Fehler beim Abrufen der Daten:', err);
        throw err;
    });
};

export const fetchFavoritesOfUser = async () => {
    return axios.get(`${backendHost}/api/favorites`, {
      headers: {
        'x-api-key': apiKey,
        'Authorization': localStorage.getItem('jwt')
      }
    })
    .then(response => {
        const favoritesStore = useFavoritesStore();
        favoritesStore.setupFavoritesStore(response.data.favorites);
    })
    .catch(err => {
        console.error('Fehler beim Abrufen der Daten:', err);
        throw err;
    });
};

export const fetchAllTrips = async () => {
    return axios.get(`${backendHost}/api/trips`, {
      headers: {
        'x-api-key': apiKey,
        'Authorization': localStorage.getItem('jwt')
      }
    })
    .then(response => {
        const allTripsStore = useAllTripsStore();
        allTripsStore.setupAllTripsStore(response.data.allTrips);
    })
    .catch(err => {
        console.error('Fehler beim Abrufen der Daten:', err);
        throw err;
    });
};

export const fetchClosings = async () => {
    return axios.get(`${backendHost}/api/closings`, {
      headers: {
        'x-api-key': apiKey,
        'Authorization': localStorage.getItem('jwt')
      }
    })
    .then(response => {
        const closingsStore = useClosingsStore();
        closingsStore.setupClosingsStore(response.data.closings);
    })
    .catch(err => {
        console.error('Fehler beim Abrufen der Daten:', err);
        throw err;
    });
};

// User Endpoints
export const removeUserFromGroup = async (userId) => {
    return axios.post(`${backendHost}/api/users/removeUser`, {
        userId: userId
    }, {
        headers: {
            'x-api-key': apiKey,
            'Authorization': localStorage.getItem('jwt')
        }
    })
    .then(response => {
        const userStore = useUserStore();
        userStore.deleteUser(userId);
    })
    .catch(err => {
        console.error('Fehler beim Entfernen des Nutzers:', err);
        throw err;
    });
};

export const deleteUser = async (userId) => {
    return axios.delete(`${backendHost}/api/users/${userId}`, {
        headers: {
            'x-api-key': apiKey,
            'Authorization': localStorage.getItem('jwt')
        }
    })
    .then(response => {
        const userStore = useUserStore();
        userStore.deleteUser(userId);
    })
    .catch(err => {
        console.error('Fehler beim Löschen des Nutzers:', err);
        throw err;
    });
};

export const createInvitation = async (groupId) => {
    return axios.post(`${backendHost}/api/createInvitation`, {
        groupId: groupId
    }, {
        headers: {
            'x-api-key': apiKey,
            'Authorization': localStorage.getItem('jwt')
        }
    })
    .then(response => {
        return response.data.invitationLink;
    })
    .catch(err => {
        console.error('Fehler beim Erstellen des Links:', err);
        throw err;
    });
};

export const joinGroup = async (token, email) => {
    return axios.post(`${backendHost}/api/groups/joinGroup`, {
        token: token,
        email: email
    }, {
        headers: {
            'x-api-key': apiKey,
            'Authorization': localStorage.getItem('jwt')
        }
    })
    .then(response => {
        console.log(response.data);
    })
    .catch(err => {
        console.error('Fehler beim Beitreten der Gruppe:', err);
        throw err;
    });
};

// Trip Endpoints
export const addTrip = async (transport, start, destination, costs, distance, singleTrip, date, favorites) => {
    return axios.post(`${backendHost}/api/trips`, {
        transport: transport,
        start: start,
        destination: destination,
        costs: costs,
        distance: distance,
        singleTrip: singleTrip,
        date: date,
        favorites: favorites
    }, {
        headers: {
            'x-api-key': apiKey,
            'Authorization': localStorage.getItem('jwt')
        }
    })
    .then(response => {
        if(favorites) {
            const favoritesStore = useFavoritesStore();
            favoritesStore.addFavorite(response.data.favorite);
        }

        const allTripsStore = useAllTripsStore();
        allTripsStore.addTrip(response.data.trip);
    })
    .catch(err => {
        console.error('Fehler beim Hinzufügen der Fahrt:', err);
        throw err;
    });
};

export const deleteTrip = async (id) => {
    return axios.delete(`${backendHost}/api/trips/${id}`, {
        headers: {
            'x-api-key': apiKey,
            'Authorization': localStorage.getItem('jwt')
        }
    })
    .then(response => {
        const allTripsStore = useAllTripsStore();
        allTripsStore.deleteTrip(id);
    })
    .catch(err => {
        console.error('Fehler beim Löschen der Fahrt:', err);
        throw err;
    });
};

export const updateTrip = async (id, transport, start, destination, costs, distance, singleTrip, date) => {
    return axios.post(`${backendHost}/api/trips/${id}`, {
        transport: transport,
        start: start,
        destination: destination,
        costs: costs,
        distance: distance,
        date: date,
        singleTrip: singleTrip ? 1 : 0,
    }, {
        headers: {
            'x-api-key': apiKey,
            'Authorization': localStorage.getItem('jwt')
        }
    })
    .then(response => {
        const allTripsStore = useAllTripsStore();
        allTripsStore.updateTrip({
            id: id,
            transport: transport,
            start: start,
            destination: destination,
            costs: costs,
            distance: distance,
            date: date,
            singleTrip: singleTrip ? 1 : 0,
        });
    })
    .catch(err => {
        console.error('Fehler beim Update des Trips:', err);
        throw err;
    });
};

// Favorites Endpoints
export const deleteFavorite = async (id) => {
    return axios.delete(`${backendHost}/api/favorites/${id}`, {
        headers: {
            'x-api-key': apiKey,
            'Authorization': localStorage.getItem('jwt')
        }
    })
    .then(response => {
        const favoritesStore = useFavoritesStore();
        favoritesStore.deleteFavorite(id);
    })
    .catch(err => {
        console.error('Fehler beim Löschen des Favoriten:', err);
        throw err;
    });
};

export const updateFavorite = async (id, transport, start, destination, costs, distance, singleTrip) => {
    return axios.post(`${backendHost}/api/favorites/${id}`, {
        transport: transport,
        start: start,
        destination: destination,
        costs: costs,
        distance: distance,
        singleTrip: singleTrip,
    }, {
        headers: {
            'x-api-key': apiKey,
            'Authorization': localStorage.getItem('jwt')
        }
    })
    .then(response => {
        const favoritesStore = useFavoritesStore();
        favoritesStore.updateFavorite({
            id: id,
            transport: transport,
            start: start,
            destination: destination,
            costs: costs,
            distance: distance,
            singleTrip: singleTrip,
        });
    })
    .catch(err => {
        console.error('Fehler beim Update des Favoriten:', err);
        throw err;
    });
};

// Admin Settings Endpoints
export const updateFinanceSettings = async (budget, pricePerKilometer) => {
    return axios.post(`${backendHost}/api/adminSettings`, {
        budget: budget,
        pricePerKilometer: pricePerKilometer,
    }, {
        headers: {
            'x-api-key': apiKey,
            'Authorization': localStorage.getItem('jwt')
        }
    })
    .then(response => {
        const settingsStore = useSettingsStore();
        settingsStore.updateSettings({
            budget: budget,
            pricePerKilometer: pricePerKilometer,
        });
    })
    .catch(err => {
        console.error('Fehler beim Update des Finanzeinstellungen:', err);
        throw err;
    });
};

// Closings Endpoints
export const addClosing = async (period, budget, pricePerKilometer) => {
    return axios.post(`${backendHost}/api/closings`, {
        period: period,
        closed: 1,
        budget: budget,
        pricePerKilometer: pricePerKilometer
    }, {
        headers: {
            'x-api-key': apiKey,
            'Authorization': localStorage.getItem('jwt')
        }
    })
    .then(response => {
        const closingStore = useClosingsStore();
        closingStore.addClosing(response.data.closing);
    })
    .catch(err => {
        console.error('Fehler beim Hinzufügen des Abschlusses:', err);
        throw err;
    });
};

export const deleteClosing = async (id) => {
    return axios.delete(`${backendHost}/api/closings/${id}`, {
        headers: {
            'x-api-key': apiKey,
            'Authorization': localStorage.getItem('jwt')
        }
    })
    .then(response => {
        const closingsStore = useClosingsStore();
        closingsStore.deleteClosing(id);
    })
    .catch(err => {
        console.error('Fehler beim Löschen des Abschlusses:', err);
        throw err;
    });
};