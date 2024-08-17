<script setup>
    import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
    import { faCircleCheck, faCircle, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
    import { setSelectedGroup } from '../services/apiRequests';
import { useGroupAndRoleStore } from "@/stores/groupAndRoleStore";

    const props = defineProps({
        groupName: {
            type: String,
            required: true,
        },
        groupId: {
            type: Number,
            required: true 
        },
        members: {
            type: Number
        },
        selected: {
            type: Boolean
        },
        roleName: {
            type: String
        },
        roleId: {
            type: Number
        }
    });

    const emit = defineEmits(['leaveGroup']);

    const leaveGroup = () => {
        emit('leaveGroup');
    }

    const changeGroup = () => {
        setSelectedGroup(props.groupId)
        .then(response => {

        })
        .catch(err => {
            console.error(err)
        });
    }
</script>

<template>
    <div class="w-11/12 md:w-3/4 mx-auto">
        <p class="text-xl px-4 pt-4">{{ groupName }}</p>
        <div class="w-full grid grid-rows-2 grid-cols-9 px-4 py-3">
            <p class="text-sm col-span-7 text-zinc-400">Mitglieder: {{ props.members }}</p>
            <div class="icon row-span-2 col-span-1 flex items-center justify-start">
                <p v-if="props.roleId !== 0" @click="leaveGroup" class="cursor-pointer text-red-500"><FontAwesomeIcon :icon="faArrowRightFromBracket" class="h-5 w-5" /></p>
            </div>
            <div class="icon row-span-2 col-span-1 flex items-center justify-end">
                <p v-if="selected" class="cursor-pointer"><FontAwesomeIcon :icon="faCircleCheck" class="h-6 w-6" /></p>
                <p v-if="!selected" @click="changeGroup" class="cursor-pointer"><FontAwesomeIcon :icon="faCircle" class="h-6 w-6" /></p>
            </div>
            <p class="text-sm col-span-7 text-zinc-400">Rolle: {{ props.roleName }}</p>
        </div>
    </div>
</template>