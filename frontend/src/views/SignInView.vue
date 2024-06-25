<script setup>
    import { ref } from 'vue';
    import axios from 'axios';
    import router from '@/router';
    import { fetchAllData } from '@/services/apiRequests';
    import Button from '@/components/Button.vue';
    import { isAdmin, signOut } from '@/services/helpers';

    const email = ref('');
    const password = ref('');
    const errorMessage = ref('');

    const apiKey = import.meta.env.VITE_API_KEY;
    const backendHost = import.meta.env.VITE_BACKEND;

    const signInUser = async () => {
        try {
            const response = await axios.post(`${backendHost}/signIn`, {
                email: email.value,
                password: password.value
            }, {
                headers: {
                    'x-api-key': apiKey
                }
            });

            localStorage.setItem("jwt", response.data.token);
            await fetchAllData();
            router.push('/');

        } catch (error) {
            if (error.response && error.response.status === 401) {
                errorMessage.value = 'Ungültige Anmeldedaten';
            } 
            else if(error.message === 'Could not fetch data') {
                errorMessage.value = 'Es konnten keine Daten geladen werden.';
            }
            else {
                errorMessage.value = 'Ein Fehler ist aufgetreten.';
            }
        }
    };
</script>

<template>
    <div class="h-dvh grid justify-items-center content-center bg-zinc-800 overflow-hidden text-slate-300">
        <div class="logo w-7/12 md:w-3/12">
            <img src="/logo.png" alt="Logo">
        </div>
        <div class="login mt-20">
            <p class="text-2xl">Melde dich an</p>
            <div>
                <form @submit.prevent="signInUser">
                    <div class="my-3">
                        <input v-model="email" name="email" type="email" autocomplete="email" required class="w-full text-sm px-4 py-3 outline-none border-2 focus:border-slate-500 text-zinc-800" placeholder="E-Mail" />
                    </div>
                    <div class="mb-5">
                        <input v-model="password" name="password" type="password" autocomplete="current-password" required class="w-full text-sm px-4 py-3 outline-none border-2 focus:border-slate-500 text-zinc-800" placeholder="Passwort" />
                    </div>
                    <p v-if="errorMessage" class="error mb-3 text-red-500">{{ errorMessage }}</p>
                    <button type="submit"><Button button-text="Anmelden"></Button></button>
                </form>
            </div>
        </div>
    </div>
</template>