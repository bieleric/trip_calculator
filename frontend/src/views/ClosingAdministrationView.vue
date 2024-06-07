<script setup>
  import { ref } from 'vue';
  import BaseLayout from '@/layouts/BaseLayout.vue';
  import Button from '@/components/Button.vue';
  import { useSettingsStore } from '@/stores/settingsStore';
  import { useUserStore } from '@/stores/userStore';

  const settingsStore = useSettingsStore();
  const userStore = useUserStore();

  let message = ref('');
  let error = ref(false);
</script>

<template>
  <BaseLayout>
    <div class="closing">
      <p class="text-2xl w-11/12 md:w-3/4 mx-auto mb-3">Abschluss</p>
      <Button buttonText="Abschluss"></Button>
    </div>
  </BaseLayout>
</template>
