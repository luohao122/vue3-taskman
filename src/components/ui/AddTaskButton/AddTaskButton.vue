<template>
  <button
    @click="$emit('click')"
    class="fixed bottom-6 right-6 flex items-center justify-center bg-[#F2994A] hover:bg-[#D9822B] text-white rounded-full w-12 h-12 shadow-lg focus:outline-none focus:ring-2 focus:ring-[#F2994A] cursor-pointer"
  >
    <LucidePlus class="w-6 h-6" />
  </button>
</template>

<script setup lang="ts">
import { LucidePlus } from 'lucide-vue-next'

defineEmits<{
  (e: 'click'): void
}>()
</script>
