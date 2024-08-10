<script setup>
  import { ref, onMounted } from 'vue';
  import { RouterView } from 'vue-router'
  import { fetchAllData } from './services/apiRequests';
  import { isTokenExpired, getUser } from './services/helpers';
  import { signOut } from './services/helpers';
  import router from './router';

  const loading = ref(true);

  const loadData = async () => {
    if (!isTokenExpired()) {
      try {
        if(!getUser().groupId) {
          router.push('/joinGroup');
          loading.value = false;
          return;
        }

        await fetchAllData();
      } catch (err) {
        signOut();
      }
    }
    loading.value = false;
  };

  onMounted(() => {
    loadData();
  });
</script>

<template>
  <div v-if="loading" class="h-100 w-100">
    <p>Loading...</p>
  </div>
  <div v-else>
    <RouterView />
  </div>
</template>
