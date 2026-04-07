<template>
  <v-container class="py-6">
    <h1 class="text-h4 font-weight-bold mb-4">All Tasks</h1>
    <v-alert type="info" variant="tonal" class="mb-4">
      Task data will be loaded here once the league is announced.
    </v-alert>
    <v-card class="pa-6 text-center" rounded="lg">
      <v-icon size="64" color="medium-emphasis" class="mb-4">mdi-format-list-checks</v-icon>
      <div class="text-h6 text-medium-emphasis">No tasks loaded yet</div>
      <p class="text-body-2 text-disabled mt-2">
        Tasks will appear here once the league task list is available.
      </p>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
</script>
