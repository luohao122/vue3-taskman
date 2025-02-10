<template>
  <div class="container mx-auto p-4">
    <!-- Header Text -->
    <div class="mt-8 mb-12 text-center">
      <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-200">
        Plan Your Day, Conquer Your Tasks
      </h1>
      <p class="text-lg text-gray-500 mt-2">Stay organized and productive with Taskman.</p>
    </div>

    <!-- Category List -->
    <div class="flex flex-wrap justify-center gap-4 mb-6">
      <CategoryCard
        :active="selectedCategory === 'All'"
        @filter="filterTasks"
        priority="All"
        :count="countAll"
      />
      <CategoryCard
        :active="selectedCategory === 'Completed'"
        @filter="filterTasks"
        priority="Completed"
        :count="countCompleted"
      />
      <CategoryCard
        :active="selectedCategory === 'High'"
        @filter="filterTasks"
        priority="High"
        :count="countHigh"
      />
      <CategoryCard
        :active="selectedCategory === 'Medium'"
        @filter="filterTasks"
        priority="Medium"
        :count="countMedium"
      />
      <CategoryCard
        :active="selectedCategory === 'Low'"
        @filter="filterTasks"
        priority="Low"
        :count="countLow"
      />
    </div>

    <!-- Search Bar -->
    <SearchBar v-model="searchQuery" />

    <!-- Loading Skeleton -->
    <template v-if="taskStore.isLoading">
      <div class="grid grid-cols-1 gap-6">
        <LoadingTaskCard v-for="i in 3" :key="i" />
      </div>
    </template>

    <!-- Error Card -->
    <template v-if="!taskStore.isLoading && taskStore.error">
      <ErrorCard>Could not load tasks at the moment.</ErrorCard>
    </template>

    <!-- Task List -->
    <TaskList
      v-if="!taskStore.isLoading && filteredTasks"
      :tasks="filteredTasks"
      @toggle="handleToggleTask"
      @select="handleSelectedTask"
    />

    <!-- Add Task Button -->
    <AddTaskButton @click="openCreateModal" />

    <!-- Add Task Dialog -->
    <ModalDialog
      :isOpen="isCreateModalOpen"
      @update:isOpen="isCreateModalOpen = $event"
      title="Add New Task"
    >
      <TaskForm @cancel="closeCreateModal" @submit="handleCreateTask" />
    </ModalDialog>

    <!-- Update Task Dialog -->
    <ModalDialog
      :isOpen="isUpdateModalOpen"
      @update:isOpen="isUpdateModalOpen = $event"
      title="Update Task"
    >
      <TaskForm :initialData="selectedTask" @cancel="closeUpdateModal" @submit="handleUpdateTask" />
    </ModalDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

import { useTaskStore } from '@/stores/task'
import { type Task, type TaskFormData, type TaskPriority } from '@/types/task'
import TaskList from '@/components/ui/TaskList/TaskList.vue'

import SearchBar from '@/components/form/SearchBar.vue'
import LoadingTaskCard from '@/components/ui/LoadingTaskCard/LoadingTaskCard.vue'
import ErrorCard from '@/components/ui/ErrorCard/ErrorCard.vue'

import AddTaskButton from '@/components/ui/AddTaskButton/AddTaskButton.vue'
import ModalDialog from '@/components/ui/ModalDialog/ModalDialog.vue'
import TaskForm from '@/components/form/TaskForm.vue'

import CategoryCard from '@/components/ui/CategoryCard/CategoryCard.vue'

const searchQuery = ref('')
const isCreateModalOpen = ref<boolean>(false)
const isUpdateModalOpen = ref<boolean>(false)
const selectedTask = ref<TaskFormData | undefined>(undefined)
const taskStore = useTaskStore()

onMounted(() => taskStore.initTask())

const countAll = computed(() => taskStore.tasks.length)

const countHigh = computed(
  () => taskStore.tasks.filter((task) => task.priority === 'High' && !task.completed).length,
)

const countMedium = computed(
  () => taskStore.tasks.filter((task) => task.priority === 'Medium' && !task.completed).length,
)

const countLow = computed(
  () => taskStore.tasks.filter((task) => task.priority === 'Low' && !task.completed).length,
)

const countCompleted = computed(() => taskStore.tasks.filter((task) => task.completed).length)

const filteredTasks = computed(() => {
  let result: Task[] = []

  if (selectedCategory.value === 'Completed') {
    // Show only tasks that are completed.
    result = taskStore.tasks.filter((task) => task.completed)
  } else if (selectedCategory.value === 'All') {
    // Show all tasks.
    result = taskStore.tasks
  } else {
    // Otherwise, assume selectedCategory is one of 'High', 'Medium', or 'Low'
    // and show only tasks with that priority that are not completed.
    result = taskStore.tasks.filter(
      (task) => task.priority === selectedCategory.value && !task.completed,
    )
  }

  // Additionally, if a search query exists, filter by task title.
  if (searchQuery.value.trim() !== '') {
    result = result.filter((task) =>
      task.title.toLowerCase().includes(searchQuery.value.toLowerCase()),
    )
  }

  return result
})

const selectedCategory = ref<TaskPriority | 'All' | 'Completed'>('All')

// When a CategoryCard is clicked:
const filterTasks = (priority: TaskPriority | 'All' | 'Completed') => {
  selectedCategory.value = priority
  // Optionally clear the search query, etc.
  searchQuery.value = ''
}

const openCreateModal = () => {
  isCreateModalOpen.value = true
}

const closeCreateModal = () => {
  isCreateModalOpen.value = false
}

const openUpdateModal = () => {
  isUpdateModalOpen.value = true
}

const closeUpdateModal = () => {
  isUpdateModalOpen.value = false
}

const handleSelectedTask = (id: string) => {
  const foundTask = taskStore.tasks.find((task) => task.id === id)
  if (foundTask) {
    selectedTask.value = { ...foundTask }
    openUpdateModal()
  }
}

// Toggle task completion
const handleToggleTask = async (id: string) => {
  const task = taskStore.tasks.find((task) => task.id === id)
  if (task) {
    task.completed = !task.completed
    const result = await taskStore.updateTask(task)

    if (!result) {
      return
    }
  }
}

// Create a new task & only close the modal if the new task
// is created successfully to avoid loss of data
const handleCreateTask = async (formData: TaskFormData) => {
  const result = await taskStore.createTask({
    title: formData.title,
    description: formData.description,
    priority: formData.priority,
    bgColor: formData.bgColor,
  })

  if (!result) {
    return
  }

  closeCreateModal()
}

// Update the task & only close the modal if the task
// is updated successfully to avoid loss of data
const handleUpdateTask = async (formData: TaskFormData) => {
  const result = await taskStore.updateTask({
    id: formData.id!,
    title: formData.title,
    description: formData.description,
    bgColor: formData.bgColor,
    priority: formData.priority,
    completed: formData.completed!,
    createdAt: formData.createdAt!,
    updatedAt: new Date().toISOString(),
  })

  if (!result) {
    return
  }

  closeUpdateModal()
}
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>
