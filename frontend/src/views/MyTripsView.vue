<script setup>
  import { ref, computed } from 'vue';
  import BaseLayout from '@/layouts/BaseLayout.vue';
  import TripBanner from '@/components/TripBanner.vue';
  import { useAllTripsStore } from '@/stores/allTripsStore';

  const allTripsStore = useAllTripsStore();
  const filter = ref('all');
  const tripCounter = ref(0);

  const shownTrips = computed(() => {
    if (filter.value === 'all') {
      const allTrips = allTripsStore.getTripsClassifiedByMonthAndYearForCurrentUser;
      tripCounter.value = allTripsStore.getTripsOfCurrentUser.length;
      return allTrips;
    } 
    else if (filter.value === 'currentMonth') {
      const tripsOfCurrentMonthByCurrentUser = allTripsStore.getTripsOfCurrentMonthByCurrentUser;
      tripCounter.value = tripsOfCurrentMonthByCurrentUser[0] ? tripsOfCurrentMonthByCurrentUser[0].trips.length : 0;
      return tripsOfCurrentMonthByCurrentUser;
    }
    else if (filter.value === 'lastMonth') {
      const tripsOfLastMonth = allTripsStore.getTripsOfLastMonthByCurrentUser;
      tripCounter.value = tripsOfLastMonth[0] ? tripsOfLastMonth[0].trips.length : 0;
      return tripsOfLastMonth;
    }
    return [];
  });

  const filterTrips = (filterCriteria) => {
    filter.value = filterCriteria;
  }
</script>

<template>
  <BaseLayout>
    <div class="myTrips">
      <p class="text-2xl w-11/12 md:w-3/4 mx-auto mb-3">Meine Fahrten ({{ tripCounter }})</p>
      <div class="flex w-11/12 md:w-3/4 mx-auto mb-3">
        <div @click="filterTrips('all')" :class="{ 'border border-slate-300 px-2 mr-2 cursor-pointer': true, 'bg-slate-300 text-zinc-800': filter === 'all' }">Alle</div>
        <div @click="filterTrips('currentMonth')" :class="{ 'border border-slate-300 px-2 mr-2 cursor-pointer': true, 'bg-slate-300 text-zinc-800': filter === 'currentMonth' }">Dieser Monat</div>
        <div @click="filterTrips('lastMonth')" :class="{ 'border border-slate-300 px-2 mr-2 cursor-pointer': true, 'bg-slate-300 text-zinc-800': filter === 'lastMonth' }">Letzter Monat</div>
      </div>
      <div v-for="tripMonth in shownTrips" :key="tripMonth.title">
        <p class="text-xl w-11/12 md:w-3/4 mx-auto mb-3 mt-10">{{ tripMonth.title }}</p>
        <p v-if="tripMonth.trips.length === 0" class="text-sm text-center">Bisher keine Fahrten hinzugefügt</p>
        <div v-for="trip in tripMonth.trips" :key="trip.id">
          <TripBanner :data="trip" :favoritesBanner="false"></TripBanner>
        </div>
      </div>
      <p v-if="allTripsStore.getTripsOfCurrentUser.length === 0" class="text-sm text-center">Keine Fahrten gefunden</p>
    </div>
  </BaseLayout>
</template>
