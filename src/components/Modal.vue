<script setup lang="ts">
import { defineProps } from 'vue'
import type { Component } from 'vue'
import type { Customer } from '@/stores/customer'

const props = defineProps<{
  form: Component
  data?: Customer
}>()
</script>

<template>
  <section>
    <component :is="form" :data="data" />
  </section>
</template>
