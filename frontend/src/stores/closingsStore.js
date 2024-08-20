import { formatDateToMonthYear } from '@/services/helpers'
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
                closing['monthYearString'] = formatDateToMonthYear(closing.period);
                this.closings.push(closing);
            });
        },
        updateClosingByClosingId(closingId, pricePerKilometer, budget, closed) {
            this.closings.forEach((closing) => {
                if(closing.id === closingId) {
                    closing.closed = closed;
                    closing.price_per_kilometer = pricePerKilometer,
                    closing.budget = budget
                }
            });
        },
        resetStore() {
            Object.assign(this, getDefaultState());
        }
    }
})