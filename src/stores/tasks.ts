import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Task {
  id: string
  name: string
  description: string
  points: number
  category: string
  difficulty: string
  completed: boolean
}

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const completedTasks = computed(() => tasks.value.filter(t => t.completed))
  const totalPoints = computed(() => completedTasks.value.reduce((sum, t) => sum + t.points, 0))

  function toggleTask(id: string) {
    const task = tasks.value.find(t => t.id === id)
    if (task) task.completed = !task.completed
  }

  return { tasks, loading, error, completedTasks, totalPoints, toggleTask }
})
