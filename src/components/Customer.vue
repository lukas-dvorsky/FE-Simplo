<script setup lang="ts">
import type { Customer } from '@/stores/customer'
import { useCustomersStore } from '@/stores/customer'
import { defineProps, ref } from 'vue'
import Modal from '@/components/Modal.vue'
import AddCustomer from '@/components/AddCustomer.vue'

const store = useCustomersStore()
const showModal = ref(false)

const props = defineProps<{
  customer: Customer
}>()
</script>

<template>
  <div>
    <h3>{{ customer.name }} {{ customer.surname }}</h3>
    <p>{{ customer.email }}</p>
    <p>{{ customer.phone }}</p>
  </div>
  <button @click="showModal = !showModal">Edit</button>
  <Modal v-if="showModal" :form="AddCustomer" :data="customer" />

  <button @click="store.deleteCustomer(customer.id)">Delete</button>
</template>
