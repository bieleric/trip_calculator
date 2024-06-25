<script setup>
  import { ref, computed } from 'vue';
  import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
  import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
  import BaseLayout from '@/layouts/BaseLayout.vue';
  import Button from '@/components/Button.vue';
  import ClosingCollapse from '@/components/ClosingCollapse.vue';
  import TripBanner from '@/components/TripBanner.vue';
  import { useSettingsStore } from '@/stores/settingsStore';
  import { useAllTripsStore } from '@/stores/allTripsStore';
  import { useClosingsStore } from '@/stores/closingsStore';
  import { useUserStore } from '@/stores/userStore';
  import { addClosing, deleteClosing } from '@/services/apiRequests';
  import { getMonthsNames } from '@/services/helpers';

  const settingsStore = useSettingsStore();
  const allTripsStore = useAllTripsStore();
  const closingsStore = useClosingsStore();
  const userStore = useUserStore();

  const props = defineProps({
    monthName: {
      type: String,
      default: ''
    }
  });

  let message = ref('');
  let error = ref(false);
  let buttonText = ref('');
  let closing = ref(null);

  const month = props.monthName.split(' ')[0];
  const monthNumeral = getMonthsNames().indexOf(month) + 1;
  const year = props.monthName.split(' ')[1];
  const dateString = `${monthNumeral}-01-${year}`;

  const isClosed = computed(() => {
    const foundClosing = closingsStore.getAllClosings.find((closing) => {
      return new Date(closing.period).toDateString() === new Date(dateString).toDateString();
    });
    if (foundClosing) {
      closing.value = foundClosing;
      buttonText.value = 'Abgeschlossen';
      return true;
    } else {
      buttonText.value = 'Abschließen';
      return false;
    }
  });

  const costsOfMonth = computed(() => {
    return allTripsStore.getCostsOfMonthByMonthName(props.monthName)
  });

  const budget = computed(() => {
    if(closing.value) {
      return isClosed ? closing.value.budget : settingsStore.getBudget;
    }
    else {
      return settingsStore.getBudget;
    }
  });

  const remainingBudget = computed(() => {
    const value = (budget.value - costsOfMonth.value).toFixed(2)
    return value < 0 ? 0.00 : value;
  });

  const closeMonth = () => {
    const foundClosing = closingsStore.getAllClosings.find((closing) => {
      return new Date(closing.period).toDateString() === new Date(dateString).toDateString();
    });
    if (foundClosing) {
      deleteClosing(foundClosing.id)
      .then(response => {
          error.value = false;
      })
      .catch(err => {
          message.value = "Fehler! Abschluss konnte nicht rückgängig gemacht werden.";
          error.value = true;
      });
    } 
    else {
      const period = new Date(dateString).toDateString();
      addClosing(period, settingsStore.getBudget, settingsStore.getPricePerKilometer)
      .then(response => {
          error.value = false;
      })
      .catch(err => {
          message.value = "Fehler! Abschluss konnte nicht durchgeführt werden.";
          error.value = true;
      });
    }
  }

  const getUserOfClosing = (user) => {
    const foundUser = userStore.getAllUsers.find(userObject => userObject.id === user.userId);

    return foundUser ? user.title + ' (' + user.trips.length + ')' : user.title + ' (' + user.trips.length + ') [entfernt]' 
  }
</script>

<template>
  <BaseLayout>
    <div class="closings">
      <p class="text-2xl w-11/12 md:w-3/4 mx-auto mb-5">Abschluss - {{ props.monthName }}</p>
      <p class="w-11/12 md:w-3/4 mx-auto mb-3">Budget: {{ budget }}€</p>
      <p class="w-11/12 md:w-3/4 mx-auto mb-3">Gesamtkosten: {{ allTripsStore.getCostsOfMonthByMonthName(props.monthName) }}€</p>
      <p class="w-11/12 md:w-3/4 mx-auto mb-10">verbleibendes Budget: {{ remainingBudget }}€</p>
      <p v-if="message" :class="{ 'error mb-3': true, 'text-red-500': error, 'text-green-500': !error }">{{ message }}</p>
      <Button @click="closeMonth" :buttonText="buttonText">
        <span v-if="isClosed"><FontAwesomeIcon :icon="faCircleCheck" /></span>
      </Button>
      <p class="text-xl w-11/12 md:w-3/4 mx-auto mb-3 mt-20">Fahrten ({{ allTripsStore.getTripsOfMonthByMonthName(props.monthName).length }})</p>
      <div v-for="user in allTripsStore.getTripsClassifiedByUserForMonthAndYear(month, Number(year))">
        <ClosingCollapse :title="getUserOfClosing(user)" :costs="allTripsStore.getCostsByUserForMonth(user, month, Number(year))" :pending="allTripsStore.getPendingAmountOfMoneyByUserForMonth(user, month, Number(year))">
          <TripBanner v-for="trip in user.trips" :data="trip" :closing="true"></TripBanner>
        </ClosingCollapse>
        <div class="w-11/12 md:w-3/4 mx-auto border-b border-zinc-400 my-2"></div>
      </div>
    </div>
  </BaseLayout>
</template>
