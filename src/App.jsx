import { useKanban } from "./hooks/useKanban";
import { ErrorBoundary } from "./components/ErrorBoundary";
import Board from "./components/Board";
import "./styles.css";

export default function App() {
  const kanban = useKanban();

  return (
    <ErrorBoundary>
      <div className="app-container">
        <header className="board-header">
          <h1 className="board-title">Task Board</h1>
          <span className="board-subtitle" aria-live="polite">
            {kanban.totalTasks} tapşırıq
          </span>
        </header>

        <main>
          <Board
            data={kanban.data}
            addTask={kanban.addTask}
            deleteTask={kanban.deleteTask}
            editTask={kanban.editTask}
            moveTask={kanban.moveTask}
            reorderTask={kanban.reorderTask}
          />
        </main>
      </div>
    </ErrorBoundary>
  );
}