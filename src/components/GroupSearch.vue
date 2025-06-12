<script setup lang="ts">
import { useGroupsStore, type Group } from '@/stores/group'
import SearchTag from '@/components/SearchTag.vue'
import { defineEmits, ref } from 'vue'

const groupStore = useGroupsStore()

const searchTerm = ref('')
const showTags = ref(false)

const emit = defineEmits<{
  (e: 'selectGroup', group: Group): void
}>()
</script>

<template>
  <div @focusin="showTags = true" @focusout="showTags = false">
    <input type="text" v-model="searchTerm" />
    <SearchTag
      v-if="showTags"
      v-for="group in groupStore.groups.filter((group) =>
        group.name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase().trim()),
      )"
      :key="group.id"
      :group="group"
      @select="emit('selectGroup', $event)"
    />
  </div>
</template>
