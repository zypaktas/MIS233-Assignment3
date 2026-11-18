import { describe, expect, it } from 'vitest'
import { initialState, taskReducer, type State, type Task } from './taskReducer'

const first: Task = { id: '1', title: 'Read slides', status: 'todo' }
const second: Task = { id: '2', title: 'Finish assignment', status: 'in-progress' }
const third: Task = { id: '3', title: 'Submit project', status: 'done' }

function stateWith(tasks: Task[]): State {
  return { tasks, filter: 'all', past: [] }
}

describe('taskReducer', () => {
  it('adds a task with todo status', () => {
    const result = taskReducer(initialState, { type: 'add', id: '1', title: 'Read slides' })
    expect(result.tasks).toEqual([first])
    expect(result.past).toEqual([[]])
  })

  it('advances through all statuses and returns to todo', () => {
    let state = stateWith([first])
    state = taskReducer(state, { type: 'advance', id: '1' })
    expect(state.tasks[0]?.status).toBe('in-progress')
    state = taskReducer(state, { type: 'advance', id: '1' })
    expect(state.tasks[0]?.status).toBe('done')
    state = taskReducer(state, { type: 'advance', id: '1' })
    expect(state.tasks[0]?.status).toBe('todo')
  })

  it('removes a task', () => {
    const result = taskReducer(stateWith([first, second]), { type: 'remove', id: '1' })
    expect(result.tasks).toEqual([second])
  })

  it('changes the filter without changing tasks or history', () => {
    const original = stateWith([first])
    const result = taskReducer(original, { type: 'setFilter', filter: 'done' })
    expect(result.filter).toBe('done')
    expect(result.tasks).toBe(original.tasks)
    expect(result.past).toBe(original.past)
  })

  it('clears all done tasks and keeps the filter', () => {
    const original = { ...stateWith([first, third]), filter: 'done' as const }
    const result = taskReducer(original, { type: 'clearDone' })
    expect(result.tasks).toEqual([first])
    expect(result.filter).toBe('done')
  })

  it('undoes the most recent task change', () => {
    const added = taskReducer(initialState, { type: 'add', id: '1', title: 'Read slides' })
    const advanced = taskReducer(added, { type: 'advance', id: '1' })
    const undone = taskReducer(advanced, { type: 'undo' })
    expect(undone.tasks).toEqual([first])
    expect(undone.past).toHaveLength(1)
  })

  it('undoes clearDone and restores completed tasks', () => {
    const state = stateWith([first, third])
    const cleared = taskReducer(state, { type: 'clearDone' })
    const undone = taskReducer(cleared, { type: 'undo' })
    expect(undone.tasks).toEqual([first, third])
  })

  it('does nothing when undo history is empty', () => {
    expect(taskReducer(initialState, { type: 'undo' })).toBe(initialState)
  })

  it('does not change the old state', () => {
    const original = stateWith([first])
    const originalSnapshot = structuredClone(original)
    taskReducer(original, { type: 'advance', id: '1' })
    expect(original).toEqual(originalSnapshot)
  })

  it('does nothing for an unknown task id', () => {
    const original = stateWith([first])
    expect(taskReducer(original, { type: 'remove', id: 'missing' })).toBe(original)
    expect(taskReducer(original, { type: 'advance', id: 'missing' })).toBe(original)
  })

  it('does not add an undo entry when clearDone has nothing to clear', () => {
    const original = stateWith([first])
    expect(taskReducer(original, { type: 'clearDone' })).toBe(original)
  })
})
