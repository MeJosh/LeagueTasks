<template>
  <v-container class="py-6">
    <h1 class="text-h4 font-weight-bold mb-4">My Todo List</h1>
    <v-alert type="info" variant="tonal" class="mb-4">
      Your personal task list will appear here. Add tasks from the Tasks page.
    </v-alert>
    <v-card class="pa-6 text-center" rounded="lg">
      <v-icon size="64" color="medium-emphasis" class="mb-4">mdi-checkbox-marked-circle-outline</v-icon>
      <div class="text-h6 text-medium-emphasis">No tasks in your list</div>
      <p class="text-body-2 text-disabled mt-2">
        Browse the task list and add tasks you want to complete.
      </p>
      <v-btn class="mt-4" color="primary" variant="tonal" to="/tasks" prepend-icon="mdi-format-list-checks">
        Browse Tasks
      </v-btn>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
</script>
