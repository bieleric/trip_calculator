<script setup>
  import { RouterLink, RouterView } from 'vue-router'
  import axios from 'axios';
  import { useSettingsStore } from './stores/settingsStore';
  import Sidebar from './components/Sidebar.vue'

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
    <div class="wrapper relative h-dvh overflow-hidden text-slate-300">
      <Sidebar />
      <div class="background" :style="'background: linear-gradient(to bottom right,' + settingsStore.getPrimaryColorInRGBA + ', ' + settingsStore.getSecondaryColorInRGBA + ')'"></div>
      <div>

      </div>
      <RouterView />
    </div>
</template>

<style scoped>
.background {
  position: absolute;
  top: 10%;
  left: 0;
  width: 130%;
  height: 200px;
  z-index: -1;
  filter: blur(80px);
  border-radius: 70%;
  transform: rotate(15deg) translate(-15%);
}
</style>
