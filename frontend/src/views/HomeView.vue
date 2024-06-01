<script setup>
  import axios from 'axios';
  import BaseLayout from "@/layouts/BaseLayout.vue";
  import Button from "@/components/Button.vue";
  import TripBanner from "@/components/TripBanner.vue";
  import { useSettingsStore } from '../stores/settingsStore';

  const settingsStore = useSettingsStore();

  // TODO: delete this line
  const apiKey = "0f93dc23e476cfde010970a5092b97e0e987f598c130e580a00930db94c6e920";

  const fetchAdminSettings = async () => {
    axios.get('http://localhost:3000/api/adminSettings', {
      headers: {
        'x-api-key': apiKey
      }
    })
    .then(response => {
      settingsStore.setupSettings(response.data.data[0])
    })
    .catch(error => {
      console.error('Fehler beim Abrufen der Daten:', error);
    });
  };

  fetchAdminSettings();
</script>

<template>
    <BaseLayout>
      <div class="flex flex-col w-full">
        <RouterLink to="newTrip"><Button buttonText="Neue Fahrt hinzufügen" class="mb-4"></Button></RouterLink>
        <RouterLink to="myTrips"><Button buttonText="Meine Fahrten"></Button></RouterLink>
        <div class="favorites mt-5">
          <p class="text-2xl w-11/12 mx-auto mb-3">Favoriten</p>
          <TripBanner>

          </TripBanner>
        </div>
      </div>
    </BaseLayout>
</template>
