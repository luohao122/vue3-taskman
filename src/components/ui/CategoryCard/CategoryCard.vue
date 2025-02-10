<template>
  <div
    @click="handleClick"
    :class="[
      'cursor-pointer rounded-md shadow-lg p-4 w-40 h-32 flex flex-col items-center justify-center',
      'bg-white dark:bg-gray-700',
      { 'ring-2 ring-blue-500': active },
    ]"
  >
    <!-- Icon container with dynamic background color -->
    <div class="p-2 rounded-full mb-2" :class="iconBgClass">
      <NotebookPen class="w-6 h-6 text-white" />
    </div>
    <!-- Priority label -->
    <p class="font-bold text-sm text-gray-800 dark:text-gray-200">{{ priority }}</p>
    <!-- Count of tasks -->
    <small class="text-xs text-gray-600 dark:text-gray-300">{{ count }}</small>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NotebookPen } from 'lucide-vue-next'
import type { TaskPriority } from '@/types/task'

// Define props: priority, count, and an optional active state.
const props = defineProps<{
  priority: TaskPriority | 'All' | 'Completed'
  count: number
  active?: boolean
}>()

const emit = defineEmits<{
  (e: 'filter', priority: TaskPriority | 'All' | 'Completed'): void
}>()

// Make active reactive.
const active = computed(() => props.active ?? false)

// Compute the background class for the icon based on the priority.
const iconBgClass = computed(() => {
  switch (props.priority) {
    case 'High':
      return 'bg-red-300'
    case 'Medium':
      return 'bg-orange-300'
    case 'Low':
      return 'bg-blue-300'
    case 'Completed':
      return 'bg-green-300'
    case 'All':
    default:
      return 'bg-gray-300'
  }
})

// Emit the filter event when the card is clicked.
const handleClick = () => {
  emit('filter', props.priority)
}
</script>
