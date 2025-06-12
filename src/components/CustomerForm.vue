<script setup lang="ts">
import { z } from 'zod'
import { useField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useCustomersStore } from '@/stores/customer'
import { defineProps, onMounted, ref } from 'vue'
import type { Customer } from '@/stores/customer'
import type { Group } from '@/stores/group'
import GroupSearch from '@/components/GroupSearch.vue'
import Tag from '@/components/Tag.vue'

// Pokud prijmeme data, jedna se o updateForm
const props = defineProps<{
  data?: Customer
}>()

const selectedGroups = ref<Group[]>([])
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

const customerStore = useCustomersStore()

const { value: name } = useField('name')
const { value: surname } = useField('surname')
const { value: email } = useField('email')
const { value: phone } = useField('phone')

onMounted(() => {
  if (props.data) {
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
    await customerStore.createCustomer(values)
  } else {
    await customerStore.updateCustomer(props.data.id, values)
  }
  await customerStore.readCustomer()
  emit('hideModal')
})

const handleGroupSelect = (group: Group) => {
  if (!selectedGroups.value.find((g) => g.id === group.id)) {
    selectedGroups.value.push(group)
  }
}
const handleGroupRemove = (id: String) => {
  selectedGroups.value = selectedGroups.value.filter((group) => group.id != id)
}
</script>

<template>
  <section>
    <button @click="emit('hideModal')">HIDE</button>
    <form @submit="onSubmit">
      <div>
        <input v-model="name" placeholder="Jméno" />
      </div>

      <div>
        <input v-model="surname" placeholder="Příjmení" />
      </div>

      <div>
        <input v-model="email" placeholder="E-mail" />
      </div>

      <div>
        <input v-model="phone" placeholder="Telefon" />
      </div>

      <GroupSearch @selectGroup="handleGroupSelect" />
      <Tag
        v-for="selectedGroup in selectedGroups"
        :key="selectedGroup.id"
        :data="selectedGroup"
        @handle-group-remove="handleGroupRemove"
      />

      <button v-if="props.data" type="submit">Update</button>
      <button v-else type="submit">Create</button>
    </form>
  </section>
</template>

<style scoped>
section {
  position: absolute;
  top: 200px;
  left: 300px;
}
</style>
