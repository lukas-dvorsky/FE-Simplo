<script setup lang="ts">
import type { Group } from '@/stores/group'
import { defineProps, defineEmits } from 'vue'

const emit = defineEmits<{
  (e: 'handleGroupRemove', id: string): void
}>()

const props = defineProps<{
  data: Group
}>()
</script>

<template>
  <span>{{ props.data.name }}</span>
  <button type="button" @click="emit('handleGroupRemove', props.data.id)">x</button>
</template>
