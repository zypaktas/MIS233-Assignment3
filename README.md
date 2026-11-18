# MIS 233 — Assignment 3: Task Manager with a Reducer

**Student name:** Zeynep Sudem Aktaş  
**Student number:** 2025502009

## Run the project

Requires Node.js 20.19 or newer.

```bash
npm install
npm run dev
```

## Build and tests

```bash
npm run build
npm test
```

## Project structure

- `src/taskReducer.ts` — reducer state, actions, initial state, task transitions and undo history.
- `src/filter.ts` — pure filtering and counting functions; it contains no React code.
- `src/App.tsx` — owns the state with `useReducer` and passes data/actions to child components.
- `src/TaskRow.tsx` — displays one task and its actions.
- `src/*.test.ts` — Vitest tests for the reducer and filter functions.
- `screenshots/` — the four required filter screenshots.

## Required features

The app supports adding, advancing and deleting tasks; filtering by All, To do, In progress and Done; live counts; and clearing completed tasks. The filtered list and counts are calculated during rendering and are not stored as separate state. All application state transitions are handled by `useReducer`.

## Bonus 1: Undo

The state contains `tasks`, `filter` and `past`. The `past` field stores earlier task arrays, so task-changing actions can save the previous list before updating it. The Undo action restores the most recent saved list; changing the filter does not create an undo entry.

## Bonus 2: Tests

Vitest tests cover every reducer action, status cycling, undo, immutability, unknown task IDs, empty lists, filtering and counts. Run them with `npm test`.

After running `npm test`, paste the actual terminal output here before submitting (the expected result is that both test files pass).

## Bonus 3: Explain your reducer in your own words

A reducer is a pure function because it should calculate the next state only from the current state and the action. It should not change the state object it receives. React relies on state updates producing new references so it can recognise that something changed and render the interface again. If I changed an existing task or array directly, React might not detect the update correctly, and other parts of the program could unexpectedly see the old state changed. Returning new objects and arrays makes the update predictable.

The component creates a task ID and includes it in the add action. The reducer only applies the action; it does not generate random values. This keeps the reducer predictable, which makes it easier to test and replay. The filtered task list and the counts are derived from the main task array during rendering. If I stored them separately, I could update a task from To do to In progress but forget to update the stored filtered list or count. The screen could then show stale or contradictory information.

Keeping the filter inside the reducer state makes the selected filter part of the same state model as the tasks. This means one reducer controls all related state transitions, and child components only need to dispatch actions. The trade-off is that the reducer and its state type become slightly larger, but the behaviour stays in one predictable place.

## Bonus 4: Git repository

**Repository link:** [ADD YOUR PUBLIC OR INSTRUCTOR-ACCESSIBLE GITHUB/GITLAB URL]

Create the repository, push the project, give the instructor access as instructed in Moodle, and make at least five meaningful commits. Include the `screenshots/` folder in the repository.

## Submission checklist

- [x] Student name and number are included above and in `src/taskReducer.ts`.
- [ ] Add `all.png`, `todo.png`, `in-progress.png` and `done.png` to `screenshots/`.
- [ ] Add your Git repository URL and verify the instructor has access if claiming Bonus 4.
- [ ] Run `npm run build` and `npm test` successfully.
- [ ] Zip the `assignment3` folder without `node_modules/` or `dist/`.
