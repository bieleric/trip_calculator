<script setup>
    import { computed } from 'vue';

    const props = defineProps({
        name: String,
        modelValue: String
    })

    const emit = defineEmits(['update:modelValue']);

    const internalValue = computed({
        get() {
            return props.modelValue;
        },
        set(newValue) {
            emit('update:modelValue', newValue);
        }
    })
</script>

<template>
    <div class="my-5 grid grid-cols-8">
        <p class="flex items-center col-span-2">{{ name }}:</p>
        <div class="relative inline-block flex items-center border-b col-span-6">
            <input 
                type="date"
                v-model="internalValue" 
                :name="name"
                class="dateInput"
                required 
            />
        </div>
    </div>
</template>

<style scoped>
.dateInput {
    border: none;
    outline: none;
    background-color: transparent;
    cursor: pointer;
}
 
.dateInput::-webkit-calendar-picker-indicator {
    cursor: pointer;
}
</style>