import { defineStore } from 'pinia'

const getDefaultState = () => {
    return {
        primaryColor: '',
        secondaryColor: '',
        budget: 0,
        unlimitedBudget: null,
        pricePerKilometer: 0, 
    }
}

export const useSettingsStore = defineStore('settingsStore', {
    state: () => getDefaultState(),
    getters: {
        getPrimaryColor: (state) => state.primaryColor,
        getSecondaryColor: (state) => state.secondaryColor,
        getPrimaryColorInRGBA: (state) => state.hexToRgba(state.primaryColor),
        getSecondaryColorInRGBA: (state) => state.hexToRgba(state.secondaryColor),
        getBudget: (state) => state.budget,
        getPricePerKilometer: (state) => state.pricePerKilometer,
        getUnlimitedBudget: (state) => state.unlimitedBudget
    },
    actions: {
        setupSettingsStore(data) {
            this.primaryColor = data.primary_color;
            this.secondaryColor = data.secondary_color;
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
        hexToRgba(hex) {
            // rgba(54, 149, 81, 0.6)
            hex = hex.replace(/^#/, '');
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            return `rgba(${r},${g},${b}, 0.6)`;
        },
        resetStore() {
            Object.assign(this, getDefaultState());
        }
    }
})