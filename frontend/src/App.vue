<script setup>
  import { RouterView, useRoute } from 'vue-router'
  import { fetchAllData } from './services/apiRequests';
  import { isTokenExpired } from './services/helpers';

  if(!isTokenExpired()) {
    fetchAllData();
  }
</script>

<template>
  <RouterView />
</template>
