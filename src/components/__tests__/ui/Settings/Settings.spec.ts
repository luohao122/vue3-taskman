import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

import Settings from '../../../ui/Settings/Settings.vue'
import { useTaskStore } from '../../../../stores/task'

describe('Settings', () => {
  it('renders the settings title and toggles', () => {
    const wrapper = mount(Settings, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              settings: { darkMode: false, syncWithServer: false },
            },
          }),
        ],
      },
    })
    expect(wrapper.text()).toContain('Settings')
    const toggles = wrapper.findAll('input[type="checkbox"]')
    expect(toggles.length).toBe(2)
  })

  it('shows Sync Now button when syncWithServer is true', () => {
    const wrapper = mount(Settings, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              settings: { darkMode: false, syncWithServer: true },
            },
          }),
        ],
      },
    })
    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)
    expect(button.text()).toContain('Sync Now')
  })

  it('calls syncTasks when the Sync Now button is clicked', async () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        settings: { darkMode: false, syncWithServer: true },
        task: { tasks: [] },
      },
      stubActions: false,
    })
    const wrapper = mount(Settings, {
      global: {
        plugins: [pinia],
      },
    })
    const taskStore = useTaskStore()
    const syncSpy = vi.spyOn(taskStore, 'syncTasks').mockResolvedValue()
    const button = wrapper.find('button')
    await button.trigger('click')
    expect(syncSpy).toHaveBeenCalled()
    syncSpy.mockRestore()
  })
})
