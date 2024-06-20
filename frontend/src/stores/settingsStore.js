import { defineStore } from 'pinia'

const getDefaultState = () => {
    return {
        budget: 0,
        unlimitedBudget: null,
        pricePerKilometer: 0, 
    }
}

export const useSettingsStore = defineStore('settingsStore', {
    state: () => getDefaultState(),
    getters: {
        getBudget: (state) => state.budget,
        getPricePerKilometer: (state) => state.pricePerKilometer,
        getUnlimitedBudget: (state) => state.unlimitedBudget
    },
    actions: {
        setupSettingsStore(data) {
            this.budget = data.budget;
            this.pricePerKilometer = data.price_per_kilometer;
        },
        updateSettings(data) {
            this.budget = data.budget;
            this.pricePerKilometer = data.pricePerKilometer;
        },
        setBudget(budget) {
            this.budget = budget;
        },
        setUnlimitedBudget(value) {
            this.unlimitedBudget = value;
        },
        setPricePerKilometer(pricePerKilometer) {
            this.pricePerKilometer = pricePerKilometer;
        },
        resetStore() {
            Object.assign(this, getDefaultState());
        }
    }
})