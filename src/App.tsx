import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTaskStore } from './store/taskStore'
import { Header } from './components/Header'
import { Dashboard } from './components/Dashboard'
import { AllTasks } from './components/AllTasks'
import { ProgressView } from './components/ProgressView'
import { SettingsPanel } from './components/SettingsPanel'
import { AddTaskWizard } from './components/AddTaskWizard'

const VIEW_COMPONENTS = {
  dashboard: Dashboard,
  all: AllTasks,
  progress: ProgressView,
  settings: SettingsPanel,
}

export function App() {
  const { view, showAddWizard, editingTaskId, settings } = useTaskStore()
  const ActiveView = VIEW_COMPONENTS[view]

  // Sync dark mode class and font size to <html> so all Tailwind dark: variants and rem units work
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', settings.darkMode)
    root.style.fontSize = settings.fontSize === 'large' ? '112.5%' : '100%'
  }, [settings.darkMode, settings.fontSize])

  return (
    <div className="min-h-dvh flex flex-col bg-stone-50 dark:bg-stone-950 transition-colors duration-300">
      <Header />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            <ActiveView />
          </motion.div>
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {showAddWizard && <AddTaskWizard key="add" />}
        {editingTaskId && <AddTaskWizard key={`edit-${editingTaskId}`} editTaskId={editingTaskId} />}
      </AnimatePresence>
    </div>
  )
}
