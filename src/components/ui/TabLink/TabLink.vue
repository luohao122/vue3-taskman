<template>
  <button
    @click="$emit('click')"
    :class="{
      'p-4 border-b-2 cursor-pointer': true,
      'border-b-primary-600 text-primary-600': isActive,
      'border-transparent': !isActive,
    }"
  >
    {{ tab.label }}
  </button>
</template>

<script setup lang="ts">
import type { Tab } from '@/types/types'
import { computed } from 'vue'

const isActive = computed(() => props.currentTab === props.tab.key)

const props = defineProps<{
  currentTab: string
  tab: Tab
}>()

defineEmits<{
  click: []
}>()
</script>
