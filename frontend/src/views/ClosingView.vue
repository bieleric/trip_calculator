<script setup>
  import { ref, computed } from 'vue';
  import BaseLayout from '@/layouts/BaseLayout.vue';
  import TripBanner from '@/components/TripBanner.vue';
  import { useAllTripsStore } from '@/stores/allTripsStore';
  import { useClosingsStore } from '@/stores/closingsStore';
  import { getMonthsNames, getUser } from '@/services/helpers';

  const allTripsStore = useAllTripsStore();
  const closingsStore = useClosingsStore();

  const props = defineProps({
    monthName: {
      type: String,
      default: ''
    }
  });

  let message = ref('');
  let error = ref(false);

  const month = props.monthName.split(' ')[0];
  const monthNumeral = getMonthsNames().indexOf(month) + 1;
  const year = props.monthName.split(' ')[1];
  const dateString = `${monthNumeral}-01-${year}`;

  const isClosed = computed(() => {
    return closingsStore.getAllClosings.find((closing) => {
      return new Date(closing.period).toDateString() === new Date(dateString).toDateString();
    });
  });

  const statsOfUserByMonthAndYear = computed(() => {
    return allTripsStore.getStatsOfUserByMonthAndYear(getUser(), month, Number(year));
  });
</script>

<template>
  <BaseLayout>
    <div class="closings">
      <p class="text-2xl w-11/12 md:w-3/4 mx-auto mb-5">Abschluss - {{ props.monthName }}</p>
      <p class="w-11/12 md:w-3/4 mx-auto mb-3">Status: 
        <span v-if="isClosed">abgeschlossen</span>
        <span v-else>offen</span>
      </p>
      <p class="w-11/12 md:w-3/4 mx-auto mb-3">Gesamtkosten: {{ statsOfUserByMonthAndYear.costs }}€</p>
      <p class="w-11/12 md:w-3/4 mx-auto mb-3">Erstattung: {{ statsOfUserByMonthAndYear.pending }}€</p>
      <p class="text-xl w-11/12 md:w-3/4 mx-auto mb-3 mt-20">Fahrten ({{ statsOfUserByMonthAndYear.trips.length }})</p>
      <div v-for="trip in statsOfUserByMonthAndYear.trips" :key="trip.id">
        <TripBanner :data="trip"></TripBanner>
      </div>
    </div>
  </BaseLayout>
</template>
