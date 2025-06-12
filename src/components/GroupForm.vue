<script setup lang="ts">
import { useField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useGroupsStore } from '@/stores/group'
import { defineProps, onMounted } from 'vue'
import { z } from 'zod'
import type { Group } from '@/stores/group'

// Pokud prijmeme data, jedna se o updateForm
const props = defineProps<{
  data?: Group
}>()

const emit = defineEmits<{
  (e: 'hideModal'): void
}>()

const groupSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, { message: 'Invalid name' }),
  }),
)

const { handleSubmit, errors, setValues } = useForm({
  validationSchema: groupSchema,
  initialValues: {
    name: '',
  },
})

const store = useGroupsStore()

const { value: name } = useField('name')

onMounted(() => {
  if (props.data) {
    setValues({
      name: props.data.name,
    })
  }
})

const onSubmit = handleSubmit(async (values) => {
  if (!props.data) {
    await store.createGroup(values)
  } else {
    await store.updateGroup(props.data.id, values)
  }
  await store.readGroup()
  emit('hideModal')
})
</script>

<template>
  <button @click="emit('hideModal')">HIDE</button>
  <form @submit="onSubmit">
    <div>
      <input v-model="name" placeholder="Jméno" />
    </div>

    <button v-if="props.data" type="submit">Update</button>
    <button v-else type="submit">Create</button>
  </form>
</template>
