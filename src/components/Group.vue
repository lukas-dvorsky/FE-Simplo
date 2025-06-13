<script setup lang="ts">
import { defineProps } from 'vue'
import { useGroupsStore, type Group } from '@/stores/group'
import GroupForm from './GroupForm.vue'
import Modal from '@/components/Modal.vue'
import { useGroupCustomerStore } from '@/stores/group_customer'

const groupCustomerStore = useGroupCustomerStore()
const groupsStore = useGroupsStore()

const props = defineProps<{
  group: Group
}>()

const handleDeleteGroup = async () => {
  if (window.confirm(`Do you really want to remove group: ${props.group.name}`)) {
    groupsStore.deleteGroup(props.group.id)
    const connections = groupCustomerStore.groupCustomer.filter(
      (groupcustomer) => groupcustomer.id_group === props.group.id,
    )

    connections.forEach(async (connection) => {
      await groupCustomerStore.deleteGroupCustomer(connection.id)
    })

    await groupsStore.deleteGroup(props.group.id)
  }
}
</script>

<template>
  <div class="group-item">
    <span class="text-medium">{{ props.group.name }}</span>
    <div>
      <Modal :form="GroupForm" :data="group" />
      <button @click="handleDeleteGroup" class="button button--small">
        <font-awesome-icon :icon="['fas', 'trash']" />
      </button>
    </div>
  </div>
</template>
