<script setup>
  import Button from "@/components/Button.vue";
  import TripBanner from "@/components/TripBanner.vue";
</script>

<template>
  <main>
    <div class="flex flex-col w-full">
      <RouterLink to="newTrip"><Button buttonText="Neue Fahrt hinzufügen" class="mb-4"></Button></RouterLink>
      <RouterLink to="myTrips"><Button buttonText="Meine Fahrten"></Button></RouterLink>
      <div class="favorites mt-5">
        <p class="text-2xl w-11/12 mx-auto mb-3">Favoriten</p>
        <TripBanner>

        </TripBanner>
      </div>
    </div>
  </main>
</template>
