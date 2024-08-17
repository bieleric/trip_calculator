<script setup>
  import { ref } from 'vue';
  import BaseLayout from '@/layouts/BaseLayout.vue';
  import { useGroupAndRoleStore } from '@/stores/groupAndRoleStore';
  import ConfirmDeletionModal from '@/components/ConfirmDeletionModal.vue';
  import Button from '@/components/Button.vue';
  import GroupBanner from '@/components/GroupBanner.vue';
  import { leaveGroupByGroupId } from '@/services/apiRequests';

  const groupAndRoleStore = useGroupAndRoleStore();
  let isDeleteModalOpen = ref(false);
  let groupToDelete = ref(null);
  let deletionText = ref('');

  const openDeleteModal = (group) => {
    isDeleteModalOpen.value = true;
    groupToDelete.value = group;
    deletionText.value = 'Sind Sie sicher, dass Sie die Gruppe ' + group.group_name + ' verlassen wollen?';
  }

  const leaveGroup = (groupId) => {
    leaveGroupByGroupId(groupId);
    isDeleteModalOpen.value = false;
  }
</script>

<template>
  <BaseLayout>
    <div class="finance">
      <p class="text-2xl w-11/12 md:w-3/4 mx-auto mb-3">Gruppen</p>
      <div class="groups w-11/12 md:w-3/4 mx-auto">
        <Button buttonText="Gruppe beitreten" class="mb-4 mt-5"></Button>
        <Button buttonText="Gruppe erstellen"></Button>
        <div class="myGroups mt-5">
          <p class="text-xl mx-auto mb-3">Meine Gruppen</p>
            <div v-for="group in groupAndRoleStore.getGroups">
              <GroupBanner @leaveGroup="openDeleteModal(group)" :groupName="group.group_name" :groupId="group.group_id" :selected="group.selected ? true : false" :roleName="group.role_name" :roleId="group.role_id"></GroupBanner>
              <div class="w-11/12 md:w-3/4 mx-auto border-b border-zinc-400 my-2"></div>
            </div>
            <p v-if="groupAndRoleStore.getGroups.length === 0" class="text-sm text-center">Keine Gruppe gefunden</p>
        </div>
      </div>
    </div>

    <ConfirmDeletionModal
      :isOpen="isDeleteModalOpen"
      title='Gruppe verlassen'
      :text="deletionText"
      confirmButtonText='Verlassen'
      @close="isDeleteModalOpen = false"
      @confirm="leaveGroup(groupToDelete.group_id)"
    />
  </BaseLayout>
</template>
