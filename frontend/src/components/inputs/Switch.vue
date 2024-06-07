<script setup>
    import { computed } from 'vue';

    const props = defineProps({
        name: String,
        optionalInformation: String,
        modelValue: Boolean
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
        <label class="switch col-span-2">
            <input 
                type="checkbox"
                v-model="internalValue" 
                :name="name"
            />
            <span class="slider"></span>
        </label>
        <p v-if="optionalInformation" class="col-span-4 text-sm">{{ optionalInformation }}</p>
    </div>
</template>

<style scoped>
.switch {
    position: relative;
    display: inline-block;
    width: 44px;
    height: 24px;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    -webkit-transition: 0.4s;
    background-color: #94a3b8;
    transition: 0.4s;
}

.slider:before {
    position: absolute;
    cursor: pointer;
    content: '';
    width: 16px;
    height: 16px;
    left: 4px;
    bottom: 4px;
    background-color: #f8fafc;
    -webkit-transition: 0.4s;
    transition: 0.4s;
}

input:checked + .slider {
    background-color: #f97316;
}

input:checked + .slider:before {
    -webkit-transform: translateX(20px);
    -ms-transform: translateX(20px);
    transform: translateX(20px);
}
</style>