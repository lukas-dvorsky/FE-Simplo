<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps({
  tagName: String,
})
</script>

<template>
  <p>{{ tagName }}</p>
</template>
