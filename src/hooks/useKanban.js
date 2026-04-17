import { useLocalStorage } from "./useLocalStorage";

export function useKanban() {
  const [data, setData] = useLocalStorage("kanban-data");

  const addTask = (colId, title, desc) => {
    const trimmedTitle = title?.trim();
    if (!trimmedTitle) return { error: "Başlıq boş ola bilməz" };
    if (trimmedTitle.length > 100) return { error: "Başlıq 100 simvoldan çox ola bilməz" };

    const id = `task-${Date.now()}`;
    setData((prev) => ({
      ...prev,
      tasks: {
        ...prev.tasks,
        [id]: { id, title: trimmedTitle, description: desc?.trim() ?? "" }
      },
      columns: {
        ...prev.columns,
        [colId]: {
          ...prev.columns[colId],
          taskIds: [...prev.columns[colId].taskIds, id]
        }
      }
    }));
    return { error: null };
  };

  const deleteTask = (taskId) => {
    setData((prev) => {
      const newTasks = { ...prev.tasks };
      delete newTasks[taskId];
      const newColumns = Object.fromEntries(
        Object.entries(prev.columns).map(([colId, col]) => [
          colId,
          { ...col, taskIds: col.taskIds.filter((id) => id !== taskId) }
        ])
      );
      return { ...prev, tasks: newTasks, columns: newColumns };
    });
  };

  const editTask = (taskId, newTitle, newDesc) => {
    const trimmedTitle = newTitle?.trim();
    if (!trimmedTitle) return { error: "Başlıq boş ola bilməz" };
    if (trimmedTitle.length > 100) return { error: "Başlıq 100 simvoldan çox ola bilməz" };

    setData((prev) => ({
      ...prev,
      tasks: {
        ...prev.tasks,
        [taskId]: {
          ...prev.tasks[taskId],
          title: trimmedTitle,
          description: newDesc?.trim() ?? ""
        }
      }
    }));
    return { error: null };
  };

  const moveTask = (taskId, toColumnId) => {
    setData((prev) => {
      const fromColumnId = Object.values(prev.columns).find((col) =>
        col.taskIds.includes(taskId)
      )?.id;
      if (!fromColumnId || fromColumnId === toColumnId) return prev;
      return {
        ...prev,
        columns: {
          ...prev.columns,
          [fromColumnId]: {
            ...prev.columns[fromColumnId],
            taskIds: prev.columns[fromColumnId].taskIds.filter((id) => id !== taskId)
          },
          [toColumnId]: {
            ...prev.columns[toColumnId],
            taskIds: [...prev.columns[toColumnId].taskIds, taskId]
          }
        }
      };
    });
  };

  const reorderTask = (colId, fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;
    setData((prev) => {
      const taskIds = [...prev.columns[colId].taskIds];
      const [moved] = taskIds.splice(fromIndex, 1);
      taskIds.splice(toIndex, 0, moved);
      return {
        ...prev,
        columns: {
          ...prev.columns,
          [colId]: { ...prev.columns[colId], taskIds }
        }
      };
    });
  };

  const totalTasks = Object.keys(data.tasks).length;

  return { data, totalTasks, addTask, deleteTask, editTask, moveTask, reorderTask };
}