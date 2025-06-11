import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface Customer {
  id: string
  name: string
  surname: string
  email: string
  phone: string
}

export const useCustomersStore = defineStore('customers', () => {
  const customers = ref<Customer[]>([])
  const isLoading = ref(true)

  const createCustomer = async (values: any) => {
    try {
      await fetch('http://localhost:3000/customers', {
        method: 'POST',
        body: JSON.stringify(values),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      alert('Customer added succesfully')
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

  return { customers, isLoading, createCustomer, readCustomer, updateCustomer, deleteCustomer }
})
