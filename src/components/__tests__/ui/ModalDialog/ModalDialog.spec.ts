import { describe, it, expect } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'

import ModalDialog from '../../../ui/ModalDialog/ModalDialog.vue'

// Stub FadeTransition for simplicity
const FadeTransitionStub = {
  template: '<div><slot /></div>',
}

describe('ModalDialog', () => {
  it('does not render when isOpen is false', () => {
    mount(ModalDialog, {
      props: { isOpen: false, title: 'Test Modal' },
      global: { stubs: { FadeTransition: FadeTransitionStub } },
    })
    // Query the document body for the modal container.
    const modalContent = document.body.querySelector('div[role="dialog"]')
    expect(modalContent).toBeNull()
  })

  it('renders when isOpen is true and displays the title', () => {
    mount(ModalDialog, {
      props: { isOpen: true, title: 'Test Modal' },
      global: {
        stubs: { FadeTransition: FadeTransitionStub },
      },
    })

    const modal = document.body.querySelector('div[role="dialog"]')
    expect(modal).toBeTruthy()
    expect(modal?.textContent).toContain('Test Modal')
  })

  it('renders a custom footer slot when provided', async () => {
    mount(ModalDialog, {
      attachTo: document.body, // ensure teleported content is in the DOM
      props: { isOpen: true, title: 'Test Modal' },
      slots: {
        footer: '<div class="custom-footer">Custom Footer Content</div>',
      },
      global: {
        stubs: { FadeTransition: FadeTransitionStub },
      },
    })

    await flushPromises()

    // Query document.body for the custom footer element
    const customFooter = document.body.querySelector('.custom-footer')
    expect(customFooter).toBeTruthy()
    expect(customFooter?.textContent).toContain('Custom Footer Content')
  })
})
