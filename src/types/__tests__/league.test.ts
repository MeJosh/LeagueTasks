import { describe, it, expect } from 'vitest'
import {
  LeagueTaskSchema,
  LeagueDataSchema,
  SkillRequirementSchema,
} from '../league'

// ---------------------------------------------------------------------------
// Minimal valid task — only required fields
// ---------------------------------------------------------------------------
const minimalTask = {
  structId: null,
  sortId: 0,
  name: 'Defeat a Moss Giant',
  description: 'Defeat a Moss Giant',
  area: 'Global',
  category: 'Combat',
  skill: 'All',
  tier: 1,
  tierName: 'Easy',
  // completionPercent, skills, wikiNotes intentionally absent
}

// Full task with every optional field populated
const fullTask = {
  ...minimalTask,
  structId: 1802,
  sortId: 34,
  name: 'Fletch an Oak Shortbow',
  description: 'Fletch an Oak Shortbow',
  completionPercent: 70.2,
  skills: [
    { skill: 'FLETCHING', level: 20 },
    { skill: 'WOODCUTTING', level: 15 },
  ],
  wikiNotes: '20 Fletching  15 Woodcutting if chopping own log',
}

// ---------------------------------------------------------------------------
// LeagueTaskSchema
// ---------------------------------------------------------------------------
describe('LeagueTaskSchema', () => {
  it('accepts a minimal task with optional fields absent', () => {
    const result = LeagueTaskSchema.safeParse(minimalTask)
    expect(result.success).toBe(true)
  })

  it('accepts a full task with all fields present', () => {
    const result = LeagueTaskSchema.safeParse(fullTask)
    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.data.skills).toHaveLength(2)
    expect(result.data.completionPercent).toBe(70.2)
  })

  it('accepts null for nullable fields', () => {
    const result = LeagueTaskSchema.safeParse({
      ...minimalTask,
      structId: null,
      area: null,
      category: null,
      skill: null,
      completionPercent: null,
      skills: null,
      wikiNotes: null,
    })
    expect(result.success).toBe(true)
  })

  it('accepts League 3 Beginner tier', () => {
    const result = LeagueTaskSchema.safeParse({ ...minimalTask, tier: 1, tierName: 'Beginner' })
    expect(result.success).toBe(true)
  })

  it('accepts all valid tier names', () => {
    const tiers = [
      { tier: 1, tierName: 'Beginner' },
      { tier: 1, tierName: 'Easy' },
      { tier: 2, tierName: 'Medium' },
      { tier: 3, tierName: 'Hard' },
      { tier: 4, tierName: 'Elite' },
      { tier: 5, tierName: 'Master' },
    ]
    for (const t of tiers) {
      const result = LeagueTaskSchema.safeParse({ ...minimalTask, ...t })
      expect(result.success, `tier ${t.tierName} should be valid`).toBe(true)
    }
  })

  it('rejects an unknown tier name', () => {
    const result = LeagueTaskSchema.safeParse({ ...minimalTask, tierName: 'Legendary' })
    expect(result.success).toBe(false)
  })

  it('rejects an unknown category', () => {
    const result = LeagueTaskSchema.safeParse({ ...minimalTask, category: 'Fishing' })
    expect(result.success).toBe(false)
  })

  it('rejects a missing required field (name)', () => {
    const { name: _, ...noName } = minimalTask
    const result = LeagueTaskSchema.safeParse(noName)
    expect(result.success).toBe(false)
  })

  it('rejects an empty name string', () => {
    const result = LeagueTaskSchema.safeParse({ ...minimalTask, name: '' })
    expect(result.success).toBe(false)
  })

  it('rejects completionPercent outside 0–100', () => {
    expect(LeagueTaskSchema.safeParse({ ...minimalTask, completionPercent: -1 }).success).toBe(false)
    expect(LeagueTaskSchema.safeParse({ ...minimalTask, completionPercent: 101 }).success).toBe(false)
  })

  it('rejects an unknown skill in the skills array', () => {
    const result = LeagueTaskSchema.safeParse({
      ...minimalTask,
      skills: [{ skill: 'JUGGLING', level: 50 }],
    })
    expect(result.success).toBe(false)
  })

  it('rejects a skill level out of range', () => {
    expect(
      LeagueTaskSchema.safeParse({ ...minimalTask, skills: [{ skill: 'MINING', level: 0 }] }).success,
    ).toBe(false)
    expect(
      LeagueTaskSchema.safeParse({ ...minimalTask, skills: [{ skill: 'MINING', level: 100 }] }).success,
    ).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// SkillRequirementSchema
// ---------------------------------------------------------------------------
describe('SkillRequirementSchema', () => {
  it('accepts valid skill requirements', () => {
    expect(SkillRequirementSchema.safeParse({ skill: 'AGILITY', level: 1 }).success).toBe(true)
    expect(SkillRequirementSchema.safeParse({ skill: 'WOODCUTTING', level: 99 }).success).toBe(true)
  })

  it('rejects non-integer level', () => {
    expect(SkillRequirementSchema.safeParse({ skill: 'MINING', level: 50.5 }).success).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// LeagueDataSchema — the root array
// ---------------------------------------------------------------------------
describe('LeagueDataSchema', () => {
  it('accepts an array of valid tasks', () => {
    const result = LeagueDataSchema.safeParse([minimalTask, fullTask])
    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.data).toHaveLength(2)
  })

  it('accepts an empty array', () => {
    expect(LeagueDataSchema.safeParse([]).success).toBe(true)
  })

  it('fails when one item in the array is invalid', () => {
    const result = LeagueDataSchema.safeParse([minimalTask, { ...minimalTask, tierName: 'Invalid' }])
    expect(result.success).toBe(false)
  })

  it('rejects non-array input', () => {
    expect(LeagueDataSchema.safeParse(null).success).toBe(false)
    expect(LeagueDataSchema.safeParse({}).success).toBe(false)
  })
})
