<script setup lang="ts">
import { useField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useCustomersStore } from '@/stores/customer'
import { defineProps, onMounted } from 'vue'
import type { Customer } from '@/stores/customer'
import { z } from 'zod'

// Pokud prijmeme data, jedna se o updateForm
const props = defineProps<{
  data?: Customer
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

const store = useCustomersStore()

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
    await store.createCustomer(values)
  } else {
    await store.updateCustomer(props.data.id, values)
  }
  await store.readCustomer()
})
</script>

<template>
  <form @submit.prevent="onSubmit">
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

    <button v-if="props.data" type="submit">Update</button>
    <button v-else type="submit">Create</button>
  </form>
</template>
