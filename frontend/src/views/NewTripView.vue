<script setup>
  import { computed, ref, watch } from 'vue';
  import BaseLayout from '@/layouts/BaseLayout.vue';
  import Button from '@/components/Button.vue';
  import RadioButtonGroup from '@/components/inputs/RadioButtonGroup.vue';
  import TextInput from '@/components/inputs/TextInput.vue';
  import Switch from '@/components/inputs/Switch.vue';
  import { addTrip, updateTrip, updateFavorite } from '@/services/apiRequests';

  const props = defineProps({
    transport: {
      type: String,
      default: ''
    },
    start: {
      type: String,
      default: ''
    },
    destination: {
      type: String,
      default: ''
    },
    costs: {
      type: String,
      default: '0'
    },
    distance: {
      type: String,
      default: '0'
    },
    singleTrip: {
      type: String,
      default: '1'
    },
    date: {
      type: String,
      default: ''
    },
    edit:{
      type: Boolean,
      default: false
    },
    tripId: {
      type: String,
      default: ''
    },
    favorite: {
      type: Boolean,
      default: false
    },
    favoriteId: {
      type: String,
      default: ''
    },
  });

  let selectedTransportType = ref('');
  let start = ref('');
  let destination = ref('');
  let costsOrDistance = ref('0');
  let withReturn = ref(false);
  let date = ref('');
  let favorites = ref(false);
  let message = ref('');
  let error = ref(false);

  const initializeRefs = () => {
    selectedTransportType.value = props.transport ? props.transport : '';
    start.value = props.start ? props.start : '';
    destination.value = props.destination ? props.destination : '';
    withReturn.value = props.singleTrip === '1' ? false : true;
    costsOrDistance.value = props.costs ? props.costs : props.distance;
    date.value = props.date ? props.date : '';
  }

  initializeRefs();

  const costsOrDistanceName = computed(() => {
    return selectedTransportType.value === 'car' ? 'Distanz' : 'Kosten'
  });

  const unit = computed(() => {
    return selectedTransportType.value === 'car' ? 'km' : '€'

  });

  const optionalInformation = computed(() => {
    const label = selectedTransportType.value === 'car' ? 'Gesamtdistanz' : 'Gesamtkosten';
    return withReturn.value ? "(" + label + ": " + Number(costsOrDistance.value) * 2 + unit.value + ")" : "";
  });

  const addOrUpdateTrip = () => {
    const costs = selectedTransportType.value === 'car' ? null : costsOrDistance.value;
    const distance = selectedTransportType.value === 'car' ? costsOrDistance.value : null;
    
    if(props.edit) {
      updateTrip(props.tripId, selectedTransportType.value, start.value, destination.value, costs, distance, !withReturn.value, date.value)
      .then(response => {
          message.value = "Änderungen wurden gespeichert.";
          error.value = false;
      })
      .catch(err => {
          message.value = "Fehler! Fahrt konnte nicht geändert werden.";
          error.value = true;
      });
    }
    else {
      addTrip(selectedTransportType.value, start.value, destination.value, costs, distance, !withReturn.value, date.value, favorites.value)
      .then(response => {
          message.value = "Fahrt wurde hinzugefügt.";
          error.value = false;
      })
      .catch(err => {
          message.value = "Fehler! Fahrt konnte nicht hinzugefügt werden.";
          error.value = true;
      });
    }
  }

  const updateFavoriteInFavorites = () => {
    if(favorites) {
      const costs = selectedTransportType.value === 'car' ? null : costsOrDistance.value;
      const distance = selectedTransportType.value === 'car' ? costsOrDistance.value : null;

      updateFavorite(props.favoriteId, selectedTransportType.value, start.value, destination.value, costs, distance, !withReturn.value)
      .then(response => {
          message.value = "Änderungen wurden übernommen.";
          error.value = false;
      })
      .catch(err => {
          message.value = "Fehler! Favoriten konnten nicht aktualisiert werden.";
          error.value = true;
      });
    }
  }
</script>

<template>
  <BaseLayout>
    <div class="users">
      <p v-if="!props.edit" class="text-2xl w-11/12 md:w-3/4 mx-auto mb-3">Neue Fahrt hinzufügen</p>
      <p v-if="props.edit" class="text-2xl w-11/12 md:w-3/4 mx-auto mb-3">Fahrt bearbeiten</p>
      <div class="addUser w-11/12 md:w-3/4 mx-auto">
        <form @submit.prevent="addOrUpdateTrip">
          <RadioButtonGroup 
            name="Verkehrsmittel" 
            :options="[{ text: 'Auto', value: 'car' }, { text: 'Zug', value: 'train' }]"
            v-model="selectedTransportType"
          ></RadioButtonGroup>
          <TextInput
            type="text"
            name="Von"
            v-model="start"
          ></TextInput>
          <TextInput
            type="text"
            name="Nach"
            v-model="destination"
          ></TextInput>
          <TextInput
            type="number"
            :name="costsOrDistanceName"
            :unit="unit"
            v-model="costsOrDistance"
          ></TextInput>
          <Switch
            name="Rückfahrt"
            :optionalInformation="optionalInformation"
            v-model="withReturn"
          ></Switch>
          <input type="date" :class="{'mt-5': true, 'mb-10': favorite || props.edit, 'mb-5': !favorite }" v-model="date" required />
          <Switch
            v-if="!favorite && !props.edit"
            name="Favoriten"
            v-model="favorites"
            class="mb-10"
          ></Switch>
          <p v-if="message" :class="{ 'error mb-3': true, 'text-red-500': error, 'text-green-500': !error }">{{ message }}</p>
          <button v-if="favorite" type="button" @click="updateFavoriteInFavorites" class="block mx-auto mb-5"><Button button-text="Für Favorit übernehmen"></Button></button>
          <button type="submit" class="block mx-auto"><Button :button-text="!props.edit ? 'Fahrt hinzufügen' : 'Änderungen speichern'"></Button></button>
        </form>
      </div>
    </div>
  </BaseLayout>
</template>
