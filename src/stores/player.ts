import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface PlayerData {
  username: string
  skills: Record<string, number>
}

export const usePlayerStore = defineStore('player', () => {
  const player = ref<PlayerData | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function loadPlayer(username: string) {
    loading.value = true
    error.value = null
    try {
      // Placeholder — will integrate with OSRS hiscores API later
      player.value = { username, skills: {} }
    } catch (e) {
      error.value = 'Failed to load player data'
    } finally {
      loading.value = false
    }
  }

  function clearPlayer() {
    player.value = null
  }

  return { player, loading, error, loadPlayer, clearPlayer }
})
