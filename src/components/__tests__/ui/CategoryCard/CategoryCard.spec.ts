import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import CategoryCard from '../../../ui/CategoryCard/CategoryCard.vue'

describe('CategoryCard', () => {
  it('renders correctly with given props', () => {
    const wrapper = mount(CategoryCard, {
      props: {
        priority: 'High',
        count: 5,
        active: false,
      },
    })
    // Check that the priority label and count are rendered.
    expect(wrapper.text()).toContain('High')
    expect(wrapper.text()).toContain('5')
  })

  it('applies active state classes when active is true', () => {
    const wrapper = mount(CategoryCard, {
      props: {
        priority: 'Medium',
        count: 3,
        active: true,
      },
    })
    // The container div should have the active classes.
    const container = wrapper.find('div')
    expect(container.classes()).toContain('ring-2')
    expect(container.classes()).toContain('ring-blue-500')
  })

  it('computes the correct icon background class for each priority', () => {
    const testData = [
      { priority: 'High', expected: 'bg-red-300' },
      { priority: 'Medium', expected: 'bg-orange-300' },
      { priority: 'Low', expected: 'bg-blue-300' },
      { priority: 'Completed', expected: 'bg-green-300' },
      { priority: 'All', expected: 'bg-gray-300' },
    ]
    testData.forEach(({ priority, expected }) => {
      const wrapper = mount(CategoryCard, {
        props: {
          priority,
          count: 0,
        },
      })
      const iconContainer = wrapper.find('div.p-2.rounded-full.mb-2')
      expect(iconContainer.classes()).toContain(expected)
    })
  })

  it('emits filter event with correct priority when clicked', async () => {
    const wrapper = mount(CategoryCard, {
      props: {
        priority: 'Low',
        count: 2,
      },
    })
    await wrapper.trigger('click')
    const emitted = wrapper.emitted('filter')
    expect(emitted).toBeTruthy()
    expect(emitted![0][0]).toBe('Low')
  })
})
