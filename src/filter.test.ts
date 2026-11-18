import { describe, expect, it } from 'vitest'
import { countByFilter, filterTasks } from './filter'
import type { Task } from './taskReducer'

const tasks: Task[] = [
  { id: '1', title: 'One', status: 'todo' },
  { id: '2', title: 'Two', status: 'in-progress' },
  { id: '3', title: 'Three', status: 'done' },
  { id: '4', title: 'Four', status: 'todo' },
]

describe('filterTasks', () => {
  it('returns every task for all', () => {
    expect(filterTasks(tasks, 'all')).toEqual(tasks)
  })

  it('returns only tasks matching the selected status', () => {
    expect(filterTasks(tasks, 'todo')).toEqual([tasks[0], tasks[3]])
    expect(filterTasks(tasks, 'in-progress')).toEqual([tasks[1]])
    expect(filterTasks(tasks, 'done')).toEqual([tasks[2]])
  })

  it('returns an empty array for an empty list', () => {
    expect(filterTasks([], 'done')).toEqual([])
  })
})

describe('countByFilter', () => {
  it('counts all statuses', () => {
    expect(countByFilter(tasks)).toEqual({ all: 4, todo: 2, 'in-progress': 1, done: 1 })
  })

  it('returns zero counts for an empty list', () => {
    expect(countByFilter([])).toEqual({ all: 0, todo: 0, 'in-progress': 0, done: 0 })
  })

  it('reflects a deletion when called with the updated list', () => {
    expect(countByFilter(tasks.filter((task) => task.id !== '3'))).toEqual({
      all: 3, todo: 2, 'in-progress': 1, done: 0,
    })
  })

  it('does not modify the original task array', () => {
    const original = structuredClone(tasks)
    filterTasks(tasks, 'done')
    countByFilter(tasks)
    expect(tasks).toEqual(original)
  })
})
