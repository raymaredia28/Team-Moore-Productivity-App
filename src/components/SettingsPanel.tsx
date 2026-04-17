import { Moon, Sun, Type } from 'lucide-react'
import { useTaskStore } from '../store/taskStore'
import { Settings } from '../types'

const ACCENT_OPTIONS: { value: Settings['accentColor']; label: string; cls: string }[] = [
  { value: 'emerald', label: 'Sage', cls: 'bg-emerald-500' },
  { value: 'sky', label: 'Sky', cls: 'bg-sky-500' },
  { value: 'violet', label: 'Violet', cls: 'bg-violet-500' },
  { value: 'rose', label: 'Rose', cls: 'bg-rose-500' },
]

function SettingCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-100 dark:border-stone-700 p-5">
      {children}
    </div>
  )
}

function SettingLabel({ htmlFor, title, desc }: { htmlFor?: string; title: string; desc: string }) {
  return (
    <>
      {htmlFor ? (
        <label htmlFor={htmlFor} className="block text-sm font-semibold text-stone-700 dark:text-stone-200 mb-1">
          {title}
        </label>
      ) : (
        <p className="text-sm font-semibold text-stone-700 dark:text-stone-200 mb-1">{title}</p>
      )}
      <p className="text-xs text-stone-400 dark:text-stone-500 mb-4">{desc}</p>
    </>
  )
}

export function SettingsPanel() {
  const { settings, updateSettings, tasks } = useTaskStore()

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-stone-800 dark:text-stone-100">Settings</h1>
        <p className="text-stone-400 dark:text-stone-500 text-sm mt-0.5">A few small tweaks to make MindFlow yours.</p>
      </div>

      {/* Appearance: Dark mode + Text size in one card */}
      <SettingCard>
        <p className="text-sm font-semibold text-stone-700 dark:text-stone-200 mb-4">Appearance</p>

        <div className="space-y-5">
          {/* Dark mode toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {settings.darkMode ? (
                <Moon size={15} className="text-stone-500 dark:text-stone-400" />
              ) : (
                <Sun size={15} className="text-stone-500 dark:text-stone-400" />
              )}
              <div>
                <p className="text-sm font-medium text-stone-700 dark:text-stone-200">Dark mode</p>
                <p className="text-xs text-stone-400 dark:text-stone-500">Easier on the eyes at night.</p>
              </div>
            </div>
            <button
              role="switch"
              aria-checked={settings.darkMode}
              aria-label="Toggle dark mode"
              onClick={() => updateSettings({ darkMode: !settings.darkMode })}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none ${
                settings.darkMode ? 'bg-emerald-500' : 'bg-stone-200 dark:bg-stone-600'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                  settings.darkMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="border-t border-stone-100 dark:border-stone-700" />

          {/* Text size */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Type size={15} className="text-stone-500 dark:text-stone-400" />
              <div>
                <p className="text-sm font-medium text-stone-700 dark:text-stone-200">Text size</p>
                <p className="text-xs text-stone-400 dark:text-stone-500">Scales all text in the app.</p>
              </div>
            </div>
            <div className="flex gap-2" role="group" aria-label="Text size">
              {(['normal', 'large'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => updateSettings({ fontSize: size })}
                  aria-pressed={settings.fontSize === size}
                  className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none ${
                    settings.fontSize === size
                      ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                      : 'border-stone-200 dark:border-stone-600 text-stone-500 dark:text-stone-400 hover:border-stone-300 dark:hover:border-stone-500'
                  }`}
                >
                  {size === 'normal' ? 'Normal' : 'Large  A+'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </SettingCard>

      {/* Name */}
      <SettingCard>
        <SettingLabel htmlFor="name-input" title="Your name" desc="Used in the greeting on your dashboard." />
        <input
          id="name-input"
          type="text"
          value={settings.name}
          onChange={(e) => updateSettings({ name: e.target.value })}
          placeholder="e.g. Alex"
          maxLength={40}
          className="w-full border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-700 rounded-xl px-4 py-2.5 text-sm text-stone-800 dark:text-stone-100 placeholder-stone-300 dark:placeholder-stone-500 focus:border-emerald-400 dark:focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-900/30 transition-colors"
        />
      </SettingCard>

      {/* Daily task limit */}
      <SettingCard>
        <SettingLabel
          title="Daily focus limit"
          desc="How many tasks to show in your Today's Focus view. Fewer = less overwhelm."
        />
        <div className="flex gap-2" role="group" aria-label="Daily focus limit">
          {[3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => updateSettings({ dailyLimit: n })}
              aria-pressed={settings.dailyLimit === n}
              className={`flex-1 py-3 rounded-xl border-2 text-sm font-semibold transition-all focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none ${
                settings.dailyLimit === n
                  ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                  : 'border-stone-200 dark:border-stone-600 text-stone-500 dark:text-stone-400 hover:border-stone-300 dark:hover:border-stone-500'
              }`}
            >
              {n}
              {n === 3 && <span className="block text-xs font-normal opacity-60">recommended</span>}
            </button>
          ))}
        </div>
      </SettingCard>

      {/* Accent color */}
      <SettingCard>
        <SettingLabel title="Accent color" desc="A subtle personal touch. Does not affect readability." />
        <div className="flex gap-3" role="group" aria-label="Accent color">
          {ACCENT_OPTIONS.map(({ value, label, cls }) => (
            <button
              key={value}
              onClick={() => updateSettings({ accentColor: value })}
              aria-label={`${label} accent`}
              aria-pressed={settings.accentColor === value}
              className="flex flex-col items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-stone-800 focus-visible:ring-emerald-400 focus-visible:outline-none rounded-lg p-1"
            >
              <div
                className={`w-8 h-8 rounded-full ${cls} ${
                  settings.accentColor === value ? 'ring-2 ring-offset-2 dark:ring-offset-stone-800 ring-stone-400' : ''
                }`}
              />
              <span className="text-xs text-stone-500 dark:text-stone-400">{label}</span>
            </button>
          ))}
        </div>
      </SettingCard>

      {/* Stats summary */}
      <div className="bg-stone-50 dark:bg-stone-900/50 rounded-2xl border border-stone-100 dark:border-stone-800 p-5">
        <p className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-3">Your data</p>
        <div className="text-sm text-stone-500 dark:text-stone-400 space-y-1">
          <p>{tasks.length} total tasks · {tasks.filter(t => t.completed).length} completed</p>
          <p>All data is stored locally in your browser.</p>
        </div>
      </div>
    </div>
  )
}
