<script setup>
    defineProps({
        isOpen: Boolean,
        title: String,
        text: String
    });

    const emit = defineEmits(['close', 'confirm']);

    const closeModal = () => {
        emit('close');
    }

    const confirmDelete = () => {
        emit('confirm');
    }
</script>

<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div class="bg-zinc-700 shadow-lg w-10/12 md:w-7/12">
        <div class="p-4 border-b">
            <h2 class="text-xl font-semibold">{{ title }}</h2>
        </div>
        <div class="p-4">
            <p>{{ text }}</p>
        </div>
        <div class="p-4 flex justify-end space-x-2">
            <p @click="closeModal" class="px-3 py-2 text-zinc-400 cursor-pointer">Abbrechen</p>
            <p @click="confirmDelete" class="px-3 py-2 text-red-500 cursor-pointer">Entfernen</p>
        </div>
        </div>
    </div>
</template>