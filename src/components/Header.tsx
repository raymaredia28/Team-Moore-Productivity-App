import { LayoutDashboard, ListTodo, BarChart2, Settings, Zap, Moon, Sun, LucideProps } from 'lucide-react'
import { ForwardRefExoticComponent, RefAttributes } from 'react'
import { useTaskStore } from '../store/taskStore'
import { View } from '../types'

type LucideIcon = ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>

const NAV_ITEMS: { view: View; label: string; Icon: LucideIcon }[] = [
  { view: 'dashboard', label: 'Focus', Icon: LayoutDashboard },
  { view: 'all', label: 'All Tasks', Icon: ListTodo },
  { view: 'progress', label: 'Progress', Icon: BarChart2 },
  { view: 'settings', label: 'Settings', Icon: Settings },
]

export function Header() {
  const { view, setView, focusMode, settings, updateSettings } = useTaskStore()

  if (focusMode) return null

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-stone-900/90 backdrop-blur border-b border-stone-100 dark:border-stone-800 transition-colors duration-300">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center">
            <Zap size={14} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-semibold text-stone-800 dark:text-stone-100 tracking-tight">MindFlow</span>
        </div>

        <div className="flex items-center gap-1">
          <nav className="flex items-center gap-1" role="navigation" aria-label="Main navigation">
            {NAV_ITEMS.map(({ view: v, label, Icon }) => (
              <button
                key={v}
                onClick={() => setView(v)}
                aria-label={label}
                aria-current={view === v ? 'page' : undefined}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none ${
                  view === v
                    ? 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400'
                    : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800'
                }`}
              >
                <Icon size={15} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </nav>

          {/* Dark mode quick toggle */}
          <button
            onClick={() => updateSettings({ darkMode: !settings.darkMode })}
            aria-label={settings.darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-pressed={settings.darkMode}
            className="ml-1 p-2 rounded-lg text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
          >
            {settings.darkMode ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </div>
    </header>
  )
}
