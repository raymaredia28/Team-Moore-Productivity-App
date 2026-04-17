# MindFlow — Group Work Split

App is fully functional and builds clean. Each track can run in parallel with minimal conflicts.

**To run:** `npm install && npm run dev` → http://localhost:5173

---

## Track 1 — Polish & Feel
*Good for: someone comfortable with Tailwind/CSS and Framer Motion*

- **Focus Mode redesign** — currently a plain white card. Ideas: ambient gradient bg, larger task text, pulse animation, progress dots showing tasks remaining instead of "X of Y". → `src/components/Dashboard.tsx` (FocusMode function at bottom)
- **Completion confetti** — brief canvas-confetti burst when all daily tasks are done. `npm install canvas-confetti`, fire in Dashboard.tsx when `completed === total`. → `src/components/Dashboard.tsx`
- **Progress empty state** — Progress view shows raw 0/0 stats with no message when there are zero tasks. Add a friendly empty state. → `src/components/ProgressView.tsx`
- **Mobile task actions** — edit/delete buttons only appear on hover, invisible on phones. On small screens show a "..." button instead. → `src/components/TaskCard.tsx`

---

## Track 2 — Features & Interactions
*Good for: someone comfortable with React state and component logic*

- **Undo delete** (quick win) — store `lastDeletedTask` in Zustand, show a 3s toast with an Undo button. → `src/store/taskStore.ts`, new `src/components/Toast.tsx`, wire in `src/App.tsx`
- **First-run onboarding** — app opens with "Good morning." and no name. Show a one-field welcome modal on first load asking for the user's name. → new `src/components/OnboardingModal.tsx`, wire in `src/App.tsx`
- **Keyboard shortcut** — press `N` anywhere (not inside an input) to open Add Task. Add a keydown listener in `src/App.tsx`.
- **Wire accent color** — the color setting is saved but doesn't change anything visible. Create an `accentClasses` map in `src/utils/helpers.ts` and apply it across components. Search `emerald-500` to find all the spots.

---

## Track 3 — Testing & QA
*Good for: anyone — just needs a browser and the app running*

Run through each item and note Pass / Fail / Looks off.

**Core flows**
- [ ] Add a task (full wizard) → appears in Today's Focus
- [ ] Complete a task → progress bar updates, flash message shows and auto-disappears
- [ ] Edit a task → wizard opens pre-filled, changes save correctly
- [ ] Delete a task → disappears immediately
- [ ] Enter Focus Mode → complete top task → next task auto-loads
- [ ] All Tasks: active / all / done filters each show the right tasks
- [ ] Progress view: complete some tasks, check bar chart and category bars update
- [ ] Refresh the page → tasks and settings are still there

**Settings**
- [ ] Set name → greeting on dashboard updates
- [ ] Toggle dark mode → whole app switches instantly
- [ ] Switch to Large text → all text scales up, nothing overflows
- [ ] Change daily limit to 5 → Focus view shows up to 5 tasks

**Accessibility**
- [ ] Tab through the whole app — every button should show a green focus ring
- [ ] Enable OS reduced motion → animations collapse to near-instant
- [ ] Test at 150% browser zoom → nothing overflows or breaks
- [ ] Open on a phone screen (or DevTools 375px) → layout still works

**Edge cases**
- [ ] Add a task with only a title, skip all other steps
- [ ] Complete every task → dashboard shows "All caught up!" not "No tasks yet"
- [ ] Delete every task → all views show friendly empty states, no crashes
- [ ] Very long task title (120 chars) → card should not overflow

---

## Track 4 — HCI Write-up & Documentation
*Good for: whoever is working on the report or presentation*

The README already has a full HCI mapping section — use it as a starting point.

- **Map to Nielsen's heuristics** — examples already in the app: progress bar (visibility of status), edit task (user control & freedom), guided wizard (error prevention), top-3 limit (minimalist design)
- **Document the wizard rationale** — one question per step was intentional. Hick's Law: more simultaneous choices = longer decision time. Worth citing.
- **Accessibility section** — app includes keyboard navigation, aria-labels, dark mode, large text mode, reduced motion support. Document these for the accessibility requirements section.
- **Acknowledge limitations** — no backend/multi-device sync (intentional for prototype), accent color not fully wired yet (Track 2 item), mobile hover issue (Track 1 item). Honest limitation acknowledgement is standard for HCI prototypes.
- **User study questions** (if doing evaluation):
  - "How long did it take you to add your first task?"
  - "Did you feel overwhelmed at any point? Where?"
  - "Did the encouraging messages feel genuine or generic?"
  - "What would make you actually use this app daily?"
