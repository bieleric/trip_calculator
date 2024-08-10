<script setup>
    import { ref, watch } from 'vue';
    import axios from 'axios';
    import router from '@/router';
    import Button from '@/components/Button.vue';

    let name = ref('');
    let email = ref('');
    let password = ref('');
    let password2 = ref('');
    let errorMessage = ref('');
    let passwordIsValid = ref('');
    let hasMinLength = ref('');
    let hasUppercase = ref('');
    let hasLowercase = ref('');
    let hasNumber = ref('');
    let hasSpecialChar = ref('');

    const apiKey = import.meta.env.VITE_API_KEY;

    const isPasswordValid = () => {
        if(password.value.length < 8) {
            hasMinLength.value = false;
            passwordIsValid.value = false;
        }
        else {
            hasMinLength.value = true;
            passwordIsValid.value = true;
        }

        if(!/[A-Z]/.test(password.value)) {
            hasUppercase.value = false;
            passwordIsValid.value = false;
        }
        else {
            hasUppercase.value = true;
            passwordIsValid.value = true;
        }

        if(!/[a-z]/.test(password.value)) {
            hasLowercase.value = false;
            passwordIsValid.value = false;
        }
        else {
            hasLowercase.value = true;
            passwordIsValid.value = true;
        }

        if(!/\d/.test(password.value)) {
            hasNumber.value = false;
            passwordIsValid.value = false;
        }
        else {
            hasNumber.value = true;
            passwordIsValid.value = true;
        }

        if(!/[!@#$%^&*(),.?":{}|<>]/.test(password.value)) {
            hasSpecialChar = false;
            passwordIsValid.value = false;
        }
        else {
            hasSpecialChar = true;
            passwordIsValid.value = true;
        }
    }

    watch(password, isPasswordValid);

    const signUp = async () => {
        if(!passwordIsValid.value) {
            errorMessage.value = 'Bitte beachten Sie die Vorgaben für das Passwort.';
            return;
        }
        else if(password.value !== password2.value) {
            errorMessage.value = 'Die Passwörter müssen übereinstimmen.';
            return;
        }
        
        try {
            const response = await axios.post('http://localhost:3000/signUp', {
                name: name.value,
                email: email.value,
                password: password.value
            }, {
                headers: {
                    'x-api-key': apiKey
                }
            });

            router.push('/signIn');

        } catch (error) {
            console.error(error.message)
            errorMessage.value = 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.';
        }
    };
</script>

<template>
    <div class="h-dvh grid justify-items-center content-center bg-zinc-800 overflow-hidden text-slate-300">
        <div class="logo w-7/12 md:w-3/12">
            <img src="/logo.png" alt="Logo">
        </div>
        <div class="login mt-10">
            <p class="text-2xl">Registrieren</p>
            <div>
                <form @submit.prevent="signUp">
                    <div class="my-3">
                        <input v-model="name" name="name" type="text" required class="w-full text-sm px-4 py-3 outline-none border-2 focus:border-slate-500 text-zinc-800" placeholder="Name" />
                    </div>
                    <div class="mb-7">
                        <input v-model="email" name="email" type="email" required class="w-full text-sm px-4 py-3 outline-none border-2 focus:border-slate-500 text-zinc-800" placeholder="E-Mail" />
                    </div>
                    <div class="my-3">
                        <input v-model="password" name="password" type="password" required class="w-full text-sm px-4 py-3 outline-none border-2 focus:border-slate-500 text-zinc-800" placeholder="Passwort" />
                    </div>
                    <div class="mb-3">
                        <input v-model="password2" name="password2" type="password" required class="w-full text-sm px-4 py-3 outline-none border-2 focus:border-slate-500 text-zinc-800" placeholder="Passwort wiederholen" />
                    </div>
                    <ul class="text-xs text-zinc-400 mb-5">
                        <li :class="{ 'text-green-500': hasMinLength }">mind. 8 Zeichen lang</li>
                        <li :class="{ 'text-green-500': hasLowercase }">mind. 1 Kleinbuchstabe</li>
                        <li :class="{ 'text-green-500': hasUppercase }">mind. 1 Großbuchstabe</li>
                        <li :class="{ 'text-green-500': hasNumber }">mind. 1 Ziffer</li>
                        <li :class="{ 'text-green-500': hasSpecialChar }">mind. 1 Sonderzeichen</li>
                    </ul>
                    <p v-if="errorMessage" class="error mb-3 text-red-500 w-80">{{ errorMessage }}</p>
                    <button type="submit"><Button button-text="Registieren"></Button></button>
                </form>
            </div>
        </div>
    </div>
</template>