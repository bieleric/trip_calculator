<script setup>
  import { ref } from 'vue';
  import BaseLayout from '@/layouts/BaseLayout.vue';
  import { createInvitation, removeUserFromGroup } from '@/services/apiRequests';
  import { useUserStore } from '@/stores/userStore';
  import ConfirmDeletionModal from '@/components/ConfirmDeletionModal.vue';
  import Button from '@/components/Button.vue';
  import { useGroupAndRoleStore } from '@/stores/groupAndRoleStore';

  const userStore = useUserStore();
  const groupAndRoleStore = useGroupAndRoleStore();
  const groupId = groupAndRoleStore.getCurrentGroup.group_id;

  let invitationLink = ref('');
  let isDeleteModalOpen = ref(false);
  let userToDelete = ref(null);
  let deletionText = ref('');
  let message = ref('');
  let error = ref(false);

  const openDeleteModal = (user) => {
    isDeleteModalOpen.value = true;
    userToDelete.value = user;
    deletionText.value = 'Sind Sie sicher, dass Sie ' + userToDelete.value.name + ' entfernen wollen?';
  }

  const removeUserByEmail = (userId) => {
    removeUserFromGroup(userId, groupId);
    isDeleteModalOpen.value = false;
  }

  const createInvitationLink = () => {
    createInvitation(groupId)
    .then(response => {
        invitationLink.value = response
        error.value = false;
    })
    .catch(err => {
        message.value = "Fehler! Einladung konnte nicht versendet werden.";
        error.value = true;
    });
  }

  // TODO: differentiate between active and inactive users
</script>

<template>
  <BaseLayout>
    <div class="users mb-5">
      <p class="text-2xl w-11/12 md:w-3/4 mx-auto mb-3">Einladungslink erstellen</p>
      <div class="createInvitation w-11/12 md:w-3/4 mx-auto">
        <div class="my-3 grid justify-items-center">
            <input v-model="invitationLink" name="invitationLink" type="text" class="w-80 text-sm px-4 py-3 outline-none border-2 focus:border-slate-500 text-zinc-800" />
        </div>
        <form @submit.prevent="createInvitationLink">
          <p v-if="message" :class="{ 'error mb-3': true, 'text-red-500': error, 'text-green-500': !error }">{{ message }}</p>
          <button type="submit" class="block mx-auto"><Button button-text="Erstellen"></Button></button>
        </form>
      </div>
      <p class="text-2xl w-11/12 md:w-3/4 mx-auto mb-3 mt-10">Aktiv</p>
      <div v-for="user in userStore.getAllUsers" class="w-full md:w-3/4 bg-zinc-700 px-2 py-3 mx-auto mb-4">
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
    </div>

    <ConfirmDeletionModal
      :isOpen="isDeleteModalOpen"
      title='Nutzer entfernen'
      :text="deletionText"
      confirmButtonText='Entfernen'
      @close="isDeleteModalOpen = false"
      @confirm="removeUserByEmail(userToDelete.id)"
    />
  </BaseLayout>
</template>
