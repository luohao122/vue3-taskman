import type { Component } from 'vue'

export type TabKey = 'All Tasks' | 'Completed'

export interface Tab {
  key: TabKey
  label: string
  component: Component
}
