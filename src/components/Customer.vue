<script setup lang="ts">
import type { Customer } from '@/stores/customer'
import { useCustomersStore } from '@/stores/customer'
import { defineProps, computed } from 'vue'
import Modal from '@/components/Modal.vue'
import AddCustomer from '@/components/CustomerForm.vue'
import CustomerTag from '@/components/CustomerTag.vue'
import { useGroupCustomerStore } from '@/stores/group_customer'
import { useGroupsStore, type Group } from '@/stores/group'

const customerStore = useCustomersStore()
const groupCustomerStore = useGroupCustomerStore()
const groupsStore = useGroupsStore()

const props = defineProps<{
  customer: Customer
}>()

const customerGroups = computed(() => {
  const customerGroupConnections = groupCustomerStore.groupCustomer.filter(
    (gc) => gc.id_customer === props.customer.id,
  )

  return customerGroupConnections
    .map((gc) => groupsStore.groups.find((group) => group.id === gc.id_group))
    .filter((g): g is Group => !!g)
})

const handleDeleteCustomer = async () => {
  if (
    window.confirm(
      `Do you really want to remove customer: ${props.customer.name} ${props.customer.surname}?`,
    )
  ) {
    const connections = groupCustomerStore.groupCustomer.filter(
      (groupcustomer) => groupcustomer.id_customer === props.customer.id,
    )

    connections.forEach(async (connection) => {
      await groupCustomerStore.deleteGroupCustomer(connection.id)
    })

    await customerStore.deleteCustomer(props.customer.id)
  }
}
</script>

<template>
  <tr>
    <td>{{ customer.name }}</td>
    <td>{{ customer.surname }}</td>
    <td>{{ customer.email }}</td>
    <td class="table-tags">
      <CustomerTag v-for="group in customerGroups" :key="group.id" :tag-name="group.name" />
    </td>
    <td>
      <Modal :form="AddCustomer" :data="customer" />
      <button @click="handleDeleteCustomer" class="button button--small">
        <font-awesome-icon :icon="['fas', 'trash']" />
      </button>
    </td>
  </tr>
</template>
