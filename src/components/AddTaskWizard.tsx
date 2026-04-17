import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, ChevronLeft } from 'lucide-react'
import { useTaskStore } from '../store/taskStore'
import { Category, Priority, CATEGORY_ICONS, CATEGORY_LABELS } from '../types'
import { format, addDays } from 'date-fns'

interface Props {
  editTaskId?: string
}

const STEPS = 4
const CATEGORIES: Category[] = ['study', 'health', 'personal', 'work', 'other']
const PRIORITIES: { value: Priority; label: string; desc: string; light: string; dark: string }[] = [
  {
    value: 'high',
    label: 'High',
    desc: 'Needs to happen soon',
    light: 'border-rose-300 bg-rose-50 text-rose-700',
    dark: 'dark:border-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  },
  {
    value: 'medium',
    label: 'Medium',
    desc: 'Important but flexible',
    light: 'border-amber-300 bg-amber-50 text-amber-700',
    dark: 'dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
  {
    value: 'low',
    label: 'Low',
    desc: 'Nice to get to eventually',
    light: 'border-stone-200 bg-stone-50 text-stone-600',
    dark: 'dark:border-stone-600 dark:bg-stone-700/50 dark:text-stone-300',
  },
]
const DUE_OPTIONS = [
  { label: 'Today', value: () => format(new Date(), 'yyyy-MM-dd') },
  { label: 'Tomorrow', value: () => format(addDays(new Date(), 1), 'yyyy-MM-dd') },
  { label: 'This week', value: () => format(addDays(new Date(), 5), 'yyyy-MM-dd') },
  { label: 'No rush', value: (): null => null },
]

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
}

export function AddTaskWizard({ editTaskId }: Props) {
  const { tasks, closeAddWizard, closeEditWizard, addTask, updateTask } = useTaskStore()
  const isEdit = !!editTaskId
  const existingTask = isEdit ? tasks.find((t) => t.id === editTaskId) : undefined
  const close = isEdit ? closeEditWizard : closeAddWizard

  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [title, setTitle] = useState(existingTask?.title ?? '')
  const [dueDate, setDueDate] = useState<string | null>(existingTask?.dueDate ?? null)
  const [dueDateChosen, setDueDateChosen] = useState(isEdit)
  const [priority, setPriority] = useState<Priority>(existingTask?.priority ?? 'medium')
  const [category, setCategory] = useState<Category>(existingTask?.category ?? 'study')
  const [submitted, setSubmitted] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (step === 0) setTimeout(() => inputRef.current?.focus(), 100)
  }, [step])

  function goNext() { setDirection(1); setStep((s) => s + 1) }
  function goBack() { setDirection(-1); setStep((s) => s - 1) }

  function handleSubmit() {
    if (!title.trim()) return
    if (isEdit && editTaskId) {
      updateTask(editTaskId, { title: title.trim(), dueDate, priority, category })
    } else {
      addTask({ title: title.trim(), dueDate, priority, category })
    }
    setSubmitted(true)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && step === 0 && title.trim()) goNext()
    if (e.key === 'Escape') close()
  }

  const progressPct = (step / STEPS) * 100
  const stepPrompts = isEdit
    ? ['Edit task name', 'Change due date?', 'Update priority?', 'Update category?']
    : ['What do you need to do?', 'When is it due?', 'How important is it?', 'What type of task is this?']

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 dark:bg-black/50 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-label={isEdit ? 'Edit task' : 'Add new task'}
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="w-full max-w-md bg-white dark:bg-stone-800 rounded-3xl shadow-xl overflow-hidden"
        onKeyDown={handleKeyDown}
      >
        {/* Progress bar */}
        <div className="h-1 bg-stone-100 dark:bg-stone-700">
          <motion.div
            className="h-full bg-emerald-400"
            initial={{ width: '0%' }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              {step > 0 && !submitted && (
                <button
                  onClick={goBack}
                  aria-label="Go back"
                  className="p-1.5 rounded-lg text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
                >
                  <ChevronLeft size={18} />
                </button>
              )}
              <span className="text-xs font-medium text-stone-400 dark:text-stone-500 uppercase tracking-wider">
                {submitted ? (isEdit ? 'Updated!' : 'Done!') : `Step ${step + 1} of ${STEPS}`}
              </span>
            </div>
            <button
              onClick={close}
              aria-label="Close"
              className="p-1.5 rounded-lg text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
            >
              <X size={18} />
            </button>
          </div>

          <AnimatePresence mode="wait" custom={direction}>
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
                    className="w-7 h-7 text-emerald-600 dark:text-emerald-400"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </motion.svg>
                </div>
                <h2 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-1">
                  {isEdit ? 'Changes saved!' : 'Task added!'}
                </h2>
                <p className="text-stone-500 dark:text-stone-400 text-sm mb-6">
                  {isEdit ? `"${title}" has been updated.` : `"${title}" is on your list. You've got this.`}
                </p>
                <button
                  onClick={close}
                  className="w-full py-3 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
                >
                  Back to focus
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={step}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.2, ease: 'easeInOut' }}
              >
                <h2 className="text-xl font-semibold text-stone-800 dark:text-stone-100 mb-5">
                  {stepPrompts[step]}
                </h2>

                {step === 0 && (
                  <div>
                    <input
                      ref={inputRef}
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Study for midterm, go for a run..."
                      maxLength={120}
                      className="w-full text-base text-stone-800 dark:text-stone-100 placeholder-stone-300 dark:placeholder-stone-600 border-b-2 border-stone-200 dark:border-stone-600 focus:border-emerald-400 dark:focus:border-emerald-500 outline-none pb-2 transition-colors bg-transparent"
                      aria-label="Task title"
                    />
                    <p className="text-xs text-stone-400 dark:text-stone-500 mt-2">Keep it simple — one clear action.</p>
                    <button
                      onClick={goNext}
                      disabled={!title.trim()}
                      className="mt-6 w-full py-3 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
                    >
                      Continue <ArrowRight size={16} />
                    </button>
                  </div>
                )}

                {step === 1 && (
                  <div>
                    <div className="grid grid-cols-2 gap-2">
                      {DUE_OPTIONS.map((opt) => {
                        const val = opt.value()
                        const isSelected = dueDateChosen && dueDate === val
                        return (
                          <button
                            key={opt.label}
                            onClick={() => { setDueDate(val); setDueDateChosen(true); goNext() }}
                            className={`py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all text-left focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none ${
                              isSelected
                                ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                                : 'border-stone-200 dark:border-stone-600 text-stone-600 dark:text-stone-300 hover:border-stone-300 dark:hover:border-stone-500 hover:bg-stone-50 dark:hover:bg-stone-700'
                            }`}
                          >
                            {opt.label}
                          </button>
                        )
                      })}
                    </div>
                    <button
                      onClick={goNext}
                      className="mt-4 text-sm text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 transition-colors underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none rounded"
                    >
                      Skip for now
                    </button>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-2">
                    {PRIORITIES.map((p) => (
                      <button
                        key={p.value}
                        onClick={() => { setPriority(p.value); goNext() }}
                        className={`w-full py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all text-left flex items-center justify-between focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none ${p.light} ${p.dark} ${
                          priority === p.value ? 'border-current' : 'border-stone-200 dark:border-stone-600 !bg-transparent text-stone-600 dark:text-stone-300 hover:border-stone-300 dark:hover:border-stone-500'
                        }`}
                      >
                        <span className="font-semibold">{p.label}</span>
                        <span className="text-xs opacity-70">{p.desc}</span>
                      </button>
                    ))}
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <div className="grid grid-cols-3 gap-2 mb-5">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setCategory(cat)}
                          className={`py-3 px-2 rounded-xl border-2 text-sm font-medium transition-all flex flex-col items-center gap-1 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none ${
                            category === cat
                              ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                              : 'border-stone-200 dark:border-stone-600 text-stone-600 dark:text-stone-300 hover:border-stone-300 dark:hover:border-stone-500 hover:bg-stone-50 dark:hover:bg-stone-700'
                          }`}
                        >
                          <span className="text-xl">{CATEGORY_ICONS[cat]}</span>
                          <span className="text-xs">{CATEGORY_LABELS[cat]}</span>
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={handleSubmit}
                      className="w-full py-3 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
                    >
                      {isEdit ? 'Save changes' : 'Add task'} <ArrowRight size={16} />
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
