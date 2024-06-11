<script setup>
  import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
  import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
  import BaseLayout from '@/layouts/BaseLayout.vue';
  import { useAllTripsStore } from '@/stores/allTripsStore';
  import { useClosingsStore } from '@/stores/closingsStore';
  import { getMonthsNames } from "@/services/helpers";

  const allTripsStore = useAllTripsStore();
  const closingsStore = useClosingsStore();

  const isClosed = (period) => {
    const month = period.split(' ')[0];
    const monthNumeral = getMonthsNames().indexOf(month) + 1;
    const year = period.split(' ')[1];
    const dateString = `${monthNumeral}-01-${year}`;
    const foundClosing = closingsStore.getAllClosings.find((closing) => {
      return new Date(closing.period).toDateString() === new Date(dateString).toDateString();
    });
    return !!foundClosing;
  };
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
          <p class="flex justify-between p-3">
            <span>{{ month.title }} </span>
            <span v-if="isClosed(month.title)">
              <FontAwesomeIcon :icon="faCircleCheck" />
            </span>
          </p>
        </RouterLink>
      </div>
    </div>
  </BaseLayout>
</template>
