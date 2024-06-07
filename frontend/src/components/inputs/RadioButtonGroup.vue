<script setup>
import { computed } from 'vue';

    const props = defineProps({
        name: String,
        options: Array,
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
    <div class="my-5 flex md:grid md:grid-cols-8 leading-9">
        <p class="flex items-center md:col-span-2">{{ name }}:</p>
        <div v-for="option in options" class="flex items-center ml-4 md:col-span-3">
            <input 
                type="radio"
                v-model="internalValue" 
                :name="name" 
                :value="option.value"
                class="cursor-pointer appearance-none bg-slate-50 rounded-full w-[16px] h-[16px] ring-inset focus:ring-orange-500  checked:ring-orange-500 focus:ring-4 checked:ring-4" 
                required 
            />
            <label :for="name" class="flex items-center">
                <span class="ml-3">{{ option.text }}</span>
            </label>
        </div>
    </div>
</template>