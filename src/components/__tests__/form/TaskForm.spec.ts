import { describe, it, expect } from 'vitest'
import { DOMWrapper, mount } from '@vue/test-utils'

import TaskForm from '../../form/TaskForm.vue'
import type { TaskFormData } from '../../../types/task'

describe('TaskForm', () => {
  it('renders default values when no initialData is provided', () => {
    const wrapper = mount(TaskForm)
    const titleInput = wrapper.find('input#taskTitle')
    const descriptionTextarea = wrapper.find('textarea#taskDescription')
    const prioritySelect = wrapper.find('select#taskPriority')

    // We need to add typecasting to avoid TypeScript complaint
    expect((titleInput.element as HTMLInputElement).value).toBe('')
    expect((descriptionTextarea.element as HTMLTextAreaElement).value).toBe('')
    expect((prioritySelect.element as HTMLSelectElement).value).toBe('Medium')
  })

  it('renders provided initialData correctly', () => {
    const initialData: TaskFormData = {
      title: 'Test Task',
      description: 'Test Description',
      priority: 'High',
      bgColor: '#FF6B6B',
    }
    const wrapper = mount(TaskForm, { props: { initialData } })
    const titleInput = wrapper.find('input#taskTitle')
    const descriptionTextarea = wrapper.find('textarea#taskDescription')
    const prioritySelect = wrapper.find('select#taskPriority')

    // We need to add typecasting to avoid TypeScript complaint
    expect((titleInput.element as HTMLInputElement).value).toBe('Test Task')
    expect((descriptionTextarea.element as HTMLTextAreaElement).value).toBe('Test Description')
    expect((prioritySelect.element as HTMLSelectElement).value).toBe('High')
  })

  it('updates form fields when user types', async () => {
    const wrapper = mount(TaskForm)
    const titleInput = wrapper.find('input#taskTitle')
    const descriptionTextarea = wrapper.find('textarea#taskDescription')

    await titleInput.setValue('New Title')
    await descriptionTextarea.setValue('New Description')

    // Submit the form to capture the current formData
    await wrapper.find('form').trigger('submit.prevent')

    // Check if the submit event did being emitted or not
    const submitEmits = wrapper.emitted('submit')
    expect(submitEmits).toBeTruthy()
    const emittedData = submitEmits?.[0][0] as TaskFormData
    expect(emittedData.title).toBe('New Title')
    expect(emittedData.description).toBe('New Description')
  })

  it('updates bgColor when a color box is clicked', async () => {
    const wrapper = mount(TaskForm)
    // Predefined colors in component: ['#14294D', '#F2994A', '#FF6B6B', '#F2C94C']
    const colorBoxes = wrapper.findAll('div.w-8.h-8.rounded.cursor-pointer.border-2')

    let targetBox: DOMWrapper<Element> | undefined = undefined
    for (const box of colorBoxes) {
      const styleAttr = getComputedStyle(box.element).backgroundColor
      // Check if the computed background color corresponds to '#FF6B6B'
      // The RGB representation for #FF6B6B is "rgb(255, 107, 107)" (allowing for possible spacing differences)
      if (styleAttr.includes('255, 107, 107') || styleAttr.includes('255,107,107')) {
        targetBox = box
        break
      }
    }

    expect(targetBox).toBeDefined()

    if (targetBox) {
      await targetBox.trigger('click')
      // Submit form to capture formData
      await wrapper.find('form').trigger('submit.prevent')
      const emittedData = (wrapper.emitted('submit') as unknown as [TaskFormData[]])[0][0]
      expect(emittedData.bgColor).toBe('#FF6B6B')
    }
  })

  it('emits submit event with form data on form submission', async () => {
    const wrapper = mount(TaskForm)
    const titleInput = wrapper.find('input#taskTitle')
    const descriptionTextarea = wrapper.find('textarea#taskDescription')
    const prioritySelect = wrapper.find('select#taskPriority')

    await titleInput.setValue('Submit Task')
    await descriptionTextarea.setValue('Submit Description')
    await prioritySelect.setValue('Low')

    await wrapper.find('form').trigger('submit.prevent')
    const submitEmits = wrapper.emitted('submit')
    expect(submitEmits).toBeTruthy()
    const emittedData = submitEmits?.[0][0] as TaskFormData
    expect(emittedData.title).toBe('Submit Task')
    expect(emittedData.description).toBe('Submit Description')
    expect(emittedData.priority).toBe('Low')
  })
})
