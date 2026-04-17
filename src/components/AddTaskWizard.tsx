import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, ChevronLeft } from 'lucide-react'
import { useTaskStore } from '../store/taskStore'
import { Category, Priority, CATEGORY_ICONS, CATEGORY_LABELS } from '../types'
import { format, addDays } from 'date-fns'

const STEPS = 4
const CATEGORIES: Category[] = ['study', 'health', 'personal', 'work', 'other']
const PRIORITIES: { value: Priority; label: string; desc: string; color: string }[] = [
  { value: 'high', label: 'High', desc: 'Needs to happen soon', color: 'border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100' },
  { value: 'medium', label: 'Medium', desc: 'Important but flexible', color: 'border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100' },
  { value: 'low', label: 'Low', desc: 'Nice to get to eventually', color: 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100' },
]
const DUE_OPTIONS = [
  { label: 'Today', value: () => format(new Date(), 'yyyy-MM-dd') },
  { label: 'Tomorrow', value: () => format(addDays(new Date(), 1), 'yyyy-MM-dd') },
  { label: 'This week', value: () => format(addDays(new Date(), 5), 'yyyy-MM-dd') },
  { label: 'No rush', value: () => null },
]

const STEP_PROMPTS = [
  "What do you need to do?",
  "When is it due?",
  "How important is it?",
  "What type of task is this?",
]

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
}

export function AddTaskWizard() {
  const { closeAddWizard, addTask } = useTaskStore()
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState<string | null>(null)
  const [priority, setPriority] = useState<Priority>('medium')
  const [category, setCategory] = useState<Category>('study')
  const [submitted, setSubmitted] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (step === 0) setTimeout(() => inputRef.current?.focus(), 100)
  }, [step])

  function goNext() {
    setDirection(1)
    setStep((s) => s + 1)
  }

  function goBack() {
    setDirection(-1)
    setStep((s) => s - 1)
  }

  function handleSubmit() {
    if (!title.trim()) return
    addTask({ title: title.trim(), dueDate, priority, category })
    setSubmitted(true)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && step === 0 && title.trim()) goNext()
    if (e.key === 'Escape') closeAddWizard()
  }

  const progressPct = ((step) / STEPS) * 100

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Add new task"
      onClick={(e) => e.target === e.currentTarget && closeAddWizard()}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden"
        onKeyDown={handleKeyDown}
      >
        {/* Progress bar */}
        <div className="h-1 bg-stone-100">
          <motion.div
            className="h-full bg-emerald-400"
            initial={{ width: 0 }}
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
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-50 transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
              )}
              <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">
                {submitted ? 'Done!' : `Step ${step + 1} of ${STEPS}`}
              </span>
            </div>
            <button
              onClick={closeAddWizard}
              aria-label="Close add task"
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-50 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
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
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
                    className="w-7 h-7 text-emerald-600"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </motion.svg>
                </div>
                <h2 className="text-lg font-semibold text-stone-800 mb-1">Task added!</h2>
                <p className="text-stone-500 text-sm mb-6">"{title}" is on your list. You've got this.</p>
                <button
                  onClick={closeAddWizard}
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
                <h2 className="text-xl font-semibold text-stone-800 mb-5">
                  {STEP_PROMPTS[step]}
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
                      className="w-full text-base text-stone-800 placeholder-stone-300 border-b-2 border-stone-200 focus:border-emerald-400 outline-none pb-2 transition-colors bg-transparent"
                      aria-label="Task title"
                    />
                    <p className="text-xs text-stone-400 mt-2">Keep it simple — one clear action.</p>
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
                        const selected = dueDate === val || (val === null && dueDate === null)
                        return (
                          <button
                            key={opt.label}
                            onClick={() => { setDueDate(val); goNext() }}
                            className={`py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all text-left focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none ${
                              selected
                                ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                                : 'border-stone-200 text-stone-600 hover:border-stone-300 hover:bg-stone-50'
                            }`}
                          >
                            {opt.label}
                          </button>
                        )
                      })}
                    </div>
                    <button
                      onClick={goNext}
                      className="mt-4 text-sm text-stone-400 hover:text-stone-600 transition-colors underline-offset-2 hover:underline"
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
                        className={`w-full py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all text-left flex items-center justify-between focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none ${
                          priority === p.value ? `${p.color} border-current` : `border-stone-200 hover:${p.color}`
                        } ${p.color}`}
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
                              ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                              : 'border-stone-200 text-stone-600 hover:border-stone-300 hover:bg-stone-50'
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
                      Add task <ArrowRight size={16} />
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
