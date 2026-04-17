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
  const { view, showAddWizard, focusMode } = useTaskStore()
  const ActiveView = VIEW_COMPONENTS[view]

  return (
    <div className="min-h-dvh flex flex-col">
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
        {showAddWizard && <AddTaskWizard />}
      </AnimatePresence>
    </div>
  )
}
