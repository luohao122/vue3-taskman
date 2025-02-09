<template>
  <div class="flex items-center bg-gray-100 p-2 rounded-lg mb-8 shadow-sm">
    <LucideSearch class="w-5 h-5 text-gray-500 mr-2" />
    <input
      v-model="inputValue"
      type="text"
      placeholder="Search tasks..."
      class="w-full bg-transparent focus:outline-none"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'
import { LucideSearch } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: String as PropType<string>,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

const inputValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value),
})
</script>
