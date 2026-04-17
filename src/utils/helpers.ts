import { format, isToday, isTomorrow, isYesterday, isPast, parseISO, startOfWeek, endOfWeek } from 'date-fns'
import { Task, Priority } from '../types'

export function formatDueDate(dateStr: string | null): string {
  if (!dateStr) return ''
  const date = parseISO(dateStr)
  if (isToday(date)) return 'Today'
  if (isTomorrow(date)) return 'Tomorrow'
  if (isYesterday(date)) return 'Yesterday'
  return format(date, 'MMM d')
}

export function isDueSoon(dateStr: string | null): boolean {
  if (!dateStr) return false
  const date = parseISO(dateStr)
  return isToday(date) || isTomorrow(date)
}

export function isOverdue(task: Task): boolean {
  if (!task.dueDate || task.completed) return false
  const date = parseISO(task.dueDate)
  return isPast(date) && !isToday(date)
}

const PRIORITY_WEIGHT: Record<Priority, number> = { high: 0, medium: 1, low: 2 }

export function sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1
    const pw = PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority]
    if (pw !== 0) return pw
    if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate)
    if (a.dueDate) return -1
    if (b.dueDate) return 1
    return a.createdAt.localeCompare(b.createdAt)
  })
}

export function getTopTasks(tasks: Task[], limit: number): Task[] {
  return sortTasks(tasks.filter(t => !t.completed)).slice(0, limit)
}

export function getTodayStats(tasks: Task[]): { completed: number; total: number } {
  const today = format(new Date(), 'yyyy-MM-dd')
  const todayTasks = tasks.filter(
    t => t.dueDate === today || (t.completedAt && t.completedAt.startsWith(today))
  )
  const uniqueIds = new Set(todayTasks.map(t => t.id))
  const unique = tasks.filter(t => uniqueIds.has(t.id))
  return {
    completed: unique.filter(t => t.completed).length,
    total: unique.length,
  }
}

export function getWeekStats(tasks: Task[]): { completed: number; total: number } {
  const start = startOfWeek(new Date(), { weekStartsOn: 1 })
  const end = endOfWeek(new Date(), { weekStartsOn: 1 })
  const weekly = tasks.filter(t => {
    const created = parseISO(t.createdAt)
    return created >= start && created <= end
  })
  return {
    completed: weekly.filter(t => t.completed).length,
    total: weekly.length,
  }
}

export function getEncouragingMessage(completedToday: number, totalToday: number): string {
  if (totalToday === 0) return "Ready to make today count? Add your first task."
  if (completedToday === 0) return "You've got this. One step at a time."
  if (completedToday === totalToday) return "You finished everything today. That's amazing! 🎉"
  const pct = completedToday / totalToday
  if (pct >= 0.75) return "Almost there — you're on a roll! 🚀"
  if (pct >= 0.5) return "Halfway done. Keep going, you're building momentum."
  if (pct >= 0.25) return "Good start. Every checked box is a win."
  return "Progress is progress, no matter how small. Keep it up."
}

export function getCompletionMessage(): string {
  const messages = [
    "Nice work! ✓",
    "Done! You're making it happen.",
    "One down — you've got this.",
    "Marked complete. Great job! 🎉",
    "Progress! Keep the momentum going.",
    "Done. Every step forward counts.",
  ]
  return messages[Math.floor(Math.random() * messages.length)]
}

export function generateId(): string {
  return `task-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}
