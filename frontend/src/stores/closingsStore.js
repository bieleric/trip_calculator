import { defineStore } from 'pinia'

const getDefaultState = () => {
    return {
        closings: [],
    }
}

export const useClosingsStore = defineStore('closingsStore', {
    state: () => getDefaultState(),
    getters: {
        getAllClosings: (state) => state.closings,
        getClosingByMonthAndYear: (state) => {
            return (month, year) => {
                return state.getAllClosings.find(closing => {
                    const closingMonth = new Date(closing.period).getMonth() + 1;
                    const closingYear = new Date(closing.period).getFullYear();
                    return closingMonth === month && closingYear === year;
                })
            }
        }
    },
    actions: {
        setupClosingsStore(data) {
            data.forEach((closing) => {
                this.closings.push(closing);
            })
        },
        addClosing(data) {
            this.closings.push(data);
        },
        deleteClosing(id) {
            this.closings = this.closings.filter(closing => closing.id !== id);
        },
        resetStore() {
            Object.assign(this, getDefaultState());
        }
    }
})