import axios from "axios";
import { useSettingsStore } from "@/stores/settingsStore";
import { useUserStore } from "@/stores/userStore";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { useAllTripsStore } from "@/stores/allTripsStore";
import { useClosingsStore } from "@/stores/closingsStore";
import { getUser } from "./helpers";

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
        console.error('Fehler beim Abrufen der Daten:', err);
        return false;
    };
}

export const fetchAdminSettings = async () => {
    axios.get(`${backendHost}/api/adminSettings`, {
        headers: {
            'x-api-key': apiKey,
            'Authorization': localStorage.getItem('jwt')
        }
    })
    .then(response => {
        const settingsStore = useSettingsStore();
        settingsStore.setupSettingsStore(response.data.settings[0])
    })
    .catch(err => {
        console.error('Fehler beim Abrufen der Daten:', err);
    });
};

export const fetchAllUsers = async () => {
    axios.get(`${backendHost}/api/users`, {
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
    });
};

export const fetchFavoritesOfUser = async () => {
    axios.get(`${backendHost}/api/favorites`, {
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
    });
};

export const fetchAllTrips = async () => {
    axios.get(`${backendHost}/api/trips`, {
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
    });
};

export const fetchClosings = async () => {
    axios.get(`${backendHost}/api/closings`, {
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
    });
};

// User Endpoints
export const deleteUser = async (userId) => {
    axios.delete(`${backendHost}/api/users/${userId}`, {
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
        console.error('Fehler beim Löschen des Nutzers:', err)
    });
};

export const inviteUser = async (email, name, role, group) => {
    axios.post(`${backendHost}/api/users`, {
        email: email.value,
        name: name.value,
        role: role.value,
        group: group
    }, {
        headers: {
            'x-api-key': apiKey,
            'Authorization': localStorage.getItem('jwt')
        }
    })
    .then(response => {
        const userStore = useUserStore();
        userStore.addUser(email.value, name.value, role.value, 0);
    })
    .catch(err => {
        console.error('Fehler beim Einladen des Nutzers:', err);
    });
};

// Trip Endpoints
export const addTrip = async (transport, start, destination, costs, distance, singleTrip, date, favorites) => {
    axios.post(`${backendHost}/api/trips`, {
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
    });
};

export const deleteTrip = async (id) => {
    axios.delete(`${backendHost}/api/trips/${id}`, {
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
        console.error('Fehler beim Löschen der Fahrt:', err)
    });
};

export const updateTrip = async (id, transport, start, destination, costs, distance, singleTrip, date) => {
    axios.post(`${backendHost}/api/trips/${id}`, {
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
        console.error('Fehler beim Update des Trips:', err)
    });
};

// Favorites Endpoints
export const deleteFavorite = async (id) => {
    axios.delete(`${backendHost}/api/favorites/${id}`, {
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
        console.error('Fehler beim Löschen des Favoriten:', err)
    });
};

export const updateFavorite = async (id, transport, start, destination, costs, distance, singleTrip) => {
    axios.post(`${backendHost}/api/favorites/${id}`, {
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
        console.error('Fehler beim Update des Favoriten:', err)
    });
};

// Admin Settings Endpoints
export const updateFinanceSettings = async (budget, pricePerKilometer) => {
    axios.post(`${backendHost}/api/adminSettings`, {
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
        console.error('Fehler beim Update des Finanzeinstellungen:', err)
    });
};

// Closings Endpoints
export const addClosing = async (period, budget, pricePerKilometer) => {
    axios.post(`${backendHost}/api/closings`, {
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
        console.error('Fehler beim Hinzufügen des Abschlusses:', err)
    });
};

export const deleteClosing = async (id) => {
    axios.delete(`${backendHost}/api/closings/${id}`, {
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
        console.error('Fehler beim Löschen des Abschlusses:', err)
    });
};