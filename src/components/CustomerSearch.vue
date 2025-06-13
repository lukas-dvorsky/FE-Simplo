<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCustomersStore } from '@/stores/customer'
import { useGroupsStore } from '@/stores/group'
import { useGroupCustomerStore } from '@/stores/group_customer'
import Customer from '@/components/Customer.vue'

const searchQuery = ref('')

const customerStore = useCustomersStore()
const groupStore = useGroupsStore()
const groupCustomerStore = useGroupCustomerStore()

const filteredCustomers = computed(() => {
  const query = searchQuery.value.toLowerCase()

  return customerStore.customers.filter((customer) => {
    const matchBasic =
      customer.name.toLowerCase().includes(query) ||
      customer.surname.toLowerCase().includes(query) ||
      customer.email.toLowerCase().includes(query) ||
      customer.phone.toLowerCase().includes(query)

    let matchGroup = false

    groupCustomerStore.groupCustomer.forEach((gc) => {
      if (gc.id_customer === customer.id) {
        const group = groupStore.groups.find((g) => g.id === gc.id_group)
        if (group && group.name.toLowerCase().includes(query)) {
          matchGroup = true
        }
      }
    })

    return matchBasic || matchGroup
  })
})
</script>

<template>
  <div>
    <input v-model="searchQuery" placeholder="Search by name, email, phone or group..." />
    <div>
      <Customer v-for="customer in filteredCustomers" :key="customer.id" :customer="customer" />
    </div>
  </div>
</template>

<style scoped>
input {
  margin-bottom: 16px;
  padding: 8px;
  width: 100%;
  box-sizing: border-box;
}
</style>
