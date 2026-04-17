import { motion } from 'framer-motion'
import { useTaskStore } from '../store/taskStore'
import { getTodayStats, getWeekStats } from '../utils/helpers'
import { format, subDays } from 'date-fns'
import { CATEGORY_ICONS, CATEGORY_LABELS, Category } from '../types'

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-100 dark:border-stone-700 p-4">
      <p className="text-xs text-stone-400 dark:text-stone-500 uppercase tracking-wider font-medium mb-1">{label}</p>
      <p className="text-2xl font-bold text-stone-800 dark:text-stone-100">{value}</p>
      {sub && <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">{sub}</p>}
    </div>
  )
}

function getStreakDays(tasks: { completedAt: string | null }[]): number {
  let streak = 0
  const today = new Date()
  for (let i = 0; i < 30; i++) {
    const day = format(subDays(today, i), 'yyyy-MM-dd')
    const completedOnDay = tasks.some((t) => t.completedAt && t.completedAt.startsWith(day))
    if (completedOnDay) streak++
    else if (i > 0) break
  }
  return streak
}

function InsightMessage({ completed, total }: { completed: number; total: number }) {
  const pct = total === 0 ? 0 : completed / total

  let icon = '🌱'
  let message = "Every task you complete is a step forward. You're building something real."

  if (pct >= 1 && total > 0) {
    icon = '🎉'
    message = "You finished everything this week. That kind of consistency is rare — keep it up."
  } else if (pct >= 0.75) {
    icon = '🚀'
    message = "Strong week. You're getting things done. A little more and you'll have cleared the board."
  } else if (pct >= 0.5) {
    icon = '💪'
    message = "You're more than halfway through. Momentum is on your side."
  } else if (pct >= 0.25) {
    icon = '✨'
    message = "You've made a start. Each completed task builds your confidence for the next one."
  }

  return (
    <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 rounded-2xl p-4 flex gap-3">
      <span className="text-2xl">{icon}</span>
      <p className="text-sm text-emerald-800 dark:text-emerald-300 leading-relaxed">{message}</p>
    </div>
  )
}

export function ProgressView() {
  const { tasks } = useTaskStore()
  const todayStats = getTodayStats(tasks)
  const weekStats = getWeekStats(tasks)
  const streak = getStreakDays(tasks)
  const totalDone = tasks.filter((t) => t.completed).length

  const categoryBreakdown = (Object.keys(CATEGORY_LABELS) as Category[]).map((cat) => {
    const catTasks = tasks.filter((t) => t.category === cat)
    const done = catTasks.filter((t) => t.completed).length
    return { cat, total: catTasks.length, done }
  }).filter((c) => c.total > 0)

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(new Date(), 6 - i)
    const day = format(d, 'yyyy-MM-dd')
    const done = tasks.filter((t) => t.completedAt && t.completedAt.startsWith(day)).length
    return { label: format(d, 'EEE'), done }
  })
  const maxDone = Math.max(...last7.map((d) => d.done), 1)

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-stone-800 dark:text-stone-100">Your Progress</h1>
        <p className="text-stone-400 dark:text-stone-500 text-sm mt-0.5">A clear picture of what you've accomplished.</p>
      </div>

      <InsightMessage completed={weekStats.completed} total={weekStats.total} />

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Today" value={`${todayStats.completed}/${todayStats.total}`} sub="tasks done" />
        <StatCard label="This week" value={weekStats.completed} sub={`of ${weekStats.total} tasks`} />
        <StatCard label="All time" value={totalDone} sub="tasks completed" />
        <StatCard label="Streak" value={`${streak}d`} sub={streak >= 3 ? '🔥 Nice streak!' : 'Keep going!'} />
      </div>

      {/* 7-day bar chart */}
      <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-100 dark:border-stone-700 p-4">
        <p className="text-xs text-stone-400 dark:text-stone-500 uppercase tracking-wider font-medium mb-4">Last 7 days</p>
        <div className="flex items-end justify-between gap-2 h-20">
          {last7.map(({ label, done }) => (
            <div key={label} className="flex-1 flex flex-col items-center gap-1">
              <motion.div
                className="w-full rounded-t-md"
                initial={{ height: 0 }}
                animate={{ height: `${(done / maxDone) * 64}px` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                style={{
                  minHeight: done > 0 ? 4 : 2,
                  backgroundColor: done === 0 ? '#44403c' : '#34d399',
                }}
              />
              <span className="text-xs text-stone-400 dark:text-stone-500">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category breakdown */}
      {categoryBreakdown.length > 0 && (
        <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-100 dark:border-stone-700 p-4">
          <p className="text-xs text-stone-400 dark:text-stone-500 uppercase tracking-wider font-medium mb-3">By category</p>
          <div className="space-y-3">
            {categoryBreakdown.map(({ cat, total, done }) => {
              const pct = total === 0 ? 0 : Math.round((done / total) * 100)
              return (
                <div key={cat}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-stone-700 dark:text-stone-200">
                      {CATEGORY_ICONS[cat]} {CATEGORY_LABELS[cat]}
                    </span>
                    <span className="text-xs text-stone-400 dark:text-stone-500">{done}/{total}</span>
                  </div>
                  <div className="h-1.5 bg-stone-100 dark:bg-stone-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-emerald-400 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
