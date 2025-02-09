<template>
  <RoundedCard class="bg-red-50 border border-red-200 mb-6">
    <div class="space-y-2 flex flex-col items-center p-3 w-full">
      <div class="flex items-center space-x-2">
        <AlertTriangle class="w-6 h-6 text-red-500" />
        <div class="text-red-500 text-center text-sm">
          <slot />
        </div>
      </div>
      <RoundedButton v-if="retry" variant="danger" @click="retry">Retry Now</RoundedButton>
    </div>
  </RoundedCard>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import type { PropType } from 'vue'
import RoundedCard from '@/components/ui/RoundedCard/RoundedCard.vue'
import RoundedButton from '@/components/ui/RoundedButton/RoundedButton.vue'
import { AlertTriangle } from 'lucide-vue-next'

defineProps({
  retry: {
    type: Function as PropType<() => void>,
    required: false,
  },
})
</script>
