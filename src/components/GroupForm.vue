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
  <div class="modal">
    <div class="form">
      <button @click="emit('hideModal')" class="button button--small button-close">X</button>
      <form @submit="onSubmit">
        <div class="form-input">
          <label for="name">Name</label>
          <input v-model="name" name="name" class="text-large" />
          <span v-if="errors" class="text-error">{{ errors.name }}</span>
        </div>

        <button v-if="props.data" type="submit" class="button button--small">Update</button>
        <button v-else type="submit" class="button button--small">Create</button>
      </form>
    </div>
  </div>
</template>
