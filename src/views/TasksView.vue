<template>
  <v-container class="py-6">

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
        <div class="d-flex flex-wrap gap-3">
          <div>
            <div class="text-caption text-medium-emphasis mb-1">Tier</div>
            <v-chip-group v-model="selectedTiers" multiple>
              <v-chip
                v-for="tier in availableTiers"
                :key="tier.name"
                :value="tier.name"
                :color="tier.color"
                filter
                size="small"
                variant="tonal"
              >
                {{ tier.name }}
              </v-chip>
            </v-chip-group>
          </div>

          <v-select
            v-model="selectedArea"
            :items="availableAreas"
            label="Area"
            variant="outlined"
            density="compact"
            hide-details
            clearable
            style="max-width: 200px"
          />

          <v-select
            v-model="selectedCategory"
            :items="availableCategories"
            label="Category"
            variant="outlined"
            density="compact"
            hide-details
            clearable
            style="max-width: 180px"
          />
        </div>
      </v-card>

      <!-- Task table — horizontally scrollable on small screens -->
      <div style="overflow-x: auto">
        <v-data-table
          :headers="headers"
          :items="filteredTasks"
          :items-per-page="25"
          :items-per-page-options="[25, 50, 100]"
          :cell-props="cellProps"
          density="comfortable"
          hover
          style="min-width: 700px"
        >
          <!-- Area -->
          <template #item.area="{ item }">
            <div v-if="item.area" class="d-flex justify-center">
              <img
                :src="AREA_BADGE_URLS[item.area]"
                :alt="item.area"
                :title="item.area"
                height="28"
                style="object-fit: contain"
              />
            </div>
            <span v-else class="text-disabled">—</span>
          </template>

          <!-- Name + description in one cell -->
          <template #item.name="{ item }">
            <div class="py-1">
              <div class="font-weight-medium">{{ item.name }}</div>
              <div
                v-if="item.description && item.description !== item.name"
                class="text-caption text-medium-emphasis mt-0.5"
              >
                {{ item.description }}
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
                color="teal"
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

          <!-- Tier chip -->
          <template #item.tierName="{ item }">
            <v-chip :color="tierColor(item.tierName)" size="small" variant="tonal">
              {{ item.tierName }}
            </v-chip>
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
import { useTasksStore } from '../stores/tasks'
import type { TierName, OsrsSkill } from '../types/league'
import { AREA_BADGE_URLS, SKILL_ICON_URLS } from '../data/wikiImages'

const tasksStore = useTasksStore()

// ---------------------------------------------------------------------------
// Filters
// ---------------------------------------------------------------------------
const search = ref('')
const selectedTiers = ref<string[]>([])
const selectedArea = ref<string | null>(null)
const selectedCategory = ref<string | null>(null)

const availableTiers = [
  { name: 'Beginner', color: 'grey' },
  { name: 'Easy',     color: 'success' },
  { name: 'Medium',   color: 'info' },
  { name: 'Hard',     color: 'warning' },
  { name: 'Elite',    color: 'error' },
  { name: 'Master',   color: 'deep-purple' },
] as const

const availableAreas = computed(() =>
  [...new Set(tasksStore.tasks.map(t => t.area).filter(Boolean) as string[])].sort(),
)

const availableCategories = computed(() =>
  [...new Set(tasksStore.tasks.map(t => t.category).filter(Boolean) as string[])].sort(),
)

const filteredTasks = computed(() => {
  let result = tasksStore.tasks

  if (selectedTiers.value.length) {
    result = result.filter(t => selectedTiers.value.includes(t.tierName))
  }
  if (selectedArea.value) {
    result = result.filter(t => t.area === selectedArea.value)
  }
  if (selectedCategory.value) {
    result = result.filter(t => t.category === selectedCategory.value)
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
const headers = [
  { title: 'Area',        key: 'area',              sortable: true,  width: '140px' },
  { title: 'Name',        key: 'name',              sortable: true               },
  { title: 'Requirements',key: 'skills',            sortable: false              },
  { title: 'Tier',        key: 'tierName',          sortable: true,  width: '100px' },
  { title: 'Comp%',       key: 'completionPercent', sortable: true,  width: '80px'  },
]

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

// ---------------------------------------------------------------------------
// Tier colors
// ---------------------------------------------------------------------------
function tierColor(name: TierName | string): string {
  const map: Record<string, string> = {
    Beginner:    'grey',
    Easy:        'success',
    Medium:      'info',
    Hard:        'warning',
    Elite:       'error',
    Master:      'deep-purple',
  }
  return map[name] ?? 'default'
}
</script>
