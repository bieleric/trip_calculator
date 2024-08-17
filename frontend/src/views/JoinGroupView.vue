<script setup>
    import { ref } from 'vue';
    import { useRoute } from 'vue-router';
    import axios from 'axios';
    import router from '@/router';
    import { fetchAllDataByGroup } from '@/services/apiRequests';
    import { signOut, getUser } from '@/services/helpers';
    import Button from '@/components/Button.vue';

    const invitationLink = ref('');
    const errorMessage = ref('');

    const route = useRoute();
    invitationLink.value = route.params.token ? `${window.location.origin}${route.fullPath}` : '';

    const apiKey = import.meta.env.VITE_API_KEY;
    const backendHost = import.meta.env.VITE_BACKEND;

    const joinGroup = async () => {
        const token = invitationLink.value.split("/joinGroup/").pop()
        try { 
            const response = await axios.post(`${backendHost}/api/groups/joinGroup`, {
                invitationToken: token,
            }, {
                headers: {
                    'x-api-key': apiKey,
                    'Authorization': localStorage.getItem('jwt')
                }
            });
            
            localStorage.setItem("jwt", response.data.token);
            const user = getUser();
            const lastGroup = user.groups.at(-1)

            await fetchAllDataByGroup(lastGroup.groupId);
            router.push('/'); 

        } catch (error) {
            console.error(error);
            errorMessage.value = 'Ein Fehler ist aufgetreten.';
        }
    };
</script>

<template>
    <div class="h-dvh grid justify-items-center content-center bg-zinc-800 overflow-hidden text-slate-300">
        <div class="logo w-7/12 md:w-3/12">
            <img src="/logo.png" alt="Logo">
        </div>
        <div class="login mt-20">
            <p class="text-2xl">Gruppe beitreten</p>
            <div>
                <form @submit.prevent="joinGroup">
                    <div class="my-3">
                        <input v-model="invitationLink" name="invitationLink" type="text" required class="w-full text-sm px-4 py-3 outline-none border-2 focus:border-slate-500 text-zinc-800" placeholder="Einladungslink" />
                    </div>
                    <p v-if="errorMessage" class="error mb-3 text-red-500">{{ errorMessage }}</p>
                    <button type="submit"><Button button-text="Gruppe beitreten"></Button></button>
                </form>
                <Button button-text="Abmelden" @click="signOut()" class="mt-10"></Button>
            </div>
        </div>
    </div>
</template>