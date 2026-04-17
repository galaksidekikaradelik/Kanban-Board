import { useState, useRef, memo } from "react";

const Task = memo(function Task({ task, index, colId, deleteTask, editTask, onDragOverIndex, onColKeyDown }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData]   = useState({ title: task.title, desc: task.description });
  const [editError, setEditError] = useState("");
  const editInputRef = useRef(null);

  const handleSave = () => {
    const result = editTask(task.id, editData.title, editData.desc);
    if (result?.error) {
      setEditError(result.error);
      editInputRef.current?.focus();
      return;
    }
    setEditError("");
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({ title: task.title, desc: task.description });
    setEditError("");
    setIsEditing(false);
  };

  const errorId = `task-error-${task.id}`;

  return (
    <article
      className="card"
      draggable={!isEditing}
      tabIndex={isEditing ? -1 : 0}
      role="article"
      aria-label={`Tapşırıq: ${task.title}`}
      onDragStart={(e) => {
        e.dataTransfer.setData("taskId", task.id);
        e.dataTransfer.setData("colId", colId);
        e.dataTransfer.setData("taskIndex", String(index));
        setTimeout(() => e.target.classList.add("dragging"), 0);
      }}
      onDragEnd={(e) => e.target.classList.remove("dragging")}
      onDragOver={(e) => { e.preventDefault(); onDragOverIndex(index); }}
      onKeyDown={(e) => {
        if (!isEditing) onColKeyDown(e);
      }}
    >
      {!isEditing ? (
        <>
          <p className="card-title">{task.title}</p>
          {task.description && (
            <p className="card-desc">{task.description}</p>
          )}
          <div className="btn-row" style={{ marginTop: "8px" }}>
            <button
              className="taskBtn edit-btn"
              aria-label={`"${task.title}" tapşırığını düzəliş et`}
              onClick={() => {
                setEditData({ title: task.title, desc: task.description });
                setIsEditing(true);
                setTimeout(() => editInputRef.current?.focus(), 0);
              }}
            >
              Düzəliş
            </button>
            <button
              className="taskBtn delete-btn"
              aria-label={`"${task.title}" tapşırığını sil`}
              onClick={() => deleteTask(task.id)}
            >
              Sil
            </button>
          </div>
          <p className="sr-only">
            Klaviatura: Sol/Sağ — sütun dəyiş, Yuxarı/Aşağı — sıra dəyiş
          </p>
        </>
      ) : (
        <div role="form" aria-label="Tapşırığı düzəliş et">
          <label htmlFor={`edit-title-${task.id}`} className="sr-only">Başlıq</label>
          <input
            id={`edit-title-${task.id}`}
            ref={editInputRef}
            className={`taskTitle ${editError ? "input-error" : ""}`}
            value={editData.title}
            aria-required="true"
            aria-invalid={!!editError}
            aria-describedby={editError ? errorId : undefined}
            maxLength={100}
            onChange={(e) => {
              setEditData({ ...editData, title: e.target.value });
              if (e.target.value.trim()) setEditError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter")  handleSave();
              if (e.key === "Escape") handleCancel();
            }}
          />
          {editError && (
            <span id={errorId} className="error-msg" role="alert">{editError}</span>
          )}
          <label htmlFor={`edit-desc-${task.id}`} className="sr-only">Təsvir</label>
          <textarea
            id={`edit-desc-${task.id}`}
            className="taskDesc"
            value={editData.desc}
            maxLength={500}
            onChange={(e) => setEditData({ ...editData, desc: e.target.value })}
          />
          <div className="btn-row">
            <button className="taskBtn save-btn" onClick={handleSave}>Saxla</button>
            <button className="taskBtn cancel-btn" onClick={handleCancel}>Ləğv et</button>
          </div>
        </div>
      )}
    </article>
  );
});

export default Task;