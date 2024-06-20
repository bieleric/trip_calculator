<script setup>
  import { ref } from 'vue';
  import BaseLayout from '@/layouts/BaseLayout.vue';
  import { deleteUser, inviteUser } from '@/services/apiRequests';
  import { getUser, isSuperUser } from '@/services/helpers';
  import { useUserStore } from '@/stores/userStore';
  import ConfirmDeletionModal from '@/components/ConfirmDeletionModal.vue';
  import Button from '@/components/Button.vue';
  import TextInput from '@/components/inputs/TextInput.vue';
  import RadioButtonGroup from '@/components/inputs/RadioButtonGroup.vue';

  const userStore = useUserStore();

  let isDeleteModalOpen = ref(false);
  let userToDelete = ref(null);
  let deletionText = ref('');
  let selectedRole = ref('2');
  let email = ref('');
  let name = ref('');
  let message = ref('');
  let error = ref(false);

  const openDeleteModal = (user) => {
    isDeleteModalOpen.value = true;
    userToDelete.value = user;
    deletionText.value = 'Sind Sie sicher, dass Sie ' + userToDelete.value.name + ' entfernen wollen?';
  }

  const deleteUserByEmail = (userId) => {
    deleteUser(userId);
    isDeleteModalOpen.value = false;
  }

  const inviteUserToJoin = () => {
    const currentUser = getUser();
    inviteUser(email, name, selectedRole, currentUser.groupId)
    .then(response => {
        message.value = "Einladung wurde versendet.";
        error.value = false;
    })
    .catch(err => {
        message.value = "Fehler! Einladung konnte nicht versendet werden.";
        error.value = true;
    });
  }
</script>

<template>
  <BaseLayout>
    <div class="users">
      <p class="text-2xl w-11/12 md:w-3/4 mx-auto mb-3">Nutzer einladen</p>
      <div class="addUser w-11/12 md:w-3/4 mx-auto">
        <form @submit.prevent="inviteUserToJoin">
          <TextInput
            type="text"
            name="Name"
            v-model="name"
          ></TextInput>
          <TextInput
            type="email"
            name="E-Mail"
            v-model="email"
          ></TextInput>
          <RadioButtonGroup 
            name="Rolle" 
            :options="[{ text: 'Administrator', value: '1' }, { text: 'Nutzer', value: '2' }]"
            v-model="selectedRole"
          ></RadioButtonGroup>
          <p v-if="message" :class="{ 'error mb-3': true, 'text-red-500': error, 'text-green-500': !error }">{{ message }}</p>
          <button type="submit" class="block mx-auto"><Button button-text="Einladung senden"></Button></button>
        </form>
      </div>
      <p class="text-2xl w-11/12 md:w-3/4 mx-auto mb-3 mt-20">Aktiv</p>
      <div v-for="user in userStore.getActiveUsers" class="w-full md:w-3/4 bg-zinc-700 px-2 py-3 mx-auto mb-4">
        <p class="text-xl">{{ user.name }}</p>
        <div class="grid grid-cols-8 mt-4 text-zinc-400 text-sm">
            <p class="col-span-6">E-Mail</p>
            <p class="col-span-2">Rolle</p>
        </div>
        <div class="grid grid-cols-8 text-lg">
            <p class="col-span-6">{{ user.email }}</p>
            <p class="col-span-2">{{ user.role_name }}</p>
        </div>
        <div class="border-t border-zinc-600 mt-4"></div>
        <p v-if="user.role_id !== 0" @click="openDeleteModal(user)" class="text-red-500 text-center mt-3 cursor-pointer">Entfernen</p>
        <p v-else class="text-zinc-400 text-center mt-3">Dieser Nutzer kann nicht entfernt werden</p>
      </div>
      <p class="text-2xl w-11/12 md:w-3/4 mx-auto mb-3 mt-12">Eingeladen</p>
      <p v-if="userStore.getInactiveUsers.length === 0" class="text-sm text-center">Keine ausstehenden Einladung</p>
      <div v-for="user in userStore.getInactiveUsers" class="w-full md:w-3/4 bg-zinc-700 px-2 py-3 mx-auto mb-4">
        <p class="text-xl">{{ user.name }}</p>
        <div class="grid grid-cols-8 mt-4 text-zinc-400 text-sm">
            <p class="col-span-6">E-Mail</p>
            <p class="col-span-2">Rolle</p>
        </div>
        <div class="grid grid-cols-8 text-lg">
            <p class="col-span-6">{{ user.email }}</p>
            <p class="col-span-2">{{ user.role_name }}</p>
        </div>
        <div class="border-t border-zinc-600 mt-4"></div>
        <p @click="openDeleteModal(user)" class="text-red-500 text-center mt-3 cursor-pointer">Entfernen</p>
      </div>
    </div>

    <ConfirmDeletionModal
      :isOpen="isDeleteModalOpen"
      title='Nutzer entfernen'
      :text="deletionText"
      @close="isDeleteModalOpen = false"
      @confirm="deleteUserByEmail(userToDelete.id)"
    />
  </BaseLayout>
</template>
