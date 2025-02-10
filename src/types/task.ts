export type TaskPriority = 'High' | 'Medium' | 'Low'

export interface Task {
  bgColor: string
  id: string
  completed: boolean
  title: string
  description: string
  priority: TaskPriority
  createdAt: string
  updatedAt: string
  synced?: boolean
}

export type NewTask = Omit<Task, 'id' | 'completed' | 'createdAt' | 'updatedAt'>

export interface TaskFormData {
  id?: string
  title: string
  completed?: boolean
  description: string
  priority: TaskPriority
  bgColor: string
  createdAt?: string
  updatedAt?: string
}
