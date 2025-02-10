<template>
  <form @submit.prevent="handleSubmit">
    <div class="mb-4">
      <label class="block mb-1 font-semibold text-gray-800 dark:text-gray-200" for="taskTitle">
        Task Title
      </label>
      <input
        id="taskTitle"
        type="text"
        v-model="formData.title"
        placeholder="Enter task title"
        class="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 placeholder:text-gray-500 dark:placeholder:text-gray-400"
        required
      />
    </div>
    <div class="mb-4">
      <label class="block mb-1 font-semibold text-gray-800 dark:text-gray-200" for="taskDescription">
        Description
      </label>
      <textarea
        id="taskDescription"
        v-model="formData.description"
        placeholder="Enter task description"
        class="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 placeholder:text-gray-500 dark:placeholder:text-gray-400"
      ></textarea>
    </div>
    <div class="mb-4">
      <label class="block mb-1 font-semibold text-gray-800 dark:text-gray-200" for="taskPriority">
        Priority
      </label>
      <select
        id="taskPriority"
        v-model="formData.priority"
        class="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
      >
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
    </div>
    <div class="mb-4">
      <label class="block mb-1 font-semibold text-gray-800 dark:text-gray-200">Task Color</label>
      <div class="flex space-x-2">
        <div
          v-for="color in colors"
          :key="color"
          class="w-8 h-8 rounded cursor-pointer border-2"
          :class="{
            'border-black': formData.bgColor === color,
            'border-transparent': formData.bgColor !== color,
          }"
          :style="{ backgroundColor: color }"
          @click="selectColor(color)"
        ></div>
      </div>
    </div>
    <div class="flex justify-end space-x-2">
      <button
        type="button"
        @click="$emit('cancel')"
        class="px-4 py-2 bg-gray-300 dark:bg-gray-600 dark:text-gray-200 text-gray-800 rounded cursor-pointer"
      >
        Cancel
      </button>
      <button type="submit" class="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded cursor-pointer">
        Save
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { TaskFormData } from '@/types/task'
import { reactive, watch } from 'vue'

// Accept initial data if in edit mode
const props = defineProps<{
  initialData?: TaskFormData
}>()

const emit = defineEmits<{
  (e: 'submit', formData: TaskFormData): void
  (e: 'cancel'): void
}>()

// Define default values for the form fields.
const defaultData: TaskFormData = {
  title: '',
  description: '',
  priority: 'Medium',
  bgColor: '#14294D',
}

// Predefined color options.
const colors = ['#14294D', '#F2994A', '#FF6B6B', '#F2C94C']

// Set formData with the initialData if one is provided (edit mode).
const formData = reactive({ ...defaultData, ...props.initialData })

// If the initialData prop changes, update formData accordingly.
watch(
  () => props.initialData,
  (newVal) => {
    if (newVal) {
      Object.assign(formData, newVal)
    } else {
      Object.assign(formData, defaultData)
    }
  },
)

// Set task's color when one is selected.
const selectColor = (color: string) => {
  formData.bgColor = color
}

// Emit submit event when form is submitted.
const handleSubmit = () => {
  emit('submit', { ...formData })
}
</script>
