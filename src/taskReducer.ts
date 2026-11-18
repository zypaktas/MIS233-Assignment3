// Student: Zeynep Sudem Aktaş
// Student number: 2025502009
// MIS 233 - Assignment 3: Task Manager with a Reducer

import type { Filter } from './filter'

export type Status = 'todo' | 'in-progress' | 'done'
export type Task = { id: string; title: string; status: Status }

export type State = {
  tasks: Task[]
  filter: Filter
  past: Task[][]
}

export const initialState: State = {
  tasks: [],
  filter: 'all',
  past: [],
}

export type Action =
  | { type: 'add'; id: string; title: string }
  | { type: 'advance'; id: string }
  | { type: 'remove'; id: string }
  | { type: 'setFilter'; filter: Filter }
  | { type: 'clearDone' }
  | { type: 'undo' }

const NEXT: Record<Status, Status> = {
  todo: 'in-progress',
  'in-progress': 'done',
  done: 'todo',
}

function assertNever(action: never): never {
  throw new Error(`Unhandled action: ${JSON.stringify(action)}`)
}

export function taskReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'add':
      return {
        ...state,
        tasks: [...state.tasks, { id: action.id, title: action.title, status: 'todo' }],
        past: [...state.past, state.tasks],
      }

    case 'advance': {
      const taskExists = state.tasks.some((task) => task.id === action.id)
      if (!taskExists) return state

      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.id ? { ...task, status: NEXT[task.status] } : task,
        ),
        past: [...state.past, state.tasks],
      }
    }

    case 'remove': {
      const nextTasks = state.tasks.filter((task) => task.id !== action.id)
      if (nextTasks.length === state.tasks.length) return state

      return {
        ...state,
        tasks: nextTasks,
        past: [...state.past, state.tasks],
      }
    }

    case 'setFilter':
      return { ...state, filter: action.filter }

    case 'clearDone': {
      const nextTasks = state.tasks.filter((task) => task.status !== 'done')
      if (nextTasks.length === state.tasks.length) return state

      return {
        ...state,
        tasks: nextTasks,
        past: [...state.past, state.tasks],
      }
    }

    case 'undo': {
      const previousTasks = state.past[state.past.length - 1]
      if (!previousTasks) return state

      return {
        ...state,
        tasks: previousTasks.map((task) => ({ ...task })),
        past: state.past.slice(0, -1),
      }
    }

    default:
      return assertNever(action)
  }
}
