<template>
  <RoundedCard @click="selectTask(task.id)">
    <!-- Circle Checkbox with border color based on priority -->
    <div
      class="w-8 h-8 rounded-full border-2 flex-shrink-0 flex items-center justify-center mr-4 cursor-pointer"
      :style="{ borderColor: task.bgColor }"
      @click.stop="toggleTask(task.id)"
    >
      <template v-if="task.completed">
        <LucideCheckSquare class="w-5 h-5 text-green-500" />
      </template>
    </div>
    <!-- Task details -->
    <div class="flex flex-col">
      <span class="font-semibold text-lg">{{ task.title }}</span>
      <span class="text-sm text-gray-500">{{ formatDate(task.createdAt) }}</span>
    </div>
  </RoundedCard>
</template>

<script setup lang="ts">
import { LucideCheckSquare } from 'lucide-vue-next'
import dayjs from 'dayjs'

import RoundedCard from '@/components/ui/RoundedCard/RoundedCard.vue'
import type { Task } from '@/types/task'

defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  (e: 'select', id: string): void
  (e: 'toggle', id: string): void
}>()

const toggleTask = (id: string) => {
  emit('toggle', id)
}

const selectTask = (id: string) => {
  emit('select', id)
}

const formatDate = (dateStr: string): string => {
  return dayjs(dateStr).format('MMM D, YYYY')
}
</script>
