<script setup lang="ts">
import type { Customer } from '@/stores/customer'
import { useCustomersStore } from '@/stores/customer'
import { defineProps, onMounted, ref } from 'vue'
import Modal from '@/components/Modal.vue'
import AddCustomer from '@/components/CustomerForm.vue'
import CustomerTag from '@/components/CustomerTag.vue'
import { useGroupCustomerStore } from '@/stores/group_customer'

const customerStore = useCustomersStore()
const groupCustomerStore = useGroupCustomerStore()

const props = defineProps<{
  customer: Customer
}>()

onMounted(() => {
  groupCustomerStore.groupCustomer
})

const handleDeleteCustomer = () => {
  if (
    window.confirm(
      `Do you really want to remove customer: ${props.customer.name} ${props.customer.surname}`,
    )
  ) {
    customerStore.deleteCustomer(props.customer.id)
  }
}
</script>

<template>
  <div>
    <h3>{{ customer.name }} {{ customer.surname }}</h3>
    <p>{{ customer.email }}</p>
    <p>{{ customer.phone }}</p>
  </div>
  <div>
    <!-- <CustomerTag :tag-name="" /> -->
  </div>
  <Modal :form="AddCustomer" :data="customer" />

  <button @click="handleDeleteCustomer">Delete</button>
</template>
