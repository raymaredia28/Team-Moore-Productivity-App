# MindFlow — Guided Minimalist Task Flow

A productivity web app built for CSCE 436 (HCI) that addresses cognitive overload, low retention, and complex setup found in conventional task managers. The design philosophy is: **simple, supportive, sustainable**.

---

## Setup & Running

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The app launches with realistic seeded student tasks — no signup or configuration required.

**Build for production:**
```bash
npm run build
npm run preview
```

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | React 18 + TypeScript + Vite | Fast dev, strong types, minimal config |
| Styling | Tailwind CSS v3 | Utility-first; enforces design consistency without custom CSS sprawl |
| State | Zustand + `localStorage` | Zero-backend, persists between sessions, tiny API |
| Animation | Framer Motion | Purposeful micro-animations (task completion, wizard transitions) |
| Icons | Lucide React | Clean, minimal, accessible SVGs |
| Date utils | date-fns | Lightweight, tree-shakeable |

---

## App Structure

```
src/
  components/
    Header.tsx          Navigation bar
    Dashboard.tsx       Home screen — top tasks, progress bar, focus mode
    TaskCard.tsx        Individual task row with complete/delete
    AddTaskWizard.tsx   4-step guided task entry modal
    AllTasks.tsx        Full task list with active/done filter
    ProgressView.tsx    Stats, 7-day chart, category breakdown, encouragement
    SettingsPanel.tsx   Name, daily limit, accent color
  store/
    taskStore.ts        Zustand store + localStorage persistence
  types/
    index.ts            Task, Settings, Category, Priority types
  utils/
    seed.ts             Realistic student tasks for first launch
    helpers.ts          Sorting, date formatting, encouraging messages
```

---

## Three Primary User Flows

### 1. View top priority tasks
Dashboard opens immediately to "Today's Focus" — the top N tasks (default 3) sorted by priority then due date. No scrolling, no clutter. Users see exactly what matters most.

### 2. Add a task via guided wizard
Clicking **Add a task** opens a 4-step modal, one question per step:
1. **What's the task?** — plain text input
2. **When is it due?** — 4 quick-pick options (Today / Tomorrow / This week / No rush)
3. **How important?** — 3 labeled priority buttons with plain-language descriptions
4. **What type?** — 5 icon category buttons

Selecting an option on steps 2–4 auto-advances. Each step is a single decision. The wizard closes after confirming with an encouraging message.

### 3. See progress and get feedback
The Progress view shows today's completion ratio, a weekly summary, a streak counter, a 7-day bar chart, and a contextual encouraging message that adjusts based on how much has been accomplished.

---

## How the App Maps to HCI Requirements

### Reduce cognitive overload
- Dashboard shows only the top 3 tasks (configurable to 4 or 5 in Settings)
- No dense tables, no multi-column layouts, no visible metadata unless relevant
- Focus Mode hides all navigation and presents a single task at a time

### Faster setup / fast task entry
- App launches ready-to-use with no onboarding flow or account creation
- Adding a task takes ~15 seconds via the wizard (one choice per step, auto-advance)
- All fields except the title are optional and skippable

### Supportive feedback
- Encouraging microcopy appears after completing a task (random from a pool of positive messages)
- Progress bar on the dashboard fills as tasks are completed
- Progress view uses warmly-worded insight messages that adapt to completion percentage
- Empty states use friendly, non-judgmental language ("Ready to make today count?")
- Focus Mode shows a celebration screen when all tasks are done

### Limited personalization
- Three settings only: name (for greeting), daily focus limit (3/4/5), accent color
- Settings are clearly labeled and low-stakes — changing them has immediate, visible effect
- No widget configuration, no dashboard layout options, no advanced filtering

### Sustainable use
- Data persists in `localStorage` — no account required, no data loss on refresh
- The app does not show all tasks at once on the dashboard, preventing the "wall of tasks" anxiety
- Focus Mode provides a distraction-free single-task view for sustained work sessions
- Progress streak counter rewards consistency without pressure

---

## Design Decisions

**Palette — stone + emerald:** Warm neutral backgrounds (stone-50/100) feel calm and unobtrusive. Emerald green for completion and primary actions is positive without being aggressive. Rose/amber for priority indicators use color + text labels (never color alone) for accessibility.

**One question at a time in the wizard:** Borrowed from conversational UI research — showing all fields simultaneously increases abandonment. Sequential single-choice steps feel effortless.

**Top N tasks only on dashboard:** Inspired by the "3 Most Important Tasks" concept from productivity research. Limits decisions and prevents paralysis.

**Framer Motion animations are purposeful, not decorative:** The checkbox fill animation confirms completion; the wizard slide communicates direction (forward/backward); the progress bar fill rewards progress. No animations exist purely for aesthetics.

**No backend:** For a student-targeted prototype, friction-free first use matters more than multi-device sync. `localStorage` means the app works instantly without signup.
