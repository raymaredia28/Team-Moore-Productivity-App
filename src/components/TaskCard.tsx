import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, AlertCircle, Pencil } from 'lucide-react'
import { Task, CATEGORY_ICONS, CATEGORY_LABELS } from '../types'
import { formatDueDate, isOverdue, isDueSoon, getCompletionMessage } from '../utils/helpers'
import { useTaskStore } from '../store/taskStore'

interface TaskCardProps {
  task: Task
  prominent?: boolean
}

const PRIORITY_COLORS = {
  high: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  low: 'bg-stone-100 text-stone-500 dark:bg-stone-700 dark:text-stone-400',
}

const PRIORITY_DOT = {
  high: 'bg-rose-400',
  medium: 'bg-amber-400',
  low: 'bg-stone-300 dark:bg-stone-500',
}

export function TaskCard({ task, prominent = false }: TaskCardProps) {
  const { toggleTask, deleteTask, openEditWizard, setCompletionMessage } = useTaskStore()
  const [showActions, setShowActions] = useState(false)

  const overdue = isOverdue(task)
  const dueSoon = isDueSoon(task.dueDate)

  function handleToggle() {
    if (!task.completed) {
      setCompletionMessage(getCompletionMessage())
    }
    toggleTask(task.id)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className={`group relative bg-white dark:bg-stone-800 rounded-2xl border transition-all ${
        prominent
          ? 'border-stone-200 dark:border-stone-700 shadow-sm hover:shadow-md dark:hover:shadow-stone-900/50 p-4'
          : 'border-stone-100 dark:border-stone-700 hover:border-stone-200 dark:hover:border-stone-600 p-3.5'
      } ${task.completed ? 'opacity-60' : ''}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start gap-3">
        {/* Completion checkbox */}
        <button
          onClick={handleToggle}
          aria-label={task.completed ? `Mark "${task.title}" incomplete` : `Complete "${task.title}"`}
          className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none ${
            task.completed
              ? 'bg-emerald-500 border-emerald-500'
              : 'border-stone-300 dark:border-stone-600 hover:border-emerald-400 dark:hover:border-emerald-500'
          }`}
        >
          {task.completed && (
            <motion.svg
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-3 h-3 text-white"
              viewBox="0 0 12 12"
              fill="none"
            >
              <path
                d="M2 6l3 3 5-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          )}
        </button>

        {/* Task content */}
        <div className="flex-1 min-w-0">
          <p
            className={`font-medium leading-snug ${
              task.completed
                ? 'line-through text-stone-400 dark:text-stone-600'
                : 'text-stone-800 dark:text-stone-100'
            } ${prominent ? 'text-base' : 'text-sm'}`}
          >
            {task.title}
          </p>

          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <span className="text-xs text-stone-400 dark:text-stone-500">
              {CATEGORY_ICONS[task.category]} {CATEGORY_LABELS[task.category]}
            </span>

            {task.dueDate && (
              <span
                className={`text-xs font-medium flex items-center gap-0.5 ${
                  overdue && !task.completed
                    ? 'text-rose-600 dark:text-rose-400'
                    : dueSoon && !task.completed
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-stone-400 dark:text-stone-500'
                }`}
              >
                {overdue && !task.completed && <AlertCircle size={11} />}
                {formatDueDate(task.dueDate)}
              </span>
            )}

            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIORITY_COLORS[task.priority]}`}>
              <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${PRIORITY_DOT[task.priority]}`} />
              {task.priority}
            </span>
          </div>
        </div>

        {/* Action buttons — visible on hover */}
        <AnimatePresence>
          {showActions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.12 }}
              className="flex items-center gap-0.5 flex-shrink-0"
            >
              {!task.completed && (
                <button
                  onClick={() => openEditWizard(task.id)}
                  aria-label={`Edit "${task.title}"`}
                  className="p-1.5 text-stone-300 dark:text-stone-600 hover:text-stone-500 dark:hover:text-stone-300 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
                >
                  <Pencil size={13} />
                </button>
              )}
              <button
                onClick={() => deleteTask(task.id)}
                aria-label={`Delete "${task.title}"`}
                className="p-1.5 text-stone-300 dark:text-stone-600 hover:text-rose-400 dark:hover:text-rose-400 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none"
              >
                <Trash2 size={13} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
