<script setup lang="ts">
import { defineProps } from 'vue'
import type { Component } from 'vue'
import { useCustomersStore, type Customer } from '@/stores/customer'
import { ref } from 'vue'
import { type Group } from '@/stores/group'

const props = defineProps<{
  form: Component
  data?: Customer | Group
  buttonText?: String
}>()

const showModal = ref(false)

const handleButtonClick = () => {
  showModal.value = !showModal.value
}
</script>

<template>
  <component v-if="showModal" :is="form" :data="data" @hideModal="handleButtonClick" />
  <button @click="handleButtonClick" :class="['button', data ? 'button--small' : 'button--large']">
    <font-awesome-icon v-if="data" :icon="['fas', 'pen']" />
    {{ buttonText }}
  </button>
</template>
