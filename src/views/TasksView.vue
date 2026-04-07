<template>
  <v-container fluid class="py-6 px-4 px-md-8">

    <!-- Header -->
    <div class="d-flex align-center justify-space-between flex-wrap gap-2 mb-4">
      <div>
        <h1 class="text-h4 font-weight-bold">All Tasks</h1>
        <span class="text-body-2 text-medium-emphasis">
          {{ tasksStore.activeLeague.name }}
          <template v-if="!tasksStore.loading">
            · {{ filteredTasks.length.toLocaleString() }}
            <template v-if="filteredTasks.length !== tasksStore.tasks.length">
              of {{ tasksStore.tasks.length.toLocaleString() }}
            </template>
            tasks
          </template>
        </span>
      </div>
    </div>

    <!-- Error -->
    <v-alert v-if="tasksStore.error" type="error" variant="tonal" class="mb-4" closable>
      {{ tasksStore.error }}
    </v-alert>

    <!-- Loading skeleton -->
    <template v-if="tasksStore.loading">
      <v-card variant="outlined" class="mb-4 pa-3">
        <v-skeleton-loader type="text" width="300" class="mb-3" />
        <v-skeleton-loader type="chip@5" />
      </v-card>
      <v-card variant="outlined">
        <v-skeleton-loader type="table-row@10" />
      </v-card>
    </template>

    <template v-else-if="tasksStore.tasks.length">
      <!-- Filters -->
      <v-card variant="outlined" class="mb-4 pa-3">
        <v-text-field
          v-model="search"
          placeholder="Search tasks..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          hide-details
          clearable
          class="mb-3"
        />
        <div class="d-flex flex-column gap-1">
          <!-- Tier -->
          <div>
            <div
              class="d-flex align-center gap-1 py-1 cursor-pointer"
              style="user-select: none; justify-content: center; width: 100%"
              @click="tierExpanded = !tierExpanded"
            >
              <span class="text-caption text-medium-emphasis font-weight-medium">Tier</span>
              <v-icon size="x-small" class="text-medium-emphasis">
                {{ tierExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
              </v-icon>
              <span v-if="selectedTiers.length && !tierExpanded" class="text-caption text-medium-emphasis">
                ({{ selectedTiers.length }} selected)
              </span>
            </div>
            <v-chip-group v-show="tierExpanded" v-model="selectedTiers" multiple column class="px-8">
              <v-chip
                v-for="tier in availableTiers"
                :key="tier"
                :value="tier"
                :color="TIER_CONFIG[tier]?.color"
                filter
                size="small"
                variant="tonal"
              >
                <img
                  v-if="TIER_CONFIG[tier]"
                  :src="TIER_CONFIG[tier]!.icon"
                  :alt="tier"
                  width="12"
                  height="14"
                  class="mr-1"
                  style="object-fit: contain"
                />
                {{ tier }}
              </v-chip>
            </v-chip-group>
          </div>

          <!-- Area -->
          <div>
            <div
              class="d-flex align-center gap-1 py-1 cursor-pointer"
              style="user-select: none; justify-content: center; width: 100%"
              @click="areaExpanded = !areaExpanded"
            >
              <span class="text-caption text-medium-emphasis font-weight-medium">Area</span>
              <v-icon size="x-small" class="text-medium-emphasis">
                {{ areaExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
              </v-icon>
              <span v-if="selectedAreas.length && !areaExpanded" class="text-caption text-medium-emphasis">
                ({{ selectedAreas.length }} selected)
              </span>
            </div>
            <v-chip-group v-show="areaExpanded" v-model="selectedAreas" multiple column class="px-8">
              <v-chip
                v-for="area in availableAreas"
                :key="area"
                :value="area"
                filter
                size="small"
                variant="tonal"
              >
                <img
                  v-if="AREA_BADGE_URLS[area]"
                  :src="AREA_BADGE_URLS[area]"
                  :alt="area"
                  :width="area === 'Global' ? 12 : 14"
                  height="14"
                  class="mr-1"
                  style="object-fit: contain"
                />
                {{ area }}
              </v-chip>
            </v-chip-group>
          </div>

          <!-- Category -->
          <div>
            <div
              class="d-flex align-center gap-1 py-1 cursor-pointer"
              style="user-select: none; justify-content: center; width: 100%"
              @click="categoryExpanded = !categoryExpanded"
            >
              <span class="text-caption text-medium-emphasis font-weight-medium">Category</span>
              <v-icon size="x-small" class="text-medium-emphasis">
                {{ categoryExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
              </v-icon>
              <span v-if="selectedCategories.length && !categoryExpanded" class="text-caption text-medium-emphasis">
                ({{ selectedCategories.length }} selected)
              </span>
            </div>
            <v-chip-group v-show="categoryExpanded" v-model="selectedCategories" multiple column class="px-8">
              <v-chip
                v-for="cat in availableCategories"
                :key="cat"
                :value="cat"
                filter
                size="small"
                variant="tonal"
              >
                {{ cat }}
              </v-chip>
            </v-chip-group>
          </div>
        </div>
      </v-card>

      <!-- Task table — horizontally scrollable on small screens -->
      <div :style="mobile ? {} : { overflowX: 'auto' }">
        <v-data-table
          :headers="headers"
          :items="filteredTasks"
          :items-per-page="25"
          :items-per-page-options="[25, 50, 100]"
          :cell-props="cellProps"
          :custom-key-sort="customKeySort"
          density="comfortable"
          hover
          :style="mobile ? {} : { minWidth: '700px' }"
        >
          <!-- Area -->
          <template #item.area="{ item }">
            <div v-if="item.area" class="d-flex justify-center">
              <img
                :src="AREA_BADGE_URLS[item.area]"
                :alt="item.area"
                :title="item.area"
                :height="item.area === 'Global' ? 22 : 28"
                style="object-fit: contain"
              />
            </div>
            <span v-else class="text-disabled">—</span>
          </template>

          <!-- Name + description in one cell; skills shown inline on mobile -->
          <template #item.name="{ item }">
            <div class="py-1">
              <div class="font-weight-medium">{{ item.name }}</div>
              <div
                v-if="item.description && item.description !== item.name"
                class="text-caption text-medium-emphasis mt-0.5"
              >
                {{ item.description }}
              </div>
              <div v-if="mobile && item.skills?.length" class="d-flex flex-wrap gap-1 mt-1">
                <v-chip
                  v-for="req in item.skills"
                  :key="req.skill"
                  size="x-small"
                  variant="tonal"
                  :style="{ color: isDark ? '#80cbc4' : '#00695c' }"
                >
                  <img
                    :src="SKILL_ICON_URLS[req.skill as OsrsSkill]"
                    :alt="req.skill"
                    width="13"
                    height="13"
                    class="mr-1"
                    style="object-fit: contain"
                  />
                  {{ req.level }} {{ req.skill.charAt(0) + req.skill.slice(1).toLowerCase() }}
                </v-chip>
              </div>
            </div>
          </template>

          <!-- Skill requirements -->
          <template #item.skills="{ item }">
            <div v-if="item.skills?.length" class="d-flex flex-wrap gap-1 py-1">
              <v-chip
                v-for="req in item.skills"
                :key="req.skill"
                size="x-small"
                variant="tonal"
                :style="{ color: isDark ? '#80cbc4' : '#00695c' }"
              >
                <img
                  :src="SKILL_ICON_URLS[req.skill as OsrsSkill]"
                  :alt="req.skill"
                  width="13"
                  height="13"
                  class="mr-1"
                  style="object-fit: contain"
                />
                {{ req.level }} {{ req.skill.charAt(0) + req.skill.slice(1).toLowerCase() }}
              </v-chip>
            </div>
            <span v-else class="text-caption text-disabled">—</span>
          </template>

          <!-- Tier: wiki icon + point value -->
          <template #item.tier="{ item }">
            <div v-if="TIER_CONFIG[item.tierName as TierName]" class="d-flex align-center gap-1">
              <img
                :src="TIER_CONFIG[item.tierName as TierName]!.icon"
                :alt="item.tierName"
                :title="item.tierName"
                width="16"
                height="18"
                style="object-fit: contain"
              />
              <span class="text-body-2 font-weight-medium">
                {{ TIER_CONFIG[item.tierName as TierName]!.points }}
              </span>
            </div>
            <span v-else class="text-caption text-disabled">{{ item.tierName }}</span>
          </template>

          <!-- Comp% — styling applied via cellProps; just render the text here -->
          <template #item.completionPercent="{ item }">
            <span v-if="item.completionPercent != null" class="font-weight-bold">
              {{ item.completionPercent.toFixed(1) }}%
            </span>
            <span v-else class="text-disabled">—</span>
          </template>
        </v-data-table>
      </div>
    </template>

    <!-- Empty -->
    <template v-else>
      <v-card class="pa-8 text-center" variant="outlined">
        <v-icon size="64" color="medium-emphasis" class="mb-4">mdi-format-list-checks</v-icon>
        <div class="text-h6 text-medium-emphasis">No tasks loaded</div>
      </v-card>
    </template>

  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTheme, useDisplay } from 'vuetify'
import { useTasksStore } from '../stores/tasks'
import type { TierName, OsrsSkill } from '../types/league'
import { AREA_BADGE_URLS, SKILL_ICON_URLS, TIER_CONFIG } from '../data/wikiImages'

const theme = useTheme()
const isDark = computed(() => theme.global.current.value.dark)
const { smAndDown: mobile } = useDisplay()

const tasksStore = useTasksStore()

// ---------------------------------------------------------------------------
// Filters
// ---------------------------------------------------------------------------
const search = ref('')
const selectedTiers = ref<string[]>([])
const selectedAreas = ref<string[]>([])
const selectedCategories = ref<string[]>([])

const tierExpanded = ref(true)
const areaExpanded = ref(false)
const categoryExpanded = ref(false)

// Ordered by difficulty — filter chips maintain this order
const availableTiers = [
  'Easy', 'Medium', 'Hard', 'Elite', 'Master',
] as const satisfies readonly TierName[]

const availableAreas = computed(() => {
  const areas = [...new Set(tasksStore.tasks.map(t => t.area).filter(Boolean) as string[])].sort()
  const i = areas.indexOf('Global')
  if (i > -1) { areas.splice(i, 1); areas.unshift('Global') }
  return areas
})

const availableCategories = computed(() =>
  [...new Set(tasksStore.tasks.map(t => t.category).filter(Boolean) as string[])].sort(),
)

const filteredTasks = computed(() => {
  let result = tasksStore.tasks

  if (selectedTiers.value.length) {
    result = result.filter(t => selectedTiers.value.includes(t.tierName))
  }
  if (selectedAreas.value.length) {
    result = result.filter(t => t.area != null && selectedAreas.value.includes(t.area))
  }
  if (selectedCategories.value.length) {
    result = result.filter(t => t.category != null && selectedCategories.value.includes(t.category))
  }
  if (search.value.trim()) {
    const q = search.value.trim().toLowerCase()
    result = result.filter(
      t =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        (t.wikiNotes ?? '').toLowerCase().includes(q),
    )
  }

  return result
})

// ---------------------------------------------------------------------------
// Table config
// ---------------------------------------------------------------------------
const headers = computed(() => [
  { title: 'Area',         key: 'area',              sortable: true,  width: '40px' },
  { title: 'Name',         key: 'name',              sortable: true               },
  ...(!mobile.value ? [{ title: 'Requirements', key: 'skills', sortable: false }] : []),
  { title: 'Pts',          key: 'tier',              sortable: true,  width: '70px' },
  ...(!mobile.value ? [{ title: 'Comp%', key: 'completionPercent', sortable: true, width: '80px' }] : []),
])

// Global sorts before all other areas
const customKeySort = {
  area: (a: string | null, b: string | null) => {
    if (a === 'Global') return -1
    if (b === 'Global') return 1
    return (a ?? '').localeCompare(b ?? '')
  },
}

// Color the entire Comp% cell via cellProps
function cellProps({ column, item }: { column: { key: string }; item: Record<string, unknown> }) {
  if (column.key !== 'completionPercent') return {}
  const pct = item.completionPercent as number | null | undefined
  if (pct == null) return {}
  const bg =
    pct >= 60 ? 'rgba(76, 175, 125, 0.25)' :
    pct >= 30 ? 'rgba(230, 168, 23, 0.25)' :
                'rgba(207, 102, 121, 0.25)'
  return { style: { backgroundColor: bg, textAlign: 'center' as const } }
}

</script>

<style scoped>
:deep(.v-chip-group .v-slide-group__content) {
  justify-content: center;
}
</style>
