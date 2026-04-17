import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Task, Settings, View } from '../types'
import { seedTasks } from '../utils/seed'
import { generateId } from '../utils/helpers'

interface TaskStore {
  tasks: Task[]
  settings: Settings
  view: View
  showAddWizard: boolean
  editingTaskId: string | null
  focusMode: boolean
  lastCompletionMessage: string | null

  setView: (v: View) => void
  openAddWizard: () => void
  closeAddWizard: () => void
  openEditWizard: (id: string) => void
  closeEditWizard: () => void
  addTask: (partial: Omit<Task, 'id' | 'completed' | 'createdAt' | 'completedAt'>) => void
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'completed' | 'createdAt' | 'completedAt'>>) => void
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void
  updateSettings: (s: Partial<Settings>) => void
  toggleFocusMode: () => void
  clearCompletionMessage: () => void
  setCompletionMessage: (msg: string) => void
}

const getSystemDarkMode = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches

const defaultSettings: Settings = {
  name: '',
  dailyLimit: 3,
  accentColor: 'emerald',
  darkMode: getSystemDarkMode(),
  fontSize: 'normal',
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: seedTasks,
      settings: defaultSettings,
      view: 'dashboard',
      showAddWizard: false,
      editingTaskId: null,
      focusMode: false,
      lastCompletionMessage: null,

      setView: (v) => set({ view: v }),
      openAddWizard: () => set({ showAddWizard: true, editingTaskId: null }),
      closeAddWizard: () => set({ showAddWizard: false }),
      openEditWizard: (id) => set({ editingTaskId: id, showAddWizard: false }),
      closeEditWizard: () => set({ editingTaskId: null }),

      addTask: (partial) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...partial,
              id: generateId(),
              completed: false,
              createdAt: new Date().toISOString(),
              completedAt: null,
            },
          ],
        })),

      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),

      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? {
                  ...t,
                  completed: !t.completed,
                  completedAt: !t.completed ? new Date().toISOString() : null,
                }
              : t
          ),
        })),

      deleteTask: (id) =>
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),

      updateSettings: (s) =>
        set((state) => ({ settings: { ...state.settings, ...s } })),

      toggleFocusMode: () => set((state) => ({ focusMode: !state.focusMode })),

      clearCompletionMessage: () => set({ lastCompletionMessage: null }),
      setCompletionMessage: (msg) => set({ lastCompletionMessage: msg }),
    }),
    {
      name: 'mindflow-storage',
    }
  )
)
