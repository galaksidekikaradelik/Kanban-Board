import { memo } from "react";
import Column from "./Column";

const Board = memo(function Board({ data, reorderTask, ...props }) {
  return (
    <section aria-label="Kanban board" className="board">
      {Object.values(data.columns).map((col) => (
        <Column
          key={col.id}
          column={col}
          tasks={col.taskIds.map((id) => data.tasks[id])}
          reorderTask={reorderTask}
          {...props}
        />
      ))}
    </section>
  );
});

export default Board;