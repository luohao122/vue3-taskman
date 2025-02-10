<template>
  <TransitionGroup name="fade" tag="section" class="grid grid-cols-1 gap-6 mb-6">
    <TaskItem
      @toggle="$emit('toggle', $event)"
      @select="$emit('select', $event)"
      v-for="task in tasks"
      :key="task.id"
      :task="task"
    />
  </TransitionGroup>
</template>

<script lang="ts" setup>
import TaskItem from '@/components/ui/TaskItem/TaskItem.vue'
import type { Task } from '@/types/task'

defineProps<{
  tasks: Task[]
}>()

defineEmits<{
  (e: 'toggle', id: string): void
  (e: 'select', id: string): void
}>()
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
