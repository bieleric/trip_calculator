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
    },
    actions: {
        setupClosingsStore(data) {
            data.forEach((closing) => {
                this.closings.push(closing);
            })
        },
        addClosing(data) {
            this.closings.push({ id: data.id, period: data.period, createdAt: data.created_at });
        },
        deleteClosing(id) {
            this.closings = this.closings.filter(closing => closing.id !== id);
        },
        resetStore() {
            Object.assign(this, getDefaultState());
        }
    }
})