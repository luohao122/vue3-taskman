import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { LucidePlus } from 'lucide-vue-next'

import AddTaskButton from '../../../ui/AddTaskButton/AddTaskButton.vue'

describe('AddTaskButton', () => {
  it('should renders the component correctly', () => {
    const wrapper = mount(AddTaskButton)

    expect(wrapper.exists()).toBe(true)
  })

  it('should renders the plus icon', () => {
    const wrapper = mount(AddTaskButton)
    const icon = wrapper.findComponent(LucidePlus)

    expect(icon.exists()).toBe(true)
  })

  it('should emits the click event when being clicked', async () => {
    const wrapper = mount(AddTaskButton)
    await wrapper.trigger('click')
    const emitted = wrapper.emitted('click')

    expect(emitted).toBeTruthy()
  })
})
