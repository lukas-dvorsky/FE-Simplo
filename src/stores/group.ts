import { ref } from 'vue'
import { defineStore } from 'pinia'

export interface Group {
  id: string
  name: string
}

export const useGroupsStore = defineStore('groups', () => {
  const groups = ref<Group[]>([])
  const isLoading = ref(true)

  const createGroup = async (values: Omit<Group, 'id'>) => {
    try {
      await fetch('http://localhost:3000/groups', {
        method: 'POST',
        body: JSON.stringify(values),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      alert('Group added succesfully')
    } catch (err) {
      alert(err)
    }
  }

  const readGroup = async () => {
    isLoading.value = true
    try {
      const response = await fetch('http://localhost:3000/groups')
      const data = await response.json()
      groups.value = data
    } catch (error) {
      console.error('Error loading groups:', error)
    } finally {
      isLoading.value = false
    }
  }

  const updateGroup = async (id: string, updatedData: Omit<Group, 'id'>) => {
    try {
      await fetch(`http://localhost:3000/groups/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      })
      readGroup()
      alert('Group updated succesfully')
    } catch (err) {
      alert(err)
    }
  }

  const deleteGroup = async (id: String) => {
    try {
      await fetch(`http://localhost:3000/groups/${id}`, {
        method: 'DELETE',
      })
      readGroup()
      alert('Group deleted succesfully')
    } catch (err) {
      alert(err)
    }
  }

  return { groups, isLoading, createGroup, readGroup, updateGroup, deleteGroup }
})
