import { ref } from 'vue'
import { defineStore } from 'pinia'

import { useNotification } from '@/composables/useNotifications'
import type { NewTask, Task } from '@/types/task'
import { useSettingsStore } from './settings'

export const useTaskStore = defineStore('task', () => {
  const isLoading = ref<boolean>(false)
  const isCreating = ref<boolean>(false)
  const isUpdating = ref<boolean>(false)
  const isDeleting = ref<boolean>(false)
  const error = ref(null)
  const tasks = ref<Task[]>([])
  const { addNotification } = useNotification()
  const settingsStore = useSettingsStore()

  async function fetchTasks() {
    // In offline mode, assume localStorage already holds tasks.
    if (!settingsStore.syncWithServer) {
      return
    }

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

  async function createTask(newTask: NewTask, skipDuplicateCheck = false): Promise<Task | null> {
    error.value = null
    try {
      if (!skipDuplicateCheck) {
        const normalizedTitle = newTask.title.trim().toLowerCase()
        const duplicateTask = tasks.value.find(
          (task) => task.title.trim().toLowerCase() === normalizedTitle,
        )
        if (duplicateTask) {
          addNotification({
            message: 'Task with that title already exists. Skipping creation.',
            type: 'info',
          })
          console.warn('Task already exists; skipping creation.')
          return duplicateTask
        }
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
        synced: settingsStore.syncWithServer,
      }

      // Add to local tasks
      tasks.value.push(newTaskRecord)

      isCreating.value = true

      if (!settingsStore.syncWithServer) {
        addNotification({ message: 'Task created (offline)', type: 'success' })
        return newTaskRecord
      }

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
      result.synced = true
      tasks.value = tasks.value.map((task) => (task.id === newTaskRecord.id ? result : task))
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
      // If offline, update local state only.
      if (!settingsStore.syncWithServer) {
        // Find and update the task locally.
        const index = tasks.value.findIndex((task) => task.id === updatedTask.id)
        if (index !== -1) {
          tasks.value[index] = { ...updatedTask, updatedAt: new Date().toISOString() }
          addNotification({ message: 'Task updated (offline)', type: 'success' })
          return tasks.value[index]
        }
        return null
      }

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
      result.synced = true
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
      if (!settingsStore.syncWithServer) {
        tasks.value = tasks.value.filter((task) => task.id !== taskId)
        addNotification({ message: 'Task deleted (offline)', type: 'success' })
        return true
      }

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

  async function syncTasks(): Promise<void> {
    if (!settingsStore.syncWithServer) {
      addNotification({
        message: 'Sync is disabled. Turn it on to sync tasks with the server.',
        type: 'info',
      })
      return
    }
    try {
      const response = await fetch('http://localhost:3000/tasks')
      if (!response.ok) {
        addNotification({ message: 'Failed to fetch tasks for sync.', type: 'danger' })
        return
      }
      const serverTasks: Task[] = await response.json()
      for (const localTask of tasks.value) {
        if (!localTask.synced) {
          const serverTask = serverTasks.find((t) => t.id === localTask.id)
          if (serverTask) {
            const updated = await updateTask(localTask)
            if (updated) {
              localTask.synced = true
            }
          } else {
            const created = await createTask(
              {
                title: localTask.title,
                description: localTask.description,
                priority: localTask.priority,
                bgColor: localTask.bgColor,
              },
              true,
            ) // Skip duplicate check here.
            if (created) {
              localTask.id = created.id
              localTask.synced = true
            }
          }
        }
      }
      addNotification({ message: 'Sync complete.', type: 'success' })
    } catch (err) {
      console.error(err)
      addNotification({ message: 'An error occurred during sync.', type: 'danger' })
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
    syncTasks,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  }
})
