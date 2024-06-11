<script setup>
    defineProps({
        buttonText: String
    })
</script>

<template>
    <div class="button w-80 mx-auto border-2 border-solid border-slate-300 hover:bg-slate-50 hover:text-zinc-800 py-2 text-center text-lg cursor-pointer">
        {{ buttonText }}
        <slot></slot>
    </div>
</template>