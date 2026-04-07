<template>
  <v-container class="py-8">
    <div class="text-center mb-8">
      <h1 class="text-h3 font-weight-bold mb-2" style="color: rgb(var(--v-theme-primary))">
        OSRS League Tasks
      </h1>
      <p class="text-subtitle-1 text-medium-emphasis">
        Track your progress through the upcoming Old School RuneScape League
      </p>
    </div>

    <v-row justify="center" class="mb-6">
      <v-col cols="12" sm="4">
        <v-card class="text-center pa-4" rounded="lg">
          <v-icon size="40" color="primary" class="mb-2">mdi-format-list-checks</v-icon>
          <div class="text-h6 font-weight-bold">Browse Tasks</div>
          <p class="text-body-2 text-medium-emphasis mt-1">
            Explore all available league tasks
          </p>
          <v-btn class="mt-3" color="primary" variant="tonal" to="/tasks" block>
            View Tasks
          </v-btn>
        </v-card>
      </v-col>

      <v-col cols="12" sm="4">
        <v-card class="text-center pa-4" rounded="lg">
          <v-icon size="40" color="success" class="mb-2">mdi-checkbox-marked-circle</v-icon>
          <div class="text-h6 font-weight-bold">My Todo List</div>
          <p class="text-body-2 text-medium-emphasis mt-1">
            Track your personal task goals
          </p>
          <v-btn class="mt-3" color="success" variant="tonal" to="/todo" block>
            My List
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <v-card class="pa-4" rounded="lg" variant="outlined">
      <div class="d-flex align-center gap-3 mb-3">
        <v-icon color="primary">mdi-account</v-icon>
        <span class="text-h6 font-weight-medium">Load Your Character</span>
      </div>
      <p class="text-body-2 text-medium-emphasis mb-4">
        Enter your RuneScape username to load your stats and check task eligibility.
      </p>
      <v-text-field
        v-model="username"
        label="RSN (RuneScape Name)"
        placeholder="Enter your username"
        prepend-inner-icon="mdi-account-circle"
        variant="outlined"
        density="comfortable"
        hide-details
        class="mb-3"
        @keyup.enter="loadPlayer"
      />
      <v-btn
        color="primary"
        :loading="playerStore.loading"
        @click="loadPlayer"
        prepend-icon="mdi-download"
      >
        Load Character
      </v-btn>
      <v-alert
        v-if="playerStore.player"
        type="success"
        variant="tonal"
        class="mt-3"
        density="compact"
      >
        Loaded: <strong>{{ playerStore.player.username }}</strong>
      </v-alert>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePlayerStore } from '../stores/player'

const playerStore = usePlayerStore()
const username = ref('')

function loadPlayer() {
  if (username.value.trim()) {
    playerStore.loadPlayer(username.value.trim())
  }
}
</script>
