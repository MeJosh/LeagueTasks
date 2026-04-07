<template>
  <v-app>
    <!-- Top navigation bar -->
    <v-app-bar elevation="2" color="surface">
      <v-app-bar-title>
        <span class="font-weight-bold" style="color: rgb(var(--v-theme-primary))">
          OSRS League Tasks
        </span>
      </v-app-bar-title>

      <!-- Desktop nav links -->
      <template #append>
        <div class="d-none d-sm-flex align-center gap-1 mr-2">
          <v-btn :to="{ name: 'home' }" variant="text" size="small">Home</v-btn>
          <v-btn :to="{ name: 'tasks' }" variant="text" size="small">Tasks</v-btn>
          <v-btn :to="{ name: 'todo' }" variant="text" size="small">My List</v-btn>
        </div>

        <v-btn
          :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          variant="text"
          @click="toggleTheme"
        />

        <!-- Mobile menu button -->
        <v-btn
          class="d-sm-none"
          icon="mdi-menu"
          variant="text"
          @click="drawer = !drawer"
        />
      </template>
    </v-app-bar>

    <!-- Mobile navigation drawer -->
    <v-navigation-drawer v-model="drawer" temporary>
      <v-list nav>
        <v-list-item
          prepend-icon="mdi-home"
          title="Home"
          :to="{ name: 'home' }"
          @click="drawer = false"
        />
        <v-list-item
          prepend-icon="mdi-format-list-checks"
          title="Tasks"
          :to="{ name: 'tasks' }"
          @click="drawer = false"
        />
        <v-list-item
          prepend-icon="mdi-checkbox-marked-circle"
          title="My List"
          :to="{ name: 'todo' }"
          @click="drawer = false"
        />
      </v-list>

      <template #append>
        <v-divider />
        <v-list-item
          :prepend-icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          :title="isDark ? 'Light Mode' : 'Dark Mode'"
          @click="toggleTheme"
        />
      </template>
    </v-navigation-drawer>

    <!-- Main content -->
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTheme } from 'vuetify'

const theme = useTheme()
const drawer = ref(false)

const isDark = computed(() => theme.global.current.value.dark)

function toggleTheme() {
  theme.global.name.value = isDark.value ? 'light' : 'dark'
}
</script>
