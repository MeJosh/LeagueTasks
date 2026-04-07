import { z } from 'zod'

// ---------------------------------------------------------------------------
// Skill names used in the skills[] requirement array
// ---------------------------------------------------------------------------
export const OsrsSkillSchema = z.enum([
  'AGILITY',
  'ATTACK',
  'CONSTRUCTION',
  'COOKING',
  'CRAFTING',
  'DEFENCE',
  'FARMING',
  'FIREMAKING',
  'FISHING',
  'FLETCHING',
  'HERBLORE',
  'HITPOINTS',
  'HUNTER',
  'MAGIC',
  'MINING',
  'PRAYER',
  'RANGED',
  'RUNECRAFT',
  'SLAYER',
  'SMITHING',
  'STRENGTH',
  'THIEVING',
  'WOODCUTTING',
])
export type OsrsSkill = z.infer<typeof OsrsSkillSchema>

// ---------------------------------------------------------------------------
// Skill requirement entry inside the skills[] array
// ---------------------------------------------------------------------------
export const SkillRequirementSchema = z.object({
  skill: OsrsSkillSchema,
  level: z.number().int().min(1).max(99),
})
export type SkillRequirement = z.infer<typeof SkillRequirementSchema>

// ---------------------------------------------------------------------------
// Tier names
// League 3 uniquely adds "Beginner" as tier 1 (shifting others up by one)
// ---------------------------------------------------------------------------
export const TierNameSchema = z.enum([
  'Beginner', // League 3 only
  'Easy',
  'Medium',
  'Hard',
  'Elite',
  'Master',
])
export type TierName = z.infer<typeof TierNameSchema>

// ---------------------------------------------------------------------------
// Task category (present in Leagues 3 & 5; null in 1, 2, 4)
// ---------------------------------------------------------------------------
export const TaskCategorySchema = z.enum([
  'Achievement',
  'Combat',
  'Minigame',
  'Other',
  'Quest',
  'Skill',
])
export type TaskCategory = z.infer<typeof TaskCategorySchema>

// ---------------------------------------------------------------------------
// The "skill" field is a broad skill grouping used only in League 5.
// In all other leagues this field is null.
// ---------------------------------------------------------------------------
export const SkillGroupSchema = z.enum([
  'All',
  'Artisan',
  'Combat',
  'Gathering',
  'None',
  'Support',
  'Unlocked',
])
export type SkillGroup = z.infer<typeof SkillGroupSchema>

// ---------------------------------------------------------------------------
// Individual task entry — shared schema across all 5 leagues
// Fields that older leagues leave null are all marked nullable.
// ---------------------------------------------------------------------------
export const LeagueTaskSchema = z.object({
  /** In-game struct ID. Null for some League 1/2 tasks. */
  structId: z.number().nullable(),
  /** Sort order within the full task list */
  sortId: z.number().int().min(0),
  name: z.string().min(1),
  description: z.string(),
  /** Region/area the task belongs to. Null in some older leagues. */
  area: z.string().nullable(),
  /** Task category. Null in Leagues 1, 2, and 4. */
  category: TaskCategorySchema.nullable(),
  /** Broad skill grouping. Only populated in League 5; null elsewhere. */
  skill: SkillGroupSchema.nullable(),
  /** Numeric tier (1–5, or 1–6 for League 3 which has Beginner). */
  tier: z.number().int().min(1).max(6),
  tierName: TierNameSchema,
  /** Completion % across all players. Absent or null for older leagues. */
  completionPercent: z.number().min(0).max(100).nullish(),
  /** Specific skill level requirements. Absent when no requirements exist. */
  skills: z.array(SkillRequirementSchema).nullish(),
  /** Free-form notes pulled from the OSRS wiki. Absent when not scraped. */
  wikiNotes: z.string().nullish(),
})
export type LeagueTask = z.infer<typeof LeagueTaskSchema>

// Full array of tasks for a given league
export const LeagueDataSchema = z.array(LeagueTaskSchema)
export type LeagueData = z.infer<typeof LeagueDataSchema>

// ---------------------------------------------------------------------------
// League registry entry — metadata about each league (no task data)
// ---------------------------------------------------------------------------
export interface LeagueConfig {
  /** Sequential league number (1–5, with 6+ for future leagues) */
  id: number
  /** Display name */
  name: string
  /** URL-friendly slug */
  slug: string
  /** Path to the task JSON, relative to the app's base URL (in /public) */
  dataPath: string
}
