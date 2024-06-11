<script setup>
  import BaseLayout from '@/layouts/BaseLayout.vue';
  import { useAllTripsStore } from '@/stores/allTripsStore';

  const allTripsStore = useAllTripsStore();
</script>

<template>
  <BaseLayout>
    <div class="closing">
      <p class="text-2xl w-11/12 md:w-3/4 mx-auto mb-3">Abschluss</p>
      <div v-for="month in allTripsStore.getAllTripsClassified" class="w-11/12 md:w-3/4 mx-auto mb-3 border-b text-lg">
        <RouterLink :to="{
          name: 'closingAdministration', 
          query: {
            monthName: month.title,
          }
        }">
          <p class="p-3">{{ month.title }}</p>
        </RouterLink>
      </div>
    </div>
  </BaseLayout>
</template>
