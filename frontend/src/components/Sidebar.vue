<script setup>
    import { ref } from 'vue';
    import router from '@/router';
    import { isAdmin } from '@/services/helpers';
    import { useUserStore } from '@/stores/userStore';
    import { useSettingsStore } from '@/stores/settingsStore';
    import { useFavoritesStore } from '@/stores/favoritesStore';
    import { useMyTripsStore } from '@/stores/myTripsStore';
    import { useAllTripsStore } from '@/stores/allTripsStore';
import { useClosingsStore } from '@/stores/closingsStore';

    const isOpen = ref(false);

    const toggleSidebar = () => {
        isOpen.value = !isOpen.value;
    };

    const signout = () => {
        useUserStore().resetStore();
        useSettingsStore().resetStore();
        useFavoritesStore().resetStore();
        useMyTripsStore().resetStore();
        useAllTripsStore().resetStore();
        useClosingsStore().resetStore();
        localStorage.removeItem('jwt');
        router.push('/signIn');
    }
</script>

<template>
    <div class="navbar relative grid grid-cols-3 mb-8">
        <button @click="toggleSidebar" class="focus:outline-none p-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-8 h-8">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        </button>
            <div class="w-10 grid content-center mx-auto">
                <RouterLink to="/"><img src="/logo_no_text.png" alt="Logo"></RouterLink>
            </div>
    </div>

    <div class="sidebar relative">
        <div :class="['bg-zinc-800 fixed top-0 left-0 h-full p-4 transition-transform duration-300 z-40', { '-translate-x-full': !isOpen }]" style="width: 300px;">
            <button @click="toggleSidebar" class="text-white focus:outline-none absolute top-4 right-4">
                <svg v-if="isOpen" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <nav class="mt-12 px-4 h-full">
                <ul>
                    <li class="pb-3 text-orange-400 font-bold">Trip Calculator</li>
                    <RouterLink to="/"><li class="py-2">Home</li></RouterLink>
                    <RouterLink to="newTrip"><li class="py-2">Fahrt hinzufügen</li></RouterLink>
                    <RouterLink to="myTrips"><li class="py-2">Meine Fahrten</li></RouterLink>
                    <!--<RouterLink to="closing"><li class="py-2">Abschluss</li></RouterLink>-->
                    <li v-if="isAdmin()" class="pt-8 pb-3 text-orange-400 font-bold">Administration</li>
                    <RouterLink  v-if="isAdmin()" to="userAdministration"><li class="py-2">Nutzerverwaltung</li></RouterLink>
                    <RouterLink  v-if="isAdmin()" to="financeAdministration"><li class="py-2">Finanzeinstellungen</li></RouterLink>
                    <RouterLink  v-if="isAdmin()" to="closingAdministrationOverview"><li class="py-2">Abschluss</li></RouterLink>
                    <li class="pt-8 pb-3 text-orange-400 font-bold">Account</li>
                    <li class="py-2">Einstellungen</li>
                    <li class="py-2">App-Design</li>
                    <li class="py-2 cursor-pointer" @click="signout()">Logout</li>
                </ul>
            </nav>
        </div>
    </div>

    <div v-if="isOpen" @click="toggleSidebar" class="fixed inset-0 bg-black opacity-50 z-30"></div>
  </template>