import axios from "axios";
import { useSettingsStore } from "@/stores/settingsStore";
import { useUserStore } from "@/stores/userStore";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { useMyTripsStore } from "@/stores/myTripsStore";
import { useAllTripsStore } from "@/stores/allTripsStore";

const apiKey = import.meta.env.VITE_API_KEY;

export const fetchAllData = async (isAdmin) => {
    try {
        fetchAdminSettings();
        fetchAllUsers();
        fetchFavoritesOfUser();
        fetchTripsOfUser();
        if(isAdmin) {
            fetchAllTrips();
        }
    } catch (err) {
        console.error('Fehler beim Abrufen der Daten:', err);
        return false;
    };
}

export const fetchAdminSettings = async () => {
    axios.get('http://localhost:3000/api/adminSettings', {
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
    axios.get('http://localhost:3000/api/users', {
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
    axios.get('http://localhost:3000/api/favorites', {
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

export const fetchTripsOfUser = async () => {
    axios.get('http://localhost:3000/api/trips', {
      headers: {
        'x-api-key': apiKey,
        'Authorization': localStorage.getItem('jwt')
      }
    })
    .then(response => {
        const myTripsStore = useMyTripsStore();
        myTripsStore.setupMyTripsStore(response.data.myTrips);
    })
    .catch(err => {
        console.error('Fehler beim Abrufen der Daten:', err);
    });
};

export const fetchAllTrips = async () => {
    axios.get('http://localhost:3000/api/allTrips', {
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

// User Endpoints
export const deleteUser = async (email) => {
    axios.delete(`http://localhost:3000/api/users/${email}`, {
        headers: {
            'x-api-key': apiKey,
            'Authorization': localStorage.getItem('jwt')
        }
    })
    .then(response => {
        const userStore = useUserStore();
        userStore.deleteUser(email);
    })
    .catch(err => {
        console.error('Fehler beim Löschen des Nutzers:', err)
    });
};

export const inviteUser = async (email, name, role) => {
    axios.post(`http://localhost:3000/api/users`, {
        email: email.value,
        name: name.value,
        role: role.value
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
    axios.post(`http://localhost:3000/api/trips`, {
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
        const myTripsStore = useMyTripsStore();
        myTripsStore.addTrip(response.data.trip);

        const allTripsStore = useAllTripsStore();
        allTripsStore.addTrip(response.data.trip);
    })
    .catch(err => {
        console.error('Fehler beim Hinzufügen der Fahrt:', err);
    });
};

export const deleteTrip = async (id) => {
    axios.delete(`http://localhost:3000/api/trips/${id}`, {
        headers: {
            'x-api-key': apiKey,
            'Authorization': localStorage.getItem('jwt')
        }
    })
    .then(response => {
        const myTripsStore = useMyTripsStore();
        myTripsStore.deleteTrip(id);

        const allTripsStore = useAllTripsStore();
        allTripsStore.deleteTrip(id);
    })
    .catch(err => {
        console.error('Fehler beim Löschen der Fahrt:', err)
    });
};

export const updateTrip = async (id, transport, start, destination, costs, distance, singleTrip, date) => {
    axios.post(`http://localhost:3000/api/trips/${id}`, {
        transport: transport,
        start: start,
        destination: destination,
        costs: costs,
        distance: distance,
        date: date,
        singleTrip: singleTrip,
    }, {
        headers: {
            'x-api-key': apiKey,
            'Authorization': localStorage.getItem('jwt')
        }
    })
    .then(response => {
        const myTripsStore = useMyTripsStore();
        myTripsStore.updateTrip({
            id: id,
            transport: transport,
            start: start,
            destination: destination,
            costs: costs,
            distance: distance,
            date: date,
            singleTrip: singleTrip,
        });
    })
    .catch(err => {
        console.error('Fehler beim Update des Trips:', err)
    });
};

// Favorites Endpoints
export const deleteFavorite = async (id) => {
    axios.delete(`http://localhost:3000/api/favorites/${id}`, {
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
    axios.post(`http://localhost:3000/api/favorites/${id}`, {
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

export const updateFinanceSettings = async (budget, pricePerKilometer) => {
    axios.post(`http://localhost:3000/api/adminSettings`, {
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
        console.error('Fehler beim Update des Favoriten:', err)
    });
};