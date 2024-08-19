<script setup>
    import { ref } from 'vue';
    import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
    import { faStar } from '@fortawesome/free-solid-svg-icons';
    import ConfirmDeletionModal from './ConfirmDeletionModal.vue';
    import { deleteFavorite, deleteTrip } from '@/services/apiRequests';
    import { formatDate } from '@/services/helpers';
    import { useSettingsStore } from '@/stores/settingsStore';
    import { useClosingsStore } from '@/stores/closingsStore';

    const props = defineProps({
        favoritesBanner: Boolean,
        closing: Boolean,
        data: Object,
    })

    const settingsStore = useSettingsStore();
    const closingsStore = useClosingsStore();

    let isDeleteModalOpen = ref(false);
    let favoriteToDelete = ref(null);
    let tripToDelete = ref(null);
    let modalTitle = ref('');
    let deletionText = ref('');
    let date = ref('');

    const isClosed = (date) => {
        const month = new Date(date).getMonth();
        const year = new Date(date).getFullYear();

        return closingsStore.getAllClosings.find((closing) => {
            const closingMonth = new Date(closing.period).getMonth();
            const closingYear = new Date(closing.period).getFullYear();
            return closingMonth === month && closingYear === year && closing.closed === 1;
        });
    };

    const openDeleteModal = (data) => {
        if(props.favoritesBanner) {
            isDeleteModalOpen.value = true;
            modalTitle = 'Aus Favoriten entfernen';
            deletionText.value = 'Sind Sie sicher, dass Sie die Fahrt aus Ihren Favoriten entfernen wollen?';
            favoriteToDelete.value = data;
        }
        else if(!props.favoritesBanner) {
            isDeleteModalOpen.value = true;
            modalTitle = 'Fahrt entfernen';
            deletionText.value = 'Sind Sie sicher, dass Sie die Fahrt entfernen wollen?';
            tripToDelete.value = data;
        }
    }

    const deleteFavoriteById = (favoriteId) => {
        deleteFavorite(favoriteId);
        isDeleteModalOpen.value = false;
    }

    const deleteTripById = (tripId) => {
        deleteTrip(tripId);
        isDeleteModalOpen.value = false;
    }

    const confirmDeletion = () => {
        if(favoriteToDelete.value) {
            deleteFavoriteById(favoriteToDelete.value.id);
        }
        else if(tripToDelete.value) {
            deleteTripById(tripToDelete.value.id);
        }
    }

    const singleTrip = props.data.single_trip === 0 ? 'Hin- und Rückfahrt' : 'Einzelfahrt';
    const transportType = props.data.transport === 'car' ? 'Auto' : 'Zug';
    date.value = props.data.date ? formatDate(props.data.date) : null;
    let costs = 0;

    if(props.data.transport === 'car') {
        const closing = closingsStore.getClosingByMonthAndYear(new Date(props.data.date).getMonth() + 1, Number(new Date(props.data.date).getFullYear()));
        const pricePerKilometer = isClosed(props.data.date) ? closing.price_per_kilometer : settingsStore.getPricePerKilometer;
        costs = props.data.single_trip === 0 ? (props.data.distance * pricePerKilometer * 2).toFixed(2) : (props.data.distance * pricePerKilometer).toFixed(2);
    }
    else {
        costs = props.data.single_trip === 0  ? (props.data.costs * 2).toFixed(2) : Number(props.data.costs).toFixed(2);
    }
</script>

<template>
    <div class="w-full md:w-3/4 bg-zinc-700 px-2 py-3 mx-auto mb-4">
        <div class="grid grid-cols-8 text-zinc-400 text-sm">
            <p class="col-span-3 text-left">{{ singleTrip }}</p>
            <p class="col-span-2 text-center">{{ transportType }}</p>
            <p @click="openDeleteModal(data)" v-if="favoritesBanner" class="col-span-3 text-right pr-2 cursor-pointer text-yellow-500">
                <FontAwesomeIcon :icon="faStar" />
            </p>
            <p v-if="!favoritesBanner" class="col-span-3 text-right pr-2">{{ date }}</p>
        </div>
        <div class="border-t border-zinc-600 mt-3"></div>
        <div class="grid grid-cols-8 mt-4 text-zinc-400 text-sm mt-5">
            <p class="col-span-3">von</p>
            <p class="col-span-3">nach</p>
            <p class="col-span-2">Gesamtkosten</p>
        </div>
        <div class="grid grid-cols-8 text-lg">
            <p class="col-span-3">{{ data.start }}</p>
            <p class="col-span-3">{{ data.destination }}</p>
            <p class="col-span-2">{{ costs }}€</p>
        </div>
        <div v-if="!props.closing" class="border-t border-zinc-600 mt-5"></div>
        <div v-if="!props.closing && isClosed(data.date)" class="text-center text-zinc-400 pt-2">Abgeschlossen</div>
        <div v-if="!props.closing && !isClosed(data.date)" class="grid grid-cols-2">
            <RouterLink v-if="favoritesBanner" class="col-span-2" :to="{ name: 'newTrip', query: {
                transport: data.transport,
                start: data.start, 
                destination: data.destination,
                costs: data.costs,
                distance: data.distance,
                singleTrip: data.single_trip,
                favorite: true,
                favoriteId: data.id
            }}">
                <p class="text-center mt-3 cursor-pointer">Fahrt hinzufügen</p>
            </RouterLink>
            <RouterLink v-if="!favoritesBanner" class="col-span-1" 
                :to="{
                    name: 'newTrip', 
                    query: {
                        transport: data.transport,
                        start: data.start, 
                        destination: data.destination,
                        costs: data.costs,
                        distance: data.distance,
                        singleTrip: data.single_trip,
                        date: data.date,
                        tripId: data.id,
                        edit: true
                    }
                }">
                <p class="text-center mt-3 cursor-pointer text-zinc-400">Bearbeiten</p>
            </RouterLink>
            <p v-if="!favoritesBanner" @click="openDeleteModal(data)" class="col-span-1 text-center mt-3 cursor-pointer border-right border-zinc-600 text-red-500">Löschen</p>
        </div>
    </div>

    <ConfirmDeletionModal
        :isOpen="isDeleteModalOpen"
        :title="modalTitle"
        :text="deletionText"
        confirmButtonText='Entfernen'
        @close="isDeleteModalOpen = false"
        @confirm="confirmDeletion()"
    />
</template>