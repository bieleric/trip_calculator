<script setup>
  import BaseLayout from "@/layouts/BaseLayout.vue";
  import Button from "@/components/Button.vue";
  import TripBanner from "@/components/TripBanner.vue";
  import { useFavoritesStore } from '@/stores/favoritesStore';

  const favoritesStore = useFavoritesStore();
</script>

<template>
    <BaseLayout>
      <div class="flex flex-col w-full">
        <RouterLink to="newTrip"><Button buttonText="Neue Fahrt hinzufügen" class="mb-4"></Button></RouterLink>
        <RouterLink to="myTrips"><Button buttonText="Meine Fahrten"></Button></RouterLink>
        <div class="favorites mt-5">
          <p class="text-2xl w-11/12 md:w-3/4 mx-auto mb-3">Favoriten</p>
            <div v-for="favorite in favoritesStore.getFavorites">
              <TripBanner :data="favorite" :favoritesBanner="true"></TripBanner>
            </div>
            <p v-if="favoritesStore.getFavorites.length === 0" class="text-sm text-center">Keine Favoriten gefunden</p>
        </div>
      </div>
    </BaseLayout>
</template>
