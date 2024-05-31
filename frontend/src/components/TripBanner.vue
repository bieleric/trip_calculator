<script setup>
    defineProps({
        favoritesBanner: Boolean,
    })
</script>

<template>
    <div class="w-full md-w-3/4 bg-zinc-700 px-2 py-3">
        <div class="grid grid-cols-3 text-zinc-400">
            <p class="col-span-1 text-left">Einzelfahrt</p>
            <p class="col-span-1 text-center">Auto</p>
            <p v-if="favoritesBanner" class="col-span-1 text-center">Stern</p>
        </div>
        <div class="grid grid-cols-8 mt-4 text-zinc-400 text-sm">
            <p class="col-span-3">von</p>
            <p class="col-span-3">nach</p>
            <p class="col-span-2">Strecke</p>
        </div>
        <div class="grid grid-cols-8 text-lg">
            <p class="col-span-3">Finsterwalde</p>
            <p class="col-span-3">Dresden</p>
            <p class="col-span-2">92km</p>
        </div>
    </div>
</template>