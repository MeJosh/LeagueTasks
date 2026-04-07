import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTasksStore } from '../tasks'
import { DEFAULT_LEAGUE, LEAGUES } from '../../data/leagues'
import type { LeagueTask } from '../../types/league'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function makeTask(overrides: Partial<LeagueTask> = {}): LeagueTask {
  return {
    structId: 100,
    sortId: 0,
    name: 'Test Task',
    description: 'A test task',
    area: 'Global',
    category: 'Combat',
    skill: 'All',
    tier: 1,
    tierName: 'Easy',
    completionPercent: 50,
    skills: null,
    wikiNotes: null,
    ...overrides,
  }
}

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------
beforeEach(() => {
  setActivePinia(createPinia())
})

// ---------------------------------------------------------------------------
// League registry
// ---------------------------------------------------------------------------
describe('LEAGUES registry', () => {
  it('has 5 entries in chronological order', () => {
    expect(LEAGUES).toHaveLength(5)
    expect(LEAGUES.map(l => l.id)).toEqual([1, 2, 3, 4, 5])
  })

  it('DEFAULT_LEAGUE is the last entry', () => {
    expect(DEFAULT_LEAGUE).toBe(LEAGUES[LEAGUES.length - 1])
    expect(DEFAULT_LEAGUE.id).toBe(5)
  })

  it('each league has a non-empty name, slug, and dataPath', () => {
    for (const league of LEAGUES) {
      expect(league.name.length).toBeGreaterThan(0)
      expect(league.slug.length).toBeGreaterThan(0)
      expect(league.dataPath.length).toBeGreaterThan(0)
    }
  })
})

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------
describe('useTasksStore — initial state', () => {
  it('starts with no tasks and the default league active', () => {
    const store = useTasksStore()
    expect(store.tasks).toHaveLength(0)
    expect(store.activeLeague).toEqual(DEFAULT_LEAGUE)
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('starts with empty todo and completed sets', () => {
    const store = useTasksStore()
    expect(store.todoTasks).toHaveLength(0)
    expect(store.completedTasks).toHaveLength(0)
    expect(store.totalPoints).toBe(0)
  })
})

// ---------------------------------------------------------------------------
// Todo toggle
// ---------------------------------------------------------------------------
describe('toggleTodo', () => {
  it('adds a task to the todo list', () => {
    const store = useTasksStore()
    const task = makeTask()
    store.tasks = [task]

    store.toggleTodo(task)
    expect(store.isInTodo(task)).toBe(true)
    expect(store.todoTasks).toHaveLength(1)
  })

  it('removes a task that is already in the todo list', () => {
    const store = useTasksStore()
    const task = makeTask()
    store.tasks = [task]

    store.toggleTodo(task)
    store.toggleTodo(task)
    expect(store.isInTodo(task)).toBe(false)
    expect(store.todoTasks).toHaveLength(0)
  })

  it('removing from todo also removes from completed', () => {
    const store = useTasksStore()
    const task = makeTask()
    store.tasks = [task]

    store.toggleComplete(task) // marks complete (also adds to todo)
    expect(store.isCompleted(task)).toBe(true)

    store.toggleTodo(task) // un-list it
    expect(store.isInTodo(task)).toBe(false)
    expect(store.isCompleted(task)).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// Complete toggle
// ---------------------------------------------------------------------------
describe('toggleComplete', () => {
  it('marks a task complete and auto-adds it to todo', () => {
    const store = useTasksStore()
    const task = makeTask()
    store.tasks = [task]

    store.toggleComplete(task)
    expect(store.isCompleted(task)).toBe(true)
    expect(store.isInTodo(task)).toBe(true)
  })

  it('unmarks a completed task without removing it from todo', () => {
    const store = useTasksStore()
    const task = makeTask()
    store.tasks = [task]

    store.toggleComplete(task)
    store.toggleComplete(task)
    expect(store.isCompleted(task)).toBe(false)
    expect(store.isInTodo(task)).toBe(true) // stays on list
  })
})

// ---------------------------------------------------------------------------
// Derived: totalPoints
// ---------------------------------------------------------------------------
describe('totalPoints', () => {
  it('sums tier * 10 for completed tasks', () => {
    const store = useTasksStore()
    const easy = makeTask({ structId: 1, tier: 1 })   // 10pts
    const hard = makeTask({ structId: 2, tier: 3 })   // 30pts
    const master = makeTask({ structId: 3, tier: 5 }) // 50pts
    store.tasks = [easy, hard, master]

    store.toggleComplete(easy)
    store.toggleComplete(hard)
    expect(store.totalPoints).toBe(40)

    store.toggleComplete(master)
    expect(store.totalPoints).toBe(90)
  })

  it('is 0 when nothing is completed', () => {
    const store = useTasksStore()
    store.tasks = [makeTask()]
    expect(store.totalPoints).toBe(0)
  })
})

// ---------------------------------------------------------------------------
// Task key stability (structId fallback to sortId)
// ---------------------------------------------------------------------------
describe('task identity', () => {
  it('uses structId when available', () => {
    const store = useTasksStore()
    const task = makeTask({ structId: 42, sortId: 0 })
    store.tasks = [task]
    store.toggleTodo(task)
    expect(store.isInTodo(makeTask({ structId: 42, sortId: 99 }))).toBe(true)
  })

  it('falls back to sortId when structId is null', () => {
    const store = useTasksStore()
    const task = makeTask({ structId: null, sortId: 7 })
    store.tasks = [task]
    store.toggleTodo(task)
    expect(store.isInTodo(makeTask({ structId: null, sortId: 7 }))).toBe(true)
    expect(store.isInTodo(makeTask({ structId: null, sortId: 8 }))).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// loadLeague — fetch integration
// ---------------------------------------------------------------------------
describe('loadLeague', () => {
  it('sets loading true during fetch then false after', async () => {
    const store = useTasksStore()

    // Mock fetch to return valid minimal data
    const mockData = [makeTask()]
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockData,
    }))

    const promise = store.loadLeague()
    expect(store.loading).toBe(true)
    await promise
    expect(store.loading).toBe(false)

    vi.unstubAllGlobals()
  })

  it('sets error and clears tasks on HTTP failure', async () => {
    const store = useTasksStore()
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 404 }))

    await store.loadLeague()
    expect(store.error).toMatch(/404/)
    expect(store.tasks).toHaveLength(0)
    expect(store.loading).toBe(false)

    vi.unstubAllGlobals()
  })

  it('sets error when response fails Zod validation', async () => {
    const store = useTasksStore()
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ structId: 1 }], // missing required fields
    }))

    await store.loadLeague()
    expect(store.error).toBeTruthy()
    expect(store.tasks).toHaveLength(0)

    vi.unstubAllGlobals()
  })

  it('populates tasks on successful load', async () => {
    const store = useTasksStore()
    const mockData = [makeTask({ structId: 1 }), makeTask({ structId: 2 })]
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockData,
    }))

    await store.loadLeague()
    expect(store.error).toBeNull()
    expect(store.tasks).toHaveLength(2)

    vi.unstubAllGlobals()
  })
})
