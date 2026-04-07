import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { type LeagueTask, type LeagueConfig, LeagueDataSchema } from '../types/league'
import { LEAGUES, DEFAULT_LEAGUE } from '../data/leagues'
import { TIER_CONFIG } from '../data/wikiImages'

export { LEAGUES }

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<LeagueTask[]>([])
  const activeLeague = ref<LeagueConfig>(DEFAULT_LEAGUE)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // IDs of tasks the user has added to their personal todo list
  const todoIds = ref<Set<string>>(new Set())
  // IDs of tasks the user has checked off as done
  const completedIds = ref<Set<string>>(new Set())

  // ---------------------------------------------------------------------------
  // Derived
  // ---------------------------------------------------------------------------

  /** Stable string key for a task (structId when available, else sortId) */
  function taskKey(task: LeagueTask): string {
    return task.structId != null ? `s${task.structId}` : `i${task.sortId}`
  }

  const todoTasks = computed(() =>
    tasks.value.filter(t => todoIds.value.has(taskKey(t))),
  )

  const completedTasks = computed(() =>
    tasks.value.filter(t => completedIds.value.has(taskKey(t))),
  )

  const totalPoints = computed(() =>
    completedTasks.value.reduce((sum, t) => sum + (TIER_CONFIG[t.tierName]?.points ?? 0), 0),
  )

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------

  async function loadLeague(league: LeagueConfig = DEFAULT_LEAGUE) {
    loading.value = true
    error.value = null
    tasks.value = []

    try {
      const url = `${import.meta.env.BASE_URL}${league.dataPath}`
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const raw = await res.json()
      const result = LeagueDataSchema.safeParse(raw)

      if (!result.success) {
        // Log detailed issues for debugging but surface a clean message
        console.error('[tasks] Validation errors:', result.error.flatten())
        throw new Error(`Task data failed validation for "${league.name}"`)
      }

      tasks.value = result.data
      activeLeague.value = league
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load tasks'
    } finally {
      loading.value = false
    }
  }

  function toggleTodo(task: LeagueTask) {
    const key = taskKey(task)
    if (todoIds.value.has(key)) {
      todoIds.value.delete(key)
      completedIds.value.delete(key) // remove from done if un-listed
    } else {
      todoIds.value.add(key)
    }
  }

  function toggleComplete(task: LeagueTask) {
    const key = taskKey(task)
    if (completedIds.value.has(key)) {
      completedIds.value.delete(key)
    } else {
      completedIds.value.add(key)
      todoIds.value.add(key) // auto-add to todo when completed
    }
  }

  function isInTodo(task: LeagueTask) {
    return todoIds.value.has(taskKey(task))
  }

  function isCompleted(task: LeagueTask) {
    return completedIds.value.has(taskKey(task))
  }

  return {
    tasks,
    activeLeague,
    loading,
    error,
    todoTasks,
    completedTasks,
    totalPoints,
    loadLeague,
    toggleTodo,
    toggleComplete,
    isInTodo,
    isCompleted,
  }
})
