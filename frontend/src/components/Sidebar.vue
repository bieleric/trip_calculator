<script setup>
    import { ref } from 'vue';

    const isOpen = ref(false);

    const toggleSidebar = () => {
    isOpen.value = !isOpen.value;
    };
</script>

<template>
    <div class="relative grid grid-cols-3">
        <button @click="toggleSidebar" class="focus:outline-none p-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-8 h-8">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        </button>
        <div class="w-10 grid content-center mx-auto">
            <img src="/logo_no_text.png" alt="Logo">
        </div>
    </div>

    <div class="relative">
        <div :class="['bg-zinc-800 fixed top-0 left-0 h-full p-4 transition-transform duration-300 z-40', { '-translate-x-full': !isOpen }]" style="width: 300px;">
            <button @click="toggleSidebar" class="text-white focus:outline-none absolute top-4 right-4">
                <svg v-if="isOpen" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <nav class="mt-8">
                <ul>
                <li class="py-2"><a href="#">Home</a></li>
                <li class="py-2"><a href="#">About</a></li>
                <li class="py-2"><a href="#">Services</a></li>
                <li class="py-2"><a href="#">Contact</a></li>
                </ul>
            </nav>
        </div>
    </div>

    <div v-if="isOpen" @click="toggleSidebar" class="fixed inset-0 bg-black opacity-50 z-30"></div>
  </template>