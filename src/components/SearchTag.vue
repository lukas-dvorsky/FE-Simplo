<script setup lang="ts">
import type { Group } from '@/stores/group'
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{
  group: Group
}>()

const emit = defineEmits<{
  (e: 'select', group: Group): void
}>()
</script>

<template>
  <button type="button" @mousedown.prevent="emit('select', props.group)">
    {{ props.group.name }}
  </button>
</template>
