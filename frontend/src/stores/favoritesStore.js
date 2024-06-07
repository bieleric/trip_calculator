import { updateFavorite } from '@/services/apiRequests'
import { defineStore } from 'pinia'

const getDefaultState = () => {
    return {
        favorites: [],
    }
}

export const useFavoritesStore = defineStore('favoritesStore', {
    state: () => getDefaultState(),
    getters: {
        getFavorites: (state) => state.favorites,
        getFavoriteById: (state) => (id) => {
            return state.favorites.find(favorite => favorite.id === Number(id))
        }
    },
    actions: {
        setupFavoritesStore(data) {
            data.forEach((favorite) => {
                this.favorites.push(favorite);
            })
        },
        addFavorite(favorite) {
            this.favorites.push(favorite);
        },
        updateFavorite(favorite) {
            this.favorites.find(oldFavorite => {
                if(oldFavorite.id === Number(favorite.id)) {
                    oldFavorite.transport = favorite.transport;
                    oldFavorite.start = favorite.start;
                    oldFavorite.destination = favorite.destination;
                    oldFavorite.costs = favorite.costs;
                    oldFavorite.distance = favorite.distance;
                    oldFavorite.single_trip = favorite.singleSingle;
                }
            });
        },
        deleteFavorite(id) {
            this.favorites = this.favorites.filter(favorite => favorite.id !== id);
        },
        resetStore() {
            Object.assign(this, getDefaultState());
        }
    }
})