import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useTaskStore } from '../store/taskStore'
import { TaskCard } from './TaskCard'
import { sortTasks } from '../utils/helpers'

type FilterOption = 'all' | 'active' | 'done'

export function AllTasks() {
  const { tasks, openAddWizard } = useTaskStore()
  const [filter, setFilter] = useState<FilterOption>('active')

  const sorted = sortTasks(tasks)
  const filtered = sorted.filter((t) => {
    if (filter === 'active') return !t.completed
    if (filter === 'done') return t.completed
    return true
  })

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-stone-800 dark:text-stone-100">All Tasks</h1>
          <p className="text-stone-400 dark:text-stone-500 text-sm mt-0.5">
            {tasks.filter((t) => !t.completed).length} remaining · {tasks.filter((t) => t.completed).length} done
          </p>
        </div>
        <button
          onClick={openAddWizard}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
        >
          <Plus size={15} strokeWidth={2.5} /> Add Task
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl mb-6 w-fit" role="group" aria-label="Filter tasks">
        {(['active', 'all', 'done'] as FilterOption[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none ${
              filter === f
                ? 'bg-white dark:bg-stone-700 text-stone-800 dark:text-stone-100 shadow-sm'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState filter={filter} onAdd={openAddWizard} />
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="space-y-2.5">
            {filtered.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  )
}

function EmptyState({ filter, onAdd }: { filter: FilterOption; onAdd: () => void }) {
  const messages: Record<FilterOption, { icon: string; title: string; body: string }> = {
    active: {
      icon: '✅',
      title: 'Nothing left to do!',
      body: "You're all caught up. Add something new when you're ready.",
    },
    done: {
      icon: '📋',
      title: 'Nothing completed yet',
      body: 'Check off tasks from your Focus view to see them here.',
    },
    all: {
      icon: '🌱',
      title: 'No tasks yet',
      body: 'Start by adding your first task.',
    },
  }
  const { icon, title, body } = messages[filter]
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-16"
    >
      <div className="text-4xl mb-3">{icon}</div>
      <p className="font-medium text-stone-700 dark:text-stone-200 mb-1">{title}</p>
      <p className="text-sm text-stone-400 dark:text-stone-500 mb-5">{body}</p>
      {filter !== 'done' && (
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 px-4 py-2 border border-stone-200 dark:border-stone-600 rounded-xl text-sm text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
        >
          <Plus size={14} /> Add a task
        </button>
      )}
    </motion.div>
  )
}
