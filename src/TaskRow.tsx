import type { Task } from './taskReducer'

type TaskRowProps = {
  task: Task
  onNext: () => void
  onDelete: () => void
}

const STATUS_LABELS: Record<Task['status'], string> = {
  todo: 'To do',
  'in-progress': 'In progress',
  done: 'Done',
}

export default function TaskRow({ task, onNext, onDelete }: TaskRowProps) {
  return (
    <li className="task-row">
      <span className="task-title">{task.title}</span>
      <span className={`status status-${task.status}`}>{STATUS_LABELS[task.status]}</span>
      <button className="button button-secondary" type="button" onClick={onNext}>
        Next <span aria-hidden="true">→</span>
      </button>
      <button className="button button-quiet" type="button" onClick={onDelete}>
        Delete
      </button>
    </li>
  )
}
