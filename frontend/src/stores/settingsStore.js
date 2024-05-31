import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settingsStore', {
    state: () => ({
        primary_color: '#369551',
        secondary_color: '#FFFFFF',
        budget: '500'
    }),
    getters: {
        getPrimaryColor: (state) => state.primary_color,
        getSecondaryColor: (state) => state.secondary_color,
        getPrimaryColorInRGBA: (state) => state.hexToRgba(state.primary_color),
        getSecondaryColorInRGBA: (state) => state.hexToRgba(state.secondary_color)
    },
    actions: {
        setupSettings(data) {
            this.primary_color = data.primary_color;
            this.secondary_color = data.secondary_color;
            this.budget = data.budget;
        },
        hexToRgba(hex) {
            // rgba(54, 149, 81, 0.6)
            hex = hex.replace(/^#/, '');
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            return `rgba(${r},${g},${b}, 0.6)`;
        }

    }
})