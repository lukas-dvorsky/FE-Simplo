import { ref } from 'vue'
import { defineStore } from 'pinia'

export interface GroupCustomer {
  id: string
  id_customer: string
  id_group: string
}

export const useGroupCustomerStore = defineStore('group_customer', () => {
  const groupCustomer = ref<GroupCustomer[]>([])
  const isLoading = ref(true)

  const createGroupCustomer = async (values: Omit<GroupCustomer, 'id'>) => {
    try {
      await fetch('http://localhost:3000/group_customer', {
        method: 'POST',
        body: JSON.stringify(values),
        headers: {
          'Content-Type': 'application/json',
        },
      })
    } catch (err) {
      alert(err)
    }
  }

  const readGroupCustomer = async () => {
    isLoading.value = true
    try {
      const response = await fetch('http://localhost:3000/group_customer')
      const data = await response.json()
      groupCustomer.value = data
    } catch (err) {
      alert(err)
    } finally {
      isLoading.value = false
    }
  }

  const deleteGroupCustomer = async (id: String) => {
    try {
      await fetch(`http://localhost:3000/group_customer/${id}`, {
        method: 'DELETE',
      })
      readGroupCustomer()
    } catch (err) {
      alert(err)
    }
  }

  return {
    groupCustomer,
    isLoading,
    createGroupCustomer,
    readGroupCustomer,
    deleteGroupCustomer,
  }
})
