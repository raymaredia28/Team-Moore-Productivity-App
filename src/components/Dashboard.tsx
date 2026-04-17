import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Zap, EyeOff } from 'lucide-react'
import { useTaskStore } from '../store/taskStore'
import { getTopTasks, getTodayStats, getEncouragingMessage, getGreeting } from '../utils/helpers'
import { TaskCard } from './TaskCard'
import { format } from 'date-fns'

export function Dashboard() {
  const {
    tasks,
    settings,
    openAddWizard,
    lastCompletionMessage,
    clearCompletionMessage,
    focusMode,
    toggleFocusMode,
  } = useTaskStore()

  const topTasks = getTopTasks(tasks, settings.dailyLimit)
  const { completed, total } = getTodayStats(tasks)
  const encouragement = getEncouragingMessage(completed, total)
  const progressPct = total > 0 ? Math.round((completed / total) * 100) : 0
  const greeting = getGreeting()
  const displayName = settings.name.trim()

  useEffect(() => {
    if (!lastCompletionMessage) return
    const timer = setTimeout(clearCompletionMessage, 2500)
    return () => clearTimeout(timer)
  }, [lastCompletionMessage, clearCompletionMessage])

  return (
    <div className={`transition-all duration-500 ${focusMode ? 'min-h-screen bg-stone-50 dark:bg-stone-950' : ''}`}>
      {focusMode ? (
        <FocusMode topTask={topTasks[0]} onExit={toggleFocusMode} completed={completed} total={total} />
      ) : (
        <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
          {/* Greeting */}
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs text-stone-400 dark:text-stone-500 uppercase tracking-widest font-medium mb-1">
              {format(new Date(), 'EEEE, MMMM d')}
            </p>
            <h1 className="text-2xl font-semibold text-stone-800 dark:text-stone-100">
              {greeting}{displayName ? `, ${displayName}` : ''}.
            </h1>
            <p className="text-stone-500 dark:text-stone-400 mt-1 text-sm">{encouragement}</p>
          </motion.div>

          {/* Today's progress */}
          {total > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-100 dark:border-stone-700 p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-stone-700 dark:text-stone-200">Today's progress</span>
                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  {completed}/{total} done
                </span>
              </div>
              <div className="h-2 bg-stone-100 dark:bg-stone-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-emerald-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
                />
              </div>
            </motion.div>
          )}

          {/* Completion flash message */}
          <AnimatePresence>
            {lastCompletionMessage && (
              <motion.div
                key="completion-msg"
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.97 }}
                transition={{ duration: 0.2 }}
                className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700/50 rounded-2xl px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-2"
              >
                <span>✓</span> {lastCompletionMessage}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Top priority tasks */}
          <section aria-labelledby="focus-heading">
            <div className="flex items-center justify-between mb-3">
              <h2 id="focus-heading" className="text-sm font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                Today's focus
              </h2>
              <span className="text-xs text-stone-400 dark:text-stone-500">{topTasks.length} tasks</span>
            </div>

            {topTasks.length === 0 ? (
              <EmptyFocus
                onAdd={openAddWizard}
                allDone={tasks.filter(t => !t.completed).length === 0 && tasks.length > 0}
              />
            ) : (
              <AnimatePresence mode="popLayout">
                {topTasks.map((task) => (
                  <div key={task.id} className="mb-3 last:mb-0">
                    <TaskCard task={task} prominent />
                  </div>
                ))}
              </AnimatePresence>
            )}
          </section>

          {/* Add task button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={openAddWizard}
            className="w-full py-3.5 border-2 border-dashed border-stone-200 dark:border-stone-700 rounded-2xl text-stone-400 dark:text-stone-500 hover:border-emerald-300 dark:hover:border-emerald-700 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20 transition-all flex items-center justify-center gap-2 font-medium text-sm focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
            aria-label="Add a new task"
          >
            <Plus size={16} strokeWidth={2.5} />
            Add a task
          </motion.button>

          {/* Focus mode button */}
          {topTasks.length > 0 && (
            <div className="flex justify-center">
              <button
                onClick={toggleFocusMode}
                className="flex items-center gap-1.5 text-xs text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
              >
                <Zap size={13} /> Enter focus mode
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function EmptyFocus({ onAdd, allDone }: { onAdd: () => void; allDone: boolean }) {
  if (allDone) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12 px-6 bg-white dark:bg-stone-800 rounded-2xl border border-stone-100 dark:border-stone-700"
      >
        <div className="text-3xl mb-3">🎉</div>
        <p className="font-medium text-stone-700 dark:text-stone-200 mb-1">All caught up!</p>
        <p className="text-sm text-stone-400 dark:text-stone-500 mb-5">
          You've completed everything. Add something new when you're ready.
        </p>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-stone-200 dark:border-stone-600 text-stone-600 dark:text-stone-300 rounded-xl text-sm font-medium hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
        >
          <Plus size={15} /> Add another task
        </button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-12 px-6 bg-white dark:bg-stone-800 rounded-2xl border border-stone-100 dark:border-stone-700"
    >
      <div className="text-3xl mb-3">🌱</div>
      <p className="font-medium text-stone-700 dark:text-stone-200 mb-1">No tasks yet</p>
      <p className="text-sm text-stone-400 dark:text-stone-500 mb-5">
        Add your first task and start building momentum.
      </p>
      <button
        onClick={onAdd}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
      >
        <Plus size={15} /> Add your first task
      </button>
    </motion.div>
  )
}

function FocusMode({
  topTask,
  onExit,
  completed,
  total,
}: {
  topTask: ReturnType<typeof getTopTasks>[0] | undefined
  onExit: () => void
  completed: number
  total: number
}) {
  const { toggleTask, setCompletionMessage } = useTaskStore()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm text-center"
      >
        <p className="text-xs uppercase tracking-widest text-stone-400 dark:text-stone-500 font-medium mb-8">
          Focus mode
        </p>

        {topTask ? (
          <>
            <div className="bg-white dark:bg-stone-800 rounded-3xl shadow-lg border border-stone-100 dark:border-stone-700 p-8 mb-8">
              <p className="text-xl font-semibold text-stone-800 dark:text-stone-100 leading-snug mb-6">
                {topTask.title}
              </p>
              <button
                onClick={() => {
                  setCompletionMessage('Done! Excellent work. 🎉')
                  toggleTask(topTask.id)
                }}
                className="px-8 py-3 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors text-sm focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
              >
                Mark as complete
              </button>
            </div>
            <p className="text-sm text-stone-400 dark:text-stone-500 mb-1">
              {completed} of {total} done today
            </p>
          </>
        ) : (
          <div className="bg-white dark:bg-stone-800 rounded-3xl shadow-lg border border-stone-100 dark:border-stone-700 p-8 mb-8">
            <div className="text-4xl mb-4">🎉</div>
            <p className="text-lg font-semibold text-stone-800 dark:text-stone-100">All done!</p>
            <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">
              You've completed everything on your list.
            </p>
          </div>
        )}

        <button
          onClick={onExit}
          className="flex items-center gap-2 text-sm text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 transition-colors mx-auto focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none rounded-lg px-3 py-1.5"
        >
          <EyeOff size={14} /> Exit focus mode
        </button>
      </motion.div>
    </div>
  )
}
