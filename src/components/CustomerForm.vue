<script setup lang="ts">
import { z } from 'zod'
import { useField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useCustomersStore } from '@/stores/customer'
import { useGroupCustomerStore, type GroupCustomer } from '@/stores/group_customer'
import { defineProps, onMounted, ref } from 'vue'
import type { Customer } from '@/stores/customer'
import { useGroupsStore, type Group } from '@/stores/group'
import GroupSearch from '@/components/GroupSearch.vue'
import Tag from '@/components/Tag.vue'

// Pokud prijmeme data, jedna se o updateForm
const props = defineProps<{
  data?: Customer
}>()

const customerStore = useCustomersStore()
const groupCustomerStore = useGroupCustomerStore()
const groupsStore = useGroupsStore()

const selectedGroups = ref<Group[]>([])
const currentCustomerGroupsState = ref<GroupCustomer[]>([])

const emit = defineEmits<{
  (e: 'hideModal'): void
}>()

const customerSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, { message: 'Invalid name' }),
    surname: z.string().min(1, { message: 'Invalid surname' }),
    email: z.string().email({ message: 'Enter valid email addres' }),
    phone: z.string().regex(/^\d{9,13}$/, 'Enter valid phone number'),
  }),
)

const { handleSubmit, errors, setValues } = useForm({
  validationSchema: customerSchema,
  initialValues: {
    name: '',
    surname: '',
    email: '',
    phone: '',
  },
})

const { value: name } = useField('name')
const { value: surname } = useField('surname')
const { value: email } = useField('email')
const { value: phone } = useField('phone')

onMounted(async () => {
  if (props.data) {
    const groupCustomers = await customerStore.readGroupsForCustomer(props.data.id)

    const matchedGroups: Group[] = []

    groupCustomers.forEach((groupcustomer: GroupCustomer) => {
      const foundGroup = groupsStore.groups.find((group) => group.id === groupcustomer.id_group)
      if (foundGroup) {
        matchedGroups.push(foundGroup)
      }
    })

    currentCustomerGroupsState.value = groupCustomers
    selectedGroups.value = matchedGroups

    setValues({
      name: props.data.name,
      surname: props.data.surname,
      email: props.data.email,
      phone: props.data.phone,
    })
  }
})

const onSubmit = handleSubmit(async (values) => {
  if (!props.data) {
    const newCustomer = await customerStore.createCustomer(values)
    for (const selectedGroup of selectedGroups.value) {
      await groupCustomerStore.createGroupCustomer({
        id_customer: newCustomer.id,
        id_group: selectedGroup.id,
      })
    }
  } else {
    await customerStore.updateCustomer(props.data.id, values)

    const toDelete = currentCustomerGroupsState.value.filter(
      (curr) => !selectedGroups.value.some((selected) => selected.id === curr.id_group),
    )
    const toCreate = selectedGroups.value.filter(
      (selected) => !currentCustomerGroupsState.value.some((curr) => curr.id_group === selected.id),
    )

    for (const groupcustomer of toDelete) {
      await groupCustomerStore.deleteGroupCustomer(groupcustomer.id)
    }

    for (const group of toCreate) {
      await groupCustomerStore.createGroupCustomer({
        id_customer: props.data.id,
        id_group: group.id,
      })
    }
  }

  await customerStore.readCustomer()
  await groupCustomerStore.readGroupCustomer()
  emit('hideModal')
})

const handleGroupSelect = (group: Group) => {
  if (!selectedGroups.value.find((g) => g.id === group.id)) {
    selectedGroups.value.push(group)
  }
}

const handleGroupRemove = (id: string) => {
  selectedGroups.value = selectedGroups.value.filter((group) => group.id !== id)
}
</script>

<template>
  <div class="modal">
    <div class="form">
      <button @click="emit('hideModal')" class="button button--small button-close">X</button>
      <form @submit="onSubmit">
        <div class="form-input">
          <label for="name">Name</label>
          <input v-model="name" name="name" class="text-medium" />
          <span v-if="errors" class="text-error">{{ errors.name }}</span>
        </div>
        <div class="form-input">
          <label for="surname">Surname</label>
          <input v-model="surname" name="surname" class="text-medium" />
          <span v-if="errors" class="text-error">{{ errors.surname }}</span>
        </div>
        <div class="form-input">
          <label for="email">Email</label>
          <input v-model="email" name="email" class="text-medium" />
          <span v-if="errors" class="text-error">{{ errors.email }}</span>
        </div>
        <div class="form-input">
          <label for="phone">Phone</label>
          <input v-model="phone" name="phone" class="text-medium" />
          <span v-if="errors" class="text-error">{{ errors.phone }}</span>
        </div>

        <GroupSearch @selectGroup="handleGroupSelect" />
        <div class="group-search-container">
          <Tag
            v-for="selectedGroup in selectedGroups"
            :key="selectedGroup.id"
            :data="selectedGroup"
            @handle-group-remove="handleGroupRemove"
          />
        </div>

        <button v-if="props.data" type="submit" class="button button--small">Update</button>
        <button v-else type="submit" class="button button--small">Create</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
section {
  position: absolute;
  top: 200px;
  left: 300px;
}
</style>
