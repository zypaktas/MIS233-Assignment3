// Requirement R4: pure filtering and counting functions. No React in this file.
import type { Status, Task } from './taskReducer'

export type Filter = 'all' | Status

export const FILTERS: Filter[] = ['all', 'todo', 'in-progress', 'done']

/** Return the tasks to show for the chosen filter. 'all' returns every task. */
export function filterTasks(tasks: Task[], filter: Filter): Task[] {
  if (filter === 'all') return tasks
  return tasks.filter((task) => task.status === filter)
}

/** Count the tasks that each filter button would show. */
export function countByFilter(tasks: Task[]): Record<Filter, number> {
  return {
    all: tasks.length,
    todo: tasks.filter((task) => task.status === 'todo').length,
    'in-progress': tasks.filter((task) => task.status === 'in-progress').length,
    done: tasks.filter((task) => task.status === 'done').length,
  }
}
