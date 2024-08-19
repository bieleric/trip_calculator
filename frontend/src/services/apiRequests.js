import axios from "axios";
import { useSettingsStore } from "@/stores/settingsStore";
import { useUserStore } from "@/stores/userStore";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { useAllTripsStore } from "@/stores/allTripsStore";
import { useClosingsStore } from "@/stores/closingsStore";
import { useGroupAndRoleStore } from "@/stores/groupAndRoleStore";
import { getUser } from "./helpers";

const apiKey = import.meta.env.VITE_API_KEY;
const backendHost = import.meta.env.VITE_BACKEND;

export const fetchAllDataByGroup = async (groupId) => {
    try {
        await fetchAdminSettingsByGroup(groupId);
        await fetchAllUsersByGroup(groupId);
        await fetchFavoritesOfUserByGroup(groupId);
        await fetchClosingsByGroup(groupId);
        await fetchAllTripsByGroup(groupId);
        await fetchGroupsOfUser();
    } catch (err) {
        console.error('Could not fetch data: ', err)
        throw new Error('Could not fetch data');
    };
}

export const fetchAdminSettingsByGroup = async (groupId) => {
    return axios.get(`${backendHost}/api/adminSettings/${groupId}`, {
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

export const fetchAllUsersByGroup = async (groupId) => {
    return axios.get(`${backendHost}/api/users/${groupId}`, {
      headers: {
        'x-api-key': apiKey,
        'Authorization': localStorage.getItem('jwt')
      }
    })
    .then(response => {
        const userStore = useUserStore();
        userStore.setupUsersStore(response.data.users);
    })
    .catch(err => {
        console.error('Fehler beim Abrufen der Daten:', err);
        throw err;
    });
};

export const fetchFavoritesOfUserByGroup = async (groupId) => {
    return axios.get(`${backendHost}/api/favorites/${groupId}`, {
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

export const fetchAllTripsByGroup = async (groupId) => {
    return axios.get(`${backendHost}/api/trips/${groupId}`, {
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

export const fetchClosingsByGroup = async (groupId) => {
    return axios.get(`${backendHost}/api/closings/${groupId}`, {
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

export const fetchGroupsOfUser = async () => {
    return axios.get(`${backendHost}/api/groups`, {
      headers: {
        'x-api-key': apiKey,
        'Authorization': localStorage.getItem('jwt')
      }
    })
    .then(response => {
        const groupAndRoleStore = useGroupAndRoleStore();
        groupAndRoleStore.setupGroupAndRoleStore(response.data.groups);
    })
    .catch(err => {
        console.error('Fehler beim Abrufen der Daten:', err);
        throw err;
    });
};

// User Endpoints
export const removeUserFromGroup = async (userId, groupId) => {
    return axios.post(`${backendHost}/api/users/removeUser`, {
        userId: userId,
        groupId: groupId
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

// TODO: is this still neccessary? -> Yes for account deletion
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

// Group endpoints
export const createInvitation = async (groupId) => {
    return axios.post(`${backendHost}/api/groups/createInvitation`, {
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

export const setSelectedGroup = async (groupId) => {
    return axios.post(`${backendHost}/api/groups/select`, {
        groupId: groupId
    }, {
        headers: {
            'x-api-key': apiKey,
            'Authorization': localStorage.getItem('jwt')
        }
    })
    .then(response => {
        const groupAndRoleStore = useGroupAndRoleStore();
        groupAndRoleStore.updateCurrentGroupAndRole(groupId);
    })
    .catch(err => {
        console.error('Fehler beim Beitreten der Gruppe:', err);
        throw err;
    });
};

export const leaveGroupByGroupId = async (groupId) => {
    return axios.post(`${backendHost}/api/groups/leave`, {
        groupId: groupId
    }, {
        headers: {
            'x-api-key': apiKey,
            'Authorization': localStorage.getItem('jwt')
        }
    })
    .then(response => {
        const groupAndRoleStore = useGroupAndRoleStore();
        groupAndRoleStore.removeGroupByGroupId(groupId);
    })
    .catch(err => {
        console.error('Fehler beim Verlassen der Gruppe:', err);
        throw err;
    });
};

// Trip Endpoints
// Add new trip to group with favorite or without
export const addTripToGroup = async (transport, start, destination, costs, distance, singleTrip, date, favorites) => {
    const currentUser = getUser();
    const userStore = useUserStore();
    const groupAndRoleStore = useGroupAndRoleStore();
    const currentGroupId = groupAndRoleStore.getCurrentGroup.group_id;
    const userName = userStore.getAllUsers.find((user) => user.id === currentUser.userId).name;

    return axios.post(`${backendHost}/api/trips`, {
        groupId: currentGroupId,
        userName: userName,
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

export const deleteTrip = async (tripId) => {
    const groupAndRoleStore = useGroupAndRoleStore();
    const currentGroupId = groupAndRoleStore.getCurrentGroup.group_id;

    return axios.delete(`${backendHost}/api/trips/${tripId}/group/${currentGroupId}`, {
        headers: {
            'x-api-key': apiKey,
            'Authorization': localStorage.getItem('jwt')
        }
    })
    .then(response => {
        const allTripsStore = useAllTripsStore();
        allTripsStore.deleteTrip(tripId);
    })
    .catch(err => {
        console.error('Fehler beim Löschen der Fahrt:', err);
        throw err;
    });
};

export const updateTrip = async (tripId, transport, start, destination, costs, distance, singleTrip, date) => {
    const groupAndRoleStore = useGroupAndRoleStore();
    const currentGroupId = groupAndRoleStore.getCurrentGroup.group_id;

    return axios.post(`${backendHost}/api/trips/${tripId}`, {
        transport: transport,
        start: start,
        destination: destination,
        costs: costs,
        distance: distance,
        date: date,
        singleTrip: singleTrip ? 1 : 0,
        groupId: currentGroupId
    }, {
        headers: {
            'x-api-key': apiKey,
            'Authorization': localStorage.getItem('jwt')
        }
    })
    .then(response => {
        const allTripsStore = useAllTripsStore();
        allTripsStore.updateTrip({
            id: tripId,
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
export const deleteFavorite = async (favoriteId) => {
    const groupAndRoleStore = useGroupAndRoleStore();
    const currentGroupId = groupAndRoleStore.getCurrentGroup.group_id;

    return axios.delete(`${backendHost}/api/favorites/${favoriteId}/group/${currentGroupId}`, {
        headers: {
            'x-api-key': apiKey,
            'Authorization': localStorage.getItem('jwt')
        }
    })
    .then(response => {
        const favoritesStore = useFavoritesStore();
        favoritesStore.deleteFavorite(favoriteId);
    })
    .catch(err => {
        console.error('Fehler beim Löschen des Favoriten:', err);
        throw err;
    });
};

export const updateFavorite = async (id, transport, start, destination, costs, distance, singleTrip) => {
    const groupAndRoleStore = useGroupAndRoleStore();
    const currentGroupId = groupAndRoleStore.getCurrentGroup.group_id;

    return axios.post(`${backendHost}/api/favorites/${id}`, {
        transport: transport,
        start: start,
        destination: destination,
        costs: costs,
        distance: distance,
        singleTrip: singleTrip,
        groupId: currentGroupId
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
    const groupAndRoleStore = useGroupAndRoleStore();
    const currentGroupId = groupAndRoleStore.getCurrentGroup.group_id;

    return axios.post(`${backendHost}/api/adminSettings`, {
        budget: budget,
        pricePerKilometer: pricePerKilometer,
        groupId: currentGroupId
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
export const closeClosing = async (closingId) => {
    const groupAndRoleStore = useGroupAndRoleStore();
    const currentGroupId = groupAndRoleStore.getCurrentGroup.group_id;

    return axios.post(`${backendHost}/api/closings/close`, {
        closingId: closingId,
        groupId: currentGroupId
    }, {
        headers: {
            'x-api-key': apiKey,
            'Authorization': localStorage.getItem('jwt')
        }
    })
    .then(response => {
        const closingStore = useClosingsStore();
        closingStore.updateClosingByClosingId(closingId, 1);
    })
    .catch(err => {
        console.error('Fehler beim Schließen des Abschlusses:', err);
        throw err;
    });
};

export const openClosing = async (closingId) => {
    const groupAndRoleStore = useGroupAndRoleStore();
    const currentGroupId = groupAndRoleStore.getCurrentGroup.group_id;

    return axios.post(`${backendHost}/api/closings/open`, {
        closingId: closingId,
        groupId: currentGroupId
    }, {
        headers: {
            'x-api-key': apiKey,
            'Authorization': localStorage.getItem('jwt')
        }
    })
    .then(response => {
        const closingsStore = useClosingsStore();
        closingsStore.updateClosingByClosingId(closingId, 0);
    })
    .catch(err => {
        console.error('Fehler beim Öffnen des Abschlusses:', err);
        throw err;
    });
};