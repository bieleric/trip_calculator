import { defineStore } from 'pinia'

const getDefaultState = () => {
    return {
        users: [],
    }
}

export const useUserStore = defineStore('userStore', {
    state: () => getDefaultState(),
    getters: {
        getAllUsers: (state) => state.users,
        getActiveUsers: (state) => state.users.filter(user => user.active === 1),
        getInactiveUsers: (state) => state.users.filter(user => user.active === 0),
    },
    actions: {
        setupUsersStore(data) {
            data.forEach((user) => {
                user['role_name'] = user.role_id === 1 || user.role_id === 0 ? 'Admin' : 'Nutzer';
                this.users.push(user);
            })
        },
        addUser(user) {
            user['role_name'] = user.role_id === 1 || user.role_id === 0 ? 'Admin' : 'Nutzer';
            this.users.push(user);
        },
        deleteUser(userId) {
            this.users = this.users.filter(user => user.id !== userId)
        },
        resetStore() {
            Object.assign(this, getDefaultState());
        }
    }
})