import { useTaskStore } from '../store/taskStore'
import { Settings } from '../types'

const ACCENT_OPTIONS: { value: Settings['accentColor']; label: string; cls: string }[] = [
  { value: 'emerald', label: 'Sage', cls: 'bg-emerald-500' },
  { value: 'sky', label: 'Sky', cls: 'bg-sky-500' },
  { value: 'violet', label: 'Violet', cls: 'bg-violet-500' },
  { value: 'rose', label: 'Rose', cls: 'bg-rose-500' },
]

export function SettingsPanel() {
  const { settings, updateSettings, tasks, openAddWizard } = useTaskStore()

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-stone-800">Settings</h1>
        <p className="text-stone-400 text-sm mt-0.5">A few small tweaks to make MindFlow yours.</p>
      </div>

      {/* Name */}
      <div className="bg-white rounded-2xl border border-stone-100 p-5">
        <label htmlFor="name-input" className="block text-sm font-semibold text-stone-700 mb-1">
          Your name
        </label>
        <p className="text-xs text-stone-400 mb-3">Used in the greeting on your dashboard.</p>
        <input
          id="name-input"
          type="text"
          value={settings.name}
          onChange={(e) => updateSettings({ name: e.target.value })}
          placeholder="e.g. Alex"
          maxLength={40}
          className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 placeholder-stone-300 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-colors"
        />
      </div>

      {/* Daily task limit */}
      <div className="bg-white rounded-2xl border border-stone-100 p-5">
        <p className="text-sm font-semibold text-stone-700 mb-1">Daily focus limit</p>
        <p className="text-xs text-stone-400 mb-4">
          How many tasks to show in your Today's Focus view. Fewer = less overwhelm.
        </p>
        <div className="flex gap-2" role="group" aria-label="Daily focus limit">
          {[3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => updateSettings({ dailyLimit: n })}
              aria-pressed={settings.dailyLimit === n}
              className={`flex-1 py-3 rounded-xl border-2 text-sm font-semibold transition-all focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none ${
                settings.dailyLimit === n
                  ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                  : 'border-stone-200 text-stone-500 hover:border-stone-300'
              }`}
            >
              {n}
              {n === 3 && <span className="block text-xs font-normal opacity-60">recommended</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Accent color */}
      <div className="bg-white rounded-2xl border border-stone-100 p-5">
        <p className="text-sm font-semibold text-stone-700 mb-1">Accent color</p>
        <p className="text-xs text-stone-400 mb-4">
          A subtle personal touch. Does not affect readability.
        </p>
        <div className="flex gap-3" role="group" aria-label="Accent color">
          {ACCENT_OPTIONS.map(({ value, label, cls }) => (
            <button
              key={value}
              onClick={() => updateSettings({ accentColor: value })}
              aria-label={`${label} accent`}
              aria-pressed={settings.accentColor === value}
              className={`flex flex-col items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-400 focus-visible:outline-none rounded-lg p-1`}
            >
              <div
                className={`w-8 h-8 rounded-full ${cls} ${
                  settings.accentColor === value ? 'ring-2 ring-offset-2 ring-stone-400' : ''
                }`}
              />
              <span className="text-xs text-stone-500">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stats summary */}
      <div className="bg-stone-50 rounded-2xl border border-stone-100 p-5">
        <p className="text-sm font-semibold text-stone-700 mb-3">Your data</p>
        <div className="text-sm text-stone-500 space-y-1">
          <p>{tasks.length} total tasks · {tasks.filter(t => t.completed).length} completed</p>
          <p>All data is stored locally in your browser.</p>
        </div>
      </div>
    </div>
  )
}
