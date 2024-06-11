<script setup>
  import { ref } from 'vue';

  const props = defineProps({
    title: {
      type: String,
      required: true,
    },
    costs: {
      type: String
    },
    pending: {
      type: String
    }
  });

  const open = ref(false);

  const toggleCollapse = () => {
    open.value = !open.value;
  };
</script>

<template>
  <div class="w-11/12 md:w-3/4 mx-auto">
    <div @click="toggleCollapse" class="w-full grid grid-rows-2 grid-cols-9 p-4">
      <p class="text-xl col-span-8 row-span-1">{{ title }}</p>
      <div class="icon row-span-2 col-span-1 flex items-center justify-end">
        <svg v-if="open" class="w-5 h-5 transform rotate-180" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z" clip-rule="evenodd"/>
        </svg>
        <svg v-else class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z" clip-rule="evenodd"/>
        </svg>
      </div>
      <p class="text-sm col-span-4 row-span-1 text-zinc-400">Kosten: {{ props.costs }}€</p>
      <p class="text-sm col-span-4 row-span-1 text-zinc-400">Anspruch: {{ props.pending }}€</p>
    </div>
  </div>
  <div v-show="open" class="mt-2">
    <slot></slot>
  </div>
</template>