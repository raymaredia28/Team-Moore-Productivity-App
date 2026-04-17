export type Priority = 'high' | 'medium' | 'low'
export type Category = 'study' | 'health' | 'personal' | 'work' | 'other'
export type View = 'dashboard' | 'all' | 'progress' | 'settings'

export interface Task {
  id: string
  title: string
  category: Category
  priority: Priority
  dueDate: string | null  // ISO date string yyyy-MM-dd or null
  completed: boolean
  createdAt: string       // ISO datetime
  completedAt: string | null
}

export interface Settings {
  name: string
  dailyLimit: number    // 3 | 4 | 5
  accentColor: 'emerald' | 'sky' | 'violet' | 'rose'
  darkMode: boolean
  fontSize: 'normal' | 'large'
}

export const CATEGORY_LABELS: Record<Category, string> = {
  study: 'Study',
  health: 'Health',
  personal: 'Personal',
  work: 'Work',
  other: 'Other',
}

export const CATEGORY_ICONS: Record<Category, string> = {
  study: '📚',
  health: '💪',
  personal: '✨',
  work: '💼',
  other: '📌',
}

export const PRIORITY_LABELS: Record<Priority, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}
