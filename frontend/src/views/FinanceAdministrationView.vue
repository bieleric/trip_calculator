<script setup>
  import { ref, computed, useModel } from 'vue';
  import BaseLayout from '@/layouts/BaseLayout.vue';
  import Button from '@/components/Button.vue';
  import TextInput from '@/components/inputs/TextInput.vue';
  import Switch from '@/components/inputs/Switch.vue';
  import { updateFinanceSettings } from '@/services/apiRequests';
  import { useSettingsStore } from '@/stores/settingsStore';

  const settingsStore = useSettingsStore();

  let message = ref('');
  let error = ref(false);

  const budget = computed({
    get() {
      return settingsStore.getBudget;
    },
    set(value) {
      if (value !== settingsStore.getBudget) {
        settingsStore.setBudget(value);
        if (value === 0) {
          settingsStore.setUnlimitedBudget(true);
        } 
        else {
          settingsStore.setUnlimitedBudget(false);
        }
      }
    }
  });

  const unlimitedBudget = computed({
    get() {
      return settingsStore.getUnlimitedBudget;
    },
    set(value) {
      if (value !== settingsStore.getUnlimitedBudget) {
        settingsStore.setUnlimitedBudget(value);
        if (value) {
          settingsStore.setBudget(0);
        }
      }
    }
  });

  const pricePerKilometer = computed({
    get() {
      return settingsStore.getPricePerKilometer;
    },
    set(value) {
      settingsStore.setPricePerKilometer(value);
    }
  });

  const submitUpdateFinanceSettings = () => {
    updateFinanceSettings(budget.value, pricePerKilometer.value)
  }
</script>

<template>
  <BaseLayout>
    <div class="finance">
      <p class="text-2xl w-11/12 md:w-3/4 mx-auto mb-3">Finanzeinstellungen</p>
      <div class="updateFinanceSettings w-11/12 md:w-3/4 mx-auto">
        <Switch
          name="Budget unbegrenzt"
          v-model="unlimitedBudget"
        ></Switch>
        <form @submit.prevent="submitUpdateFinanceSettings">
          <TextInput
            v-if="!unlimitedBudget"
            type="number"
            name="Budget"
            unit="€"
            v-model="budget"
          ></TextInput>
          <TextInput
            type="number"
            step="0.001"
            name="Preis pro km"
            unit="€/km"
            v-model="pricePerKilometer"
          ></TextInput>
          <p v-if="message" :class="{ 'error mb-3': true, 'text-red-500': error, 'text-green-500': !error }">{{ message }}</p>
          <button type="submit" class="block mx-auto mt-10"><Button button-text="Änderungen speichern"></Button></button>
        </form>
      </div>
    </div>
  </BaseLayout>
</template>
