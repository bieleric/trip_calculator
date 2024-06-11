<script setup>
  import { ref, computed } from 'vue';
  import BaseLayout from '@/layouts/BaseLayout.vue';
  import Button from '@/components/Button.vue';
  import ClonsingCollapse from '@/components/ClosingCollapse.vue';
  import TripBanner from '@/components/TripBanner.vue';
  import { useSettingsStore } from '@/stores/settingsStore';
  import { useAllTripsStore } from '@/stores/allTripsStore';


  const settingsStore = useSettingsStore();
  const allTripsStore = useAllTripsStore();

  const props = defineProps({
    monthName: {
      type: String,
      default: ''
    },
  });

  const month = props.monthName.split(' ')[0];
  const year = props.monthName.split(' ')[1];

  const costsOfMonth = computed(() => {
    return allTripsStore.getCostsOfMonthByMonthName(props.monthName)
  });

  const remainingBudget = computed(() => {
    const value = (settingsStore.getBudget - costsOfMonth.value).toFixed(2);
    return value < 0 ? 0.00 : value;
  });

  let message = ref('');
  let error = ref(false);
</script>

<template>
  <BaseLayout>
    <div class="closing">
      <p class="text-2xl w-11/12 md:w-3/4 mx-auto mb-5">Abschluss - {{ props.monthName }}</p>
      <p class="w-11/12 md:w-3/4 mx-auto mb-3">Budget: {{ settingsStore.getBudget }}€</p>
      <p class="w-11/12 md:w-3/4 mx-auto mb-3">Gesamtkosten: {{ allTripsStore.getCostsOfMonthByMonthName(props.monthName) }}€</p>
      <p class="w-11/12 md:w-3/4 mx-auto mb-10">verbleibendes Budget: {{ remainingBudget }}€</p>
      <Button buttonText="Abschließen"></Button>
      <p class="text-xl w-11/12 md:w-3/4 mx-auto mb-3 mt-20">Fahrten ({{ allTripsStore.getTripsOfMonthByMonthName(props.monthName).length }})</p>
      <div v-for="user in allTripsStore.getTripsClassifiedByUserForMonthAndYear(month, Number(year))">
        <ClonsingCollapse :title="user.title + ' (' + user.trips.length + ')'" :costs="allTripsStore.getCostsByUserForMonth(user, month, Number(year))" :pending="allTripsStore.getPendingAmountOfMoneyByUserForMonth(user, month, Number(year))">
          <TripBanner v-for="trip in user.trips" :data="trip" :closing="true"></TripBanner>
        </ClonsingCollapse>
        <div class="w-11/12 md:w-3/4 mx-auto border-b border-zinc-400 my-2"></div>
      </div>

    </div>
  </BaseLayout>
</template>
