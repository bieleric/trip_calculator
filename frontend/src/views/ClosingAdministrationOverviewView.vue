<script setup>
  import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
  import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
  import BaseLayout from '@/layouts/BaseLayout.vue';
  import { useAllTripsStore } from '@/stores/allTripsStore';
  import { useClosingsStore } from '@/stores/closingsStore';
  import { getMonthsNames } from "@/services/helpers";

  const props = defineProps({
    userClosings: {
      type: String,
      default: ''
    }
  });

  const closingsStore = useClosingsStore();
</script>

<template>
  <BaseLayout>
    <div class="closing">
      <p v-if="props.userClosings" class="text-2xl w-11/12 md:w-3/4 mx-auto mb-3">Abschluss</p>
      <p v-else class="text-2xl w-11/12 md:w-3/4 mx-auto mb-3">Abschlussverwaltung</p>
      <div v-for="closing in closingsStore.getAllClosings" class="w-11/12 md:w-3/4 mx-auto mb-3 border-b text-lg">
        <RouterLink :to="{
          name: props.userClosings ? 'closing' : 'closingAdministration', 
          query: {
            monthName: closing.monthYearString,
          }
        }">
          <p class="flex justify-between p-3">
            <span>{{ closing.monthYearString }} </span>
            <span v-if="closing.closed">
              <FontAwesomeIcon :icon="faCircleCheck" />
            </span>
          </p>
        </RouterLink>
      </div>
    </div>
  </BaseLayout>
</template>
