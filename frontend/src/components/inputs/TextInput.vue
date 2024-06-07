<script setup>
    import { computed } from 'vue';

    const props = defineProps({
        type: String,
        name: String,
        unit: String,
        step: String,
        modelValue: null
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
                :type="type"
                v-model="internalValue" 
                :name="name"
                :step="step"
                class="appearance-none bg-transparent border-none py-2 px-3 leading-tight focus:outline-none w-25" 
                required 
            />
            <span v-if="unit">{{ unit }}</span>
        </div>
    </div>
</template>