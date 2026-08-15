"use client";

import { useCallback, useState } from "react";

/** Move `from` to `to`, returning a new array. */
export function reorder<T>(items: T[], from: number, to: number): T[] {
  if (from === to || from < 0 || to < 0 || from >= items.length || to >= items.length) {
    return items;
  }
  const next = [...items];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

/**
 * Minimal HTML5 drag-and-drop reordering for a vertical list.
 *
 * Native DnD is used rather than a library so the customizer adds no runtime
 * dependencies. `handleProps` goes on the grab handle, `itemProps` on the row.
 */
export function useDragList<T>(items: T[], onReorder: (next: T[]) => void) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const reset = useCallback(() => {
    setDragIndex(null);
    setOverIndex(null);
  }, []);

  const move = useCallback(
    (from: number, to: number) => {
      const next = reorder(items, from, to);
      if (next !== items) onReorder(next);
    },
    [items, onReorder]
  );

  const itemProps = useCallback(
    (index: number) => ({
      onDragOver: (event: React.DragEvent) => {
        if (dragIndex === null) return;
        event.preventDefault();
        setOverIndex(index);
      },
      onDrop: (event: React.DragEvent) => {
        event.preventDefault();
        if (dragIndex !== null) move(dragIndex, index);
        reset();
      },
    }),
    [dragIndex, move, reset]
  );

  const handleProps = useCallback(
    (index: number) => ({
      draggable: true,
      onDragStart: (event: React.DragEvent) => {
        setDragIndex(index);
        event.dataTransfer.effectAllowed = "move";
        // Firefox refuses to start a drag without payload.
        event.dataTransfer.setData("text/plain", String(index));
      },
      onDragEnd: reset,
    }),
    [reset]
  );

  return { dragIndex, overIndex, itemProps, handleProps, move };
}
