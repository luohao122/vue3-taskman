import { useNotification } from '@/composables/useNotifications'
import type { NewTask, Task } from '@/types/task'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTaskStore = defineStore('task', () => {
  const isLoading = ref<boolean>(false)
  const isCreating = ref<boolean>(false)
  const isUpdating = ref<boolean>(false)
  const isDeleting = ref<boolean>(false)
  const error = ref(null)
  const tasks = ref<Task[]>([])
  const { addNotification } = useNotification()

  async function fetchTasks() {
    isLoading.value = true
    error.value = null
    try {
      const response = await fetch('http://localhost:3000/tasks')
      if (!response.ok) {
        addNotification({ message: 'Failed to fetch tasks!', type: 'danger' })
        console.error('Failed to fetch tasks!')
        return
      }
      const tasksList = await response.json()
      tasks.value = tasksList
    } catch (err) {
      console.error(err)
      error.value = err as unknown as null
      addNotification({ message: 'An error occured while fetching tasks.', type: 'danger' })
    } finally {
      isLoading.value = false
    }
  }

  async function createTask(newTask: NewTask): Promise<Task | null> {
    error.value = null
    try {
      const existingTask = tasks.value.some((task) => task.title === newTask.title)
      if (existingTask) {
        addNotification({ message: 'Task with that title already exists.', type: 'danger' })
        console.error('Task already exists')
        return null
      }

      const newTaskRecord: Task = {
        id: new Date().toISOString(),
        description: newTask.description,
        priority: newTask.priority,
        title: newTask.title,
        bgColor: newTask.bgColor,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      tasks.value = [...tasks.value, newTaskRecord]

      isCreating.value = true

      const response = await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTaskRecord),
      })

      if (!response.ok) {
        addNotification({ message: 'Failed to create task.', type: 'danger' })
        console.error('Failed to create task.')
        return null
      }
      const result = await response.json()
      addNotification({ message: 'Task created', type: 'success' })
      return result
    } catch (err) {
      console.error(err)
      addNotification({ message: 'An error occurred while creating the task.', type: 'danger' })
      error.value = err as unknown as null
      return null
    } finally {
      isCreating.value = false
    }
  }

  async function updateTask(updatedTask: Task): Promise<Task | null> {
    isUpdating.value = true
    error.value = null
    try {
      const response = await fetch(`http://localhost:3000/tasks/${updatedTask.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
      })
      if (!response.ok) {
        addNotification({ message: 'Failed to update task.', type: 'danger' })
        console.error('Failed to update task.')
        return null
      }
      const foundTaskIdx = tasks.value.findIndex((task) => task.id === updatedTask.id)
      if (foundTaskIdx === -1) {
        addNotification({ message: 'Failed to find task.', type: 'danger' })
        return null
      }
      const result = await response.json()
      tasks.value[foundTaskIdx] = result
      addNotification({ message: 'Task updated', type: 'success' })
      return result
    } catch (err) {
      console.log(err)
      addNotification({ message: 'An error occurred while updating the task.', type: 'danger' })
      error.value = err as unknown as null
      return null
    } finally {
      isUpdating.value = false
    }
  }

  async function deleteTask(taskId: string): Promise<boolean> {
    isDeleting.value = true
    error.value = null
    try {
      const response = await fetch(`http://localhost:3000/tasks/${taskId}`, { method: 'DELETE' })
      if (!response.ok) {
        addNotification({ message: 'Failed to delete task.', type: 'danger' })
        console.error('Failed to delete task.')
        return false
      }
      tasks.value = tasks.value.filter((task) => task.id !== taskId)
      addNotification({ message: 'Task deleted', type: 'success' })
      return true
    } catch (err) {
      console.error(err)
      addNotification({ message: 'An error occurred while deleting the task.', type: 'danger' })
      error.value = err as unknown as null
      return false
    } finally {
      isDeleting.value = false
    }
  }

  async function initTask() {
    await fetchTasks()
  }

  return {
    tasks,
    error,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    initTask,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  }
})
