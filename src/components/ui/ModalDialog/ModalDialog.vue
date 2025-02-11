<template>
  <Teleport to="body">
    <div v-if="isOpen" role="dialog" class="fixed inset-0 z-50 overflow-hidden bg-black/50">
      <!-- Modal container -->
      <div
        ref="modalContainerRef"
        class="fixed inset-0 flex items-center justify-center p-4"
        tabindex="0"
        @click.self="handleCancel"
        @keydown.escape="handleCancel"
      >
        <FadeTransition>
          <div
            class="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-lg p-6 z-10"
          >
            <!-- Modal header -->
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200">{{ title }}</h2>
              <button
                data-test="modal-close"
                @click="handleCancel"
                class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-2xl leading-none cursor-pointer"
              >
                &times;
              </button>
            </div>

            <!-- Modal body -->
            <div>
              <slot></slot>
            </div>

            <!-- Modal Footer -->
            <!-- If no footer was provided, use the default one with Save & Cancel buttons -->
            <template v-if="$slots.footer">
              <div class="mt-6">
                <slot name="footer">
                  <div class="mt-6 flex justify-end space-x-2">
                    <button
                      @click="handleCancel"
                      class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-400 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      @click="handleSave"
                      class="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded hover:bg-blue-700 cursor-pointer"
                    >
                      Save
                    </button>
                  </div>
                </slot>
              </div>
            </template>
          </div>
        </FadeTransition>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watchEffect } from 'vue'
import FadeTransition from '@/components/ui/FadeTransition/FadeTransition.vue'

const props = defineProps<{
  isOpen: boolean
  title?: string
}>()

const emit = defineEmits<{
  (e: 'update:isOpen', value: boolean): void
  (e: 'save'): void
  (e: 'cancel'): void
}>()

const modalContainerRef = ref<HTMLDivElement | null>(null)

const handleCancel = () => {
  emit('cancel')
  emit('update:isOpen', false)
}

const handleSave = () => {
  emit('save')
  emit('update:isOpen', false)
}

// Prevent background scroll by adding a class to the body.
const disableScroll = () => document.body.classList.add('overflow-hidden')
const enableScroll = () => document.body.classList.remove('overflow-hidden')

onMounted(() => {
  if (props.isOpen) {
    disableScroll()
    nextTick(() => {
      modalContainerRef.value?.focus()
    })
  }
})

onBeforeUnmount(() => {
  enableScroll()
})

// Watch the open state to disable/enable scroll and ensure focus.
watchEffect(() => {
  if (props.isOpen) {
    disableScroll()
    nextTick(() => {
      modalContainerRef.value?.focus()
    })
  } else {
    enableScroll()
  }
})
</script>
