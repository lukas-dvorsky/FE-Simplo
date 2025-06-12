<script setup lang="ts">
import { defineProps } from 'vue'
import { useGroupsStore, type Group } from '@/stores/group'
import GroupForm from './GroupForm.vue'
import Modal from '@/components/Modal.vue'

const store = useGroupsStore()

const props = defineProps<{
  group: Group
}>()

const handleDeleteGroup = () => {
  if (window.confirm(`Do you really want to remove group: ${props.group.name}`)) {
    store.deleteGroup(props.group.id)
  }
}
</script>

<template>
  <div>
    <span>{{ props.group.name }}</span>
    <Modal :form="GroupForm" :data="group" />
    <button @click="handleDeleteGroup">Delete</button>
  </div>
</template>
