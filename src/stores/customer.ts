import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface Customer {
  id: string
  name: string
  surname: string
  email: string
  phone: string
}

export interface CustomerGroups {
  id: string
  id_group: string
  id_customer: string
}

export const useCustomersStore = defineStore('customers', () => {
  const customers = ref<Customer[]>([])
  const customerGroups = ref<CustomerGroups[]>([])
  const isLoading = ref(true)

  const createCustomer = async (values: Omit<Customer, 'id'>) => {
    try {
      const response = await fetch('http://localhost:3000/customers', {
        method: 'POST',
        body: JSON.stringify(values),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const newCustomer = await response.json()
      alert('Customer added succesfully')
      return newCustomer
    } catch (err) {
      alert(err)
    }
  }

  const readCustomer = async () => {
    isLoading.value = true
    try {
      const response = await fetch('http://localhost:3000/customers')
      const data = await response.json()
      customers.value = data
    } catch (error) {
      console.error('Error loading customers:', error)
    } finally {
      isLoading.value = false
    }
  }

  const updateCustomer = async (id: string, updatedData: Omit<Customer, 'id'>) => {
    try {
      await fetch(`http://localhost:3000/customers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      })
      readCustomer()
      alert('Customer updated succesfully')
    } catch (err) {
      alert(err)
    }
  }

  const deleteCustomer = async (id: String) => {
    try {
      await fetch(`http://localhost:3000/customers/${id}`, {
        method: 'DELETE',
      })
      readCustomer()
      alert('Customer deleted succesfully')
    } catch (err) {
      alert(err)
    }
  }

  const readGroupsForCustomer = async (customerId: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/group_customer?id_customer=${customerId}&_expand=group`,
      )
      const data = await response.json()
      return data
    } catch (err) {
      alert(err)
    }
  }

  return {
    customers,
    isLoading,
    createCustomer,
    readCustomer,
    updateCustomer,
    deleteCustomer,
    readGroupsForCustomer,
  }
})
