import { useState, useRef, memo } from "react";
import Task from "./Task";

const COL_ORDER = ["todo", "inprog", "done"];

const Column = memo(function Column({
  column,
  tasks,
  addTask,
  moveTask,
  reorderTask,
  deleteTask,
  editTask
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [isOver, setIsOver]     = useState(false);
  const [temp, setTemp]         = useState({ title: "", desc: "" });
  const [titleError, setTitleError] = useState("");
  const dragOverIndexRef = useRef(null);
  const titleInputRef    = useRef(null);

  const handleSave = () => {
    const result = addTask(column.id, temp.title, temp.desc);
    if (result?.error) {
      setTitleError(result.error);
      titleInputRef.current?.focus();
      return;
    }
    setTemp({ title: "", desc: "" });
    setTitleError("");
    setIsAdding(false);
  };

  const handleCancel = () => {
    setTemp({ title: "", desc: "" });
    setTitleError("");
    setIsAdding(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const taskId    = e.dataTransfer.getData("taskId");
    const fromColId = e.dataTransfer.getData("colId");
    const fromIndex = parseInt(e.dataTransfer.getData("taskIndex"), 10);

    if (fromColId === column.id) {
      const toIndex = dragOverIndexRef.current ?? tasks.length;
      if (fromIndex !== toIndex) reorderTask(column.id, fromIndex, toIndex);
    } else {
      moveTask(taskId, column.id);
    }
    setIsOver(false);
    dragOverIndexRef.current = null;
  };

  // Klaviatura ilə tapşırıq hərəkəti
  const handleColKeyDown = (e, taskId, index) => {
    const ci = COL_ORDER.indexOf(column.id);
    const map = {
      ArrowLeft:  () => ci > 0                   && moveTask(taskId, COL_ORDER[ci - 1]),
      ArrowRight: () => ci < COL_ORDER.length - 1 && moveTask(taskId, COL_ORDER[ci + 1]),
      ArrowUp:    () => index > 0                 && reorderTask(column.id, index, index - 1),
      ArrowDown:  () => index < tasks.length - 1  && reorderTask(column.id, index, index + 1),
    };
    if (map[e.key]) {
      e.preventDefault();
      map[e.key]();
    }
  };

  const errorId = `col-error-${column.id}`;

  return (
    <article
      className={`col ${isOver ? "drag-over" : ""}`}
      aria-label={`${column.title} sütunu, ${tasks.length} tapşırıq`}
      onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
      onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setIsOver(false); }}
      onDrop={handleDrop}
    >
      <header className="col-header">
        <h2 className="col-title">{column.title}</h2>
        <span className="col-count" aria-hidden="true">{tasks.length}</span>
      </header>

      <ul className="task-list" role="list" aria-label={`${column.title} tapşırıqları`}>
        {tasks.map((task, index) => (
          <li key={task.id} role="listitem">
            <Task
              task={task}
              index={index}
              colId={column.id}
              deleteTask={deleteTask}
              editTask={editTask}
              onDragOverIndex={(i) => { dragOverIndexRef.current = i; }}
              onColKeyDown={(e) => handleColKeyDown(e, task.id, index)}
            />
          </li>
        ))}
      </ul>

      {isAdding ? (
        <div className="card add-card" role="form" aria-label="Yeni tapşırıq">
          <label htmlFor={`new-title-${column.id}`} className="sr-only">Başlıq</label>
          <input
            id={`new-title-${column.id}`}
            ref={titleInputRef}
            className={`taskTitle ${titleError ? "input-error" : ""}`}
            placeholder="Başlıq *"
            value={temp.title}
            autoFocus
            aria-required="true"
            aria-invalid={!!titleError}
            aria-describedby={titleError ? errorId : undefined}
            maxLength={100}
            onChange={(e) => {
              setTemp({ ...temp, title: e.target.value });
              if (e.target.value.trim()) setTitleError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter")  handleSave();
              if (e.key === "Escape") handleCancel();
            }}
          />
          {titleError && (
            <span id={errorId} className="error-msg" role="alert">{titleError}</span>
          )}
          <label htmlFor={`new-desc-${column.id}`} className="sr-only">Təsvir</label>
          <textarea
            id={`new-desc-${column.id}`}
            className="taskDesc"
            placeholder="Təsvir (istəyə bağlı)"
            value={temp.desc}
            maxLength={500}
            onChange={(e) => setTemp({ ...temp, desc: e.target.value })}
          />
          <div className="btn-row">
            <button className="taskBtn save-btn" onClick={handleSave}>Saxla</button>
            <button className="taskBtn cancel-btn" onClick={handleCancel}>Ləğv et</button>
          </div>
        </div>
      ) : (
        <button
          className="add-btn"
          onClick={() => setIsAdding(true)}
          aria-label={`${column.title} sütununa tapşırıq əlavə et`}
        >
          + tapşırıq əlavə et
        </button>
      )}
    </article>
  );
});

export default Column;