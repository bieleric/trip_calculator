<script setup>
  import { ref, onMounted } from 'vue';
  import { RouterView } from 'vue-router'
  import { fetchAllData } from './services/apiRequests';
  import { isAdmin, isTokenExpired } from './services/helpers';

  const loading = ref(true);

  const loadData = async () => {
    if (!isTokenExpired()) {
      await fetchAllData(isAdmin());
    }
    loading.value = false;
  };

  onMounted(() => {
    loadData();
  });
</script>

<template>
  <div v-if="loading">
    <p>Loading...</p>
  </div>
  <div v-else>
    <RouterView />
  </div>
</template>
