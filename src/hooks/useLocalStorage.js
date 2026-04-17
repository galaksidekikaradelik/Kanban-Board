import { useState } from "react";

const INITIAL_DATA = {
  columns: {
    todo:   { id: "todo",   title: "To do",       taskIds: [] },
    inprog: { id: "inprog", title: "In progress", taskIds: [] },
    done:   { id: "done",   title: "Done",        taskIds: [] }
  },
  tasks: {}
};

export function useLocalStorage(key) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return INITIAL_DATA;
      const parsed = JSON.parse(raw);
      if (!parsed?.columns || !parsed?.tasks) return INITIAL_DATA;
      return parsed;
    } catch {
      console.warn(`[useLocalStorage] "${key}" açarı oxuna bilmədi. Default data istifadə edilir.`);
      return INITIAL_DATA;
    }
  });

  const set = (updater) => {
    setValue((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch (err) {
        console.error("[useLocalStorage] Yazma xətası:", err);
      }
      return next;
    });
  };

  return [value, set];
}