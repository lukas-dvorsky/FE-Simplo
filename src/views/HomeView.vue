<script setup lang="ts">
import { useCustomersStore } from '@/stores/customer.ts'
import { onMounted } from 'vue'
import Group from '@/components/Group.vue'
import CustomerForm from '@/components/CustomerForm.vue'
import GroupForm from '@/components/GroupForm.vue'
import Modal from '@/components/Modal.vue'
import { useGroupsStore } from '@/stores/group'
import { useGroupCustomerStore } from '@/stores/group_customer'
import CustomerSearch from '@/components/CustomerSearch.vue'

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
  <div class="layout">
    <aside>
      <h1 class="title">FE-SIMPLO</h1>
      <Modal :form="GroupForm" button-text="Create Group" />
      <Group v-for="group in groupStore.groups" :key="group.id" :group="group" />
    </aside>
    <main class="container">
      <section>
        <div style="margin: 2rem 0">
          <Modal :form="CustomerForm" button-text="Create Customer" />
        </div>
        <CustomerSearch />
      </section>
    </main>
  </div>
</template>
