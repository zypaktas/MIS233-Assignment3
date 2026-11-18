import './style.css'
import { useReducer } from 'react'
import type { Dispatch, FormEvent } from 'react'
import { taskReducer, initialState, type Action, type Task } from './taskReducer'
import { countByFilter, filterTasks, FILTERS, type Filter } from './filter'
import TaskRow from './TaskRow'

const FILTER_LABELS: Record<Filter, string> = {
  all: 'All',
  todo: 'To do',
  'in-progress': 'In progress',
  done: 'Done',
}

type AddFormProps = { dispatch: Dispatch<Action> }

function AddForm({ dispatch }: AddFormProps) {
  function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const title = String(formData.get('title') ?? '').trim()

    if (title) {
      dispatch({ type: 'add', id: crypto.randomUUID(), title })
      form.reset()
    }
  }

  return (
    <form className="add-form" onSubmit={addTask}>
      <label className="sr-only" htmlFor="new-task">New task</label>
      <input id="new-task" name="title" placeholder="What needs to get done?" />
      <button className="button button-primary" type="submit">Add task</button>
    </form>
  )
}

type FilterBarProps = {
  activeFilter: Filter
  counts: Record<Filter, number>
  dispatch: Dispatch<Action>
}

function FilterBar({ activeFilter, counts, dispatch }: FilterBarProps) {
  return (
    <nav className="filter-bar" aria-label="Filter tasks by status">
      {FILTERS.map((filter) => (
        <button
          key={filter}
          className={`filter-button${activeFilter === filter ? ' active' : ''}`}
          type="button"
          aria-pressed={activeFilter === filter}
          onClick={() => dispatch({ type: 'setFilter', filter })}
        >
          {FILTER_LABELS[filter]} <span className="filter-count">{counts[filter]}</span>
        </button>
      ))}
    </nav>
  )
}

type TaskListProps = { tasks: Task[]; dispatch: Dispatch<Action> }

function TaskList({ tasks, dispatch }: TaskListProps) {
  if (tasks.length === 0) {
    return <p className="empty-state">No tasks here. Enjoy the breathing room.</p>
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskRow
          key={task.id}
          task={task}
          onNext={() => dispatch({ type: 'advance', id: task.id })}
          onDelete={() => dispatch({ type: 'remove', id: task.id })}
        />
      ))}
    </ul>
  )
}

export default function App() {
  const [state, dispatch] = useReducer(taskReducer, initialState)

  // Both values are derived from the reducer state; neither is stored separately.
  const visibleTasks = filterTasks(state.tasks, state.filter)
  const counts = countByFilter(state.tasks)

  return (
    <main className="app-shell">
      <section className="app-card">
        <header className="app-header">
          <div>
            <p className="eyebrow">YOUR SPACE, YOUR PACE</p>
            <h1>Task Manager</h1>
            <p className="subtitle">A little progress, one task at a time.</p>
          </div>
          <div className="total-count" aria-label={`${state.tasks.length} total tasks`}>
            <strong>{state.tasks.length}</strong>
            <span>total tasks</span>
          </div>
        </header>

        <AddForm dispatch={dispatch} />

        <div className="section-heading">
          <h2>Your tasks</h2>
          <div className="task-actions">
            <button
              className="text-button"
              type="button"
              onClick={() => dispatch({ type: 'undo' })}
              disabled={state.past.length === 0}
            >
              ↶ Undo
            </button>
            <button
              className="text-button text-button-danger"
              type="button"
              onClick={() => dispatch({ type: 'clearDone' })}
              disabled={counts.done === 0}
            >
              Clear done
            </button>
          </div>
        </div>

        <FilterBar activeFilter={state.filter} counts={counts} dispatch={dispatch} />
        <TaskList tasks={visibleTasks} dispatch={dispatch} />
        <footer className="app-footer">
          <span>{visibleTasks.length} shown</span>
          <span>Changes are managed by one reducer</span>
        </footer>
      </section>
    </main>
  )
}
