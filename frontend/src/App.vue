<script setup>
  import { ref, onMounted } from 'vue';
  import { RouterView } from 'vue-router'
  import { fetchAllDataByGroup } from './services/apiRequests';
  import { isTokenExpired, getUser } from './services/helpers';
  import { signOut } from './services/helpers';
  import router from './router';

  const loading = ref(true);

  const loadData = async () => {
    // TODO: could cause an error due to always picking first group, should only fetch first group on signin
    let groupId = '';
    if(getUser()) {
      groupId = getUser().groups.length > 0  ? getUser().groups[0].groupId : null;
    }
    
    
    if (!isTokenExpired()) {
      try {
        if(!groupId) {
          const route = router.currentRoute.value;
          const token = route.params.token || null;

          if(token) {
            router.push({ name: 'joinGroup', params: { token } });
          }

          loading.value = false;
          return;
        }

        await fetchAllDataByGroup(groupId);
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
