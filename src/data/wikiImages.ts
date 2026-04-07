import type { OsrsSkill, TierName } from '../types/league'

const BASE = 'https://oldschool.runescape.wiki/images'

// ---------------------------------------------------------------------------
// Tier icons + point values
// Beginner uses the scroll box icon; Easy–Master use the Trailblazer icons.
// ---------------------------------------------------------------------------
export const TIER_CONFIG: Partial<Record<TierName, { icon: string; points: number; color: string }>> = {
  // Beginner only appears in League 3
  Beginner: { icon: `${BASE}/Scroll_box_(beginner).png`,                         points: 10,  color: 'grey'        },
  Easy:     { icon: `${BASE}/Trailblazer_Reloaded_League_tasks_-_Easy.png`,      points: 10,  color: 'success'     },
  Medium:   { icon: `${BASE}/Trailblazer_Reloaded_League_tasks_-_Medium.png`,    points: 30,  color: 'info'        },
  Hard:     { icon: `${BASE}/Trailblazer_Reloaded_League_tasks_-_Hard.png`,      points: 80,  color: 'warning'     },
  Elite:    { icon: `${BASE}/Trailblazer_Reloaded_League_tasks_-_Elite.png`,     points: 200, color: 'error'       },
  Master:   { icon: `${BASE}/Trailblazer_Reloaded_League_tasks_-_Master.png`,    points: 400, color: 'deep-purple' },
}

// ---------------------------------------------------------------------------
// Area badge images (the shield/crest PNGs from the wiki)
// ---------------------------------------------------------------------------
export const AREA_BADGE_URLS: Record<string, string> = {
  'Global':               `${BASE}/Globe-icon.png`,
  'Misthalin':            `${BASE}/Misthalin_Area_Badge.png`,
  'Karamja':              `${BASE}/Karamja_Area_Badge.png`,
  'Asgarnia':             `${BASE}/Asgarnia_Area_Badge.png`,
  'Kharidian Desert':     `${BASE}/Desert_Area_Badge.png`,
  'Fremennik Province':   `${BASE}/Fremennik_Area_Badge.png`,
  'Kandarin':             `${BASE}/Kandarin_Area_Badge.png`,
  'Kourend & Kebos':      `${BASE}/Kourend_Area_Badge.png`,
  'Morytania':            `${BASE}/Morytania_Area_Badge.png`,
  'Tirannwn':             `${BASE}/Tirannwn_Area_Badge.png`,
  'Varlamore':            `${BASE}/Varlamore_Area_Badge.png`,
  'Wilderness':           `${BASE}/Wilderness_Area_Badge.png`,
}

// ---------------------------------------------------------------------------
// Skill icon images
// ---------------------------------------------------------------------------
export const SKILL_ICON_URLS: Record<OsrsSkill, string> = {
  AGILITY:      `${BASE}/Agility_icon.png`,
  ATTACK:       `${BASE}/Attack_icon.png`,
  CONSTRUCTION: `${BASE}/Construction_icon.png`,
  COOKING:      `${BASE}/Cooking_icon.png`,
  CRAFTING:     `${BASE}/Crafting_icon.png`,
  DEFENCE:      `${BASE}/Defence_icon.png`,
  FARMING:      `${BASE}/Farming_icon.png`,
  FIREMAKING:   `${BASE}/Firemaking_icon.png`,
  FISHING:      `${BASE}/Fishing_icon.png`,
  FLETCHING:    `${BASE}/Fletching_icon.png`,
  HERBLORE:     `${BASE}/Herblore_icon.png`,
  HITPOINTS:    `${BASE}/Hitpoints_icon.png`,
  HUNTER:       `${BASE}/Hunter_icon.png`,
  MAGIC:        `${BASE}/Magic_icon.png`,
  MINING:       `${BASE}/Mining_icon.png`,
  PRAYER:       `${BASE}/Prayer_icon.png`,
  RANGED:       `${BASE}/Ranged_icon.png`,
  RUNECRAFT:    `${BASE}/Runecraft_icon.png`,
  SLAYER:       `${BASE}/Slayer_icon.png`,
  SMITHING:     `${BASE}/Smithing_icon.png`,
  STRENGTH:     `${BASE}/Strength_icon.png`,
  THIEVING:     `${BASE}/Thieving_icon.png`,
  WOODCUTTING:  `${BASE}/Woodcutting_icon.png`,
}
