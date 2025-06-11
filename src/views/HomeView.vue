<script setup lang="ts">
import { useCustomersStore } from '@/stores/customer.ts'
import { onMounted } from 'vue'
import Customer from '@/components/Customer.vue'
import AddCustomer from '@/components/AddCustomer.vue'
import Modal from '@/components/Modal.vue'
import { ref } from 'vue'

const store = useCustomersStore()

const showModal = ref(false)

onMounted(() => {
  store.readCustomer()
})
</script>

<template>
  <main>
    <section>
      <button @click="showModal = !showModal">Add Customer</button>
      <Modal v-if="showModal" :form="AddCustomer" />
    </section>
    <section>
      <div>
        <!-- SEARCH BAR -->
      </div>
      <div>
        <!-- CUSTOMERS LIST -->
        <Customer v-for="customer in store.customers" :key="customer.id" :customer="customer" />
      </div>
    </section>
  </main>
</template>
