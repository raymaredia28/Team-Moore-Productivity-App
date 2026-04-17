import { LayoutDashboard, ListTodo, BarChart2, Settings, Zap } from 'lucide-react'
import { useTaskStore } from '../store/taskStore'
import { View } from '../types'

const NAV_ITEMS: { view: View; label: string; Icon: React.FC<{ size?: number; className?: string }> }[] = [
  { view: 'dashboard', label: 'Focus', Icon: LayoutDashboard },
  { view: 'all', label: 'All Tasks', Icon: ListTodo },
  { view: 'progress', label: 'Progress', Icon: BarChart2 },
  { view: 'settings', label: 'Settings', Icon: Settings },
]

export function Header() {
  const { view, setView, focusMode } = useTaskStore()

  if (focusMode) return null

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-stone-100">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center">
            <Zap size={14} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-semibold text-stone-800 tracking-tight">MindFlow</span>
        </div>
        <nav className="flex items-center gap-1" role="navigation" aria-label="Main navigation">
          {NAV_ITEMS.map(({ view: v, label, Icon }) => (
            <button
              key={v}
              onClick={() => setView(v)}
              aria-label={label}
              aria-current={view === v ? 'page' : undefined}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                view === v
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-stone-500 hover:text-stone-700 hover:bg-stone-50'
              }`}
            >
              <Icon size={15} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}
