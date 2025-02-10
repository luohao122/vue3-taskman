import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', () => {
  const darkMode = ref<boolean>(false)
  const syncWithServer = ref<boolean>(true)

  return {
    darkMode,
    syncWithServer,
  }
})
