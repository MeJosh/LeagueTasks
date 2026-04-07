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
          <!-- Tier filter -->
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

          <!-- Area filter -->
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

          <!-- Category filter -->
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

      <!-- Task table -->
      <v-data-table
        :headers="headers"
        :items="filteredTasks"
        :items-per-page="25"
        :items-per-page-options="[25, 50, 100]"
        density="comfortable"
        hover
      >
        <!-- Tier chip -->
        <template #item.tierName="{ item }">
          <v-chip
            :color="tierColor(item.tierName)"
            size="small"
            variant="tonal"
          >
            {{ item.tierName }}
          </v-chip>
        </template>

        <!-- Area -->
        <template #item.area="{ item }">
          <span class="text-body-2">{{ item.area ?? '—' }}</span>
        </template>

        <!-- Category -->
        <template #item.category="{ item }">
          <span class="text-body-2">{{ item.category ?? '—' }}</span>
        </template>

        <!-- Completion % -->
        <template #item.completionPercent="{ item }">
          <div v-if="item.completionPercent != null" class="d-flex align-center gap-2" style="min-width: 80px">
            <v-progress-linear
              :model-value="item.completionPercent"
              :color="completionColor(item.completionPercent)"
              rounded
              height="6"
              class="flex-grow-1"
            />
            <span class="text-caption text-medium-emphasis" style="min-width: 36px; text-align: right">
              {{ item.completionPercent.toFixed(1) }}%
            </span>
          </div>
          <span v-else class="text-caption text-disabled">—</span>
        </template>
      </v-data-table>
    </template>

    <!-- Empty (no tasks loaded yet, no error) -->
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
import type { TierName } from '../types/league'

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
  [...new Set(tasksStore.tasks.map(t => t.area).filter(Boolean) as string[])].sort()
)

const availableCategories = computed(() =>
  [...new Set(tasksStore.tasks.map(t => t.category).filter(Boolean) as string[])].sort()
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
  { title: 'Task',       key: 'name',              sortable: true  },
  { title: 'Tier',       key: 'tierName',          sortable: true, width: '110px' },
  { title: 'Area',       key: 'area',              sortable: true, width: '160px' },
  { title: 'Category',   key: 'category',          sortable: true, width: '130px' },
  { title: 'Completion', key: 'completionPercent', sortable: true, width: '160px' },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function tierColor(name: TierName | string): string {
  const map: Record<string, string> = {
    Beginner: 'grey',
    Easy:     'success',
    Medium:   'info',
    Hard:     'warning',
    Elite:    'error',
    Master:   'deep-purple',
  }
  return map[name] ?? 'default'
}

function completionColor(pct: number): string {
  if (pct >= 70) return 'success'
  if (pct >= 40) return 'warning'
  return 'error'
}
</script>
