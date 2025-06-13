<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps({
  tagName: String,
})
</script>

<template>
  <p class="tag text-black">{{ tagName }}</p>
</template>
