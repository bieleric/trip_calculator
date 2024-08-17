import { defineStore } from 'pinia'
import { resetStoresAndFetchDataByGroupId, signOut } from '@/services/helpers'

const getDefaultState = () => {
    return {
        currentGroup: {},
        groups: []
    }
}

export const useGroupAndRoleStore = defineStore('groupAndRoleStore', {
    state: () => getDefaultState(),
    getters: {
        getCurrentGroup: (state) => state.currentGroup,
        getGroups: (state) => state.groups
    },
    actions: {
        setupGroupAndRoleStore(data) {
            data.forEach((group) => {
                if(group.selected) {
                    this.currentGroup = group;
                }
                this.groups.push(group);
            });
        },
        setCurrentGroup(group) {
            this.currentGroup = group;
        },
        updateCurrentGroupAndRole(groupId) {
            this.groups.forEach((group) => {
                if(group.selected === 1) {
                    group.selected = 0;
                }
            });
            this.groups.forEach((group) => {
                if(group.group_id === groupId) {
                    group.selected = 1;
                }
            });
            const newSelectedGroup = this.groups.find((group) => group.group_id === groupId);
            this.setCurrentGroup(newSelectedGroup);

            resetStoresAndFetchDataByGroupId(newSelectedGroup.group_id);
        },
        removeGroupByGroupId(groupId) {
            const index = this.groups.findIndex(group => group.group_id === groupId);
            if (index !== -1) {
                this.groups.splice(index, 1);
                if(this.groups.length === 0) {
                    signOut();
                }
            }
        },
        resetStore() {
            Object.assign(this, getDefaultState());
        }
    }
})