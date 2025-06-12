<script setup lang="ts">
import { defineProps } from 'vue'
import type { Component } from 'vue'
import { useCustomersStore, type Customer } from '@/stores/customer'
import { ref } from 'vue'
import { type Group } from '@/stores/group'

const props = defineProps<{
  form: Component
  data?: Customer | Group
}>()

const buttonText = ref('')
const showModal = ref(false)

props.data ? (buttonText.value = 'Update') : (buttonText.value = 'Create')

const handleButtonClick = () => {
  showModal.value = !showModal.value
}
</script>

<template>
  <component v-if="showModal" :is="form" :data="data" @hideModal="handleButtonClick" />
  <button @click="handleButtonClick">{{ buttonText }}</button>
</template>
