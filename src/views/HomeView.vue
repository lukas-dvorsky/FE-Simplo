<script setup lang="ts">
import { useCustomersStore } from '@/stores/customer.ts'
import { onMounted } from 'vue'
import Customer from '@/components/Customer.vue'
import Group from '@/components/Group.vue'
import CustomerForm from '@/components/CustomerForm.vue'
import GroupForm from '@/components/GroupForm.vue'
import Modal from '@/components/Modal.vue'
import { useGroupsStore } from '@/stores/group'
import { useGroupCustomerStore } from '@/stores/group_customer'

const customerStore = useCustomersStore()
const groupStore = useGroupsStore()
const groupCustomerStore = useGroupCustomerStore()

onMounted(() => {
  customerStore.readCustomer()
  groupStore.readGroup()
  groupCustomerStore.readGroupCustomer()
})
</script>

<template>
  <main>
    <section>
      <Modal :form="GroupForm" />
      <div>
        <Group v-for="group in groupStore.groups" :key="group.id" :group="group" />
      </div>
    </section>
    <section>
      <Modal :form="CustomerForm" />
      <div>
        <!-- SEARCH BAR -->
      </div>
      <div>
        <!-- CUSTOMERS LIST -->
        <Customer
          v-for="customer in customerStore.customers"
          :key="customer.id"
          :customer="customer"
        />
      </div>
    </section>
  </main>
</template>

<style scoped>
main {
  display: flex;
  gap: 400px;
}
</style>
