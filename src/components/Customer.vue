<script setup lang="ts">
import type { Customer } from '@/stores/customer'
import { useCustomersStore } from '@/stores/customer'
import { defineProps, ref } from 'vue'
import Modal from '@/components/Modal.vue'
import AddCustomer from '@/components/CustomerForm.vue'

const store = useCustomersStore()

const props = defineProps<{
  customer: Customer
}>()

const handleDeleteCustomer = () => {
  if (
    window.confirm(
      `Do you really want to remove customer: ${props.customer.name} ${props.customer.surname}`,
    )
  ) {
    store.deleteCustomer(props.customer.id)
  }
}
</script>

<template>
  <div>
    <h3>{{ customer.name }} {{ customer.surname }}</h3>
    <p>{{ customer.email }}</p>
    <p>{{ customer.phone }}</p>
  </div>
  <Modal :form="AddCustomer" :data="customer" />

  <button @click="handleDeleteCustomer">Delete</button>
</template>
