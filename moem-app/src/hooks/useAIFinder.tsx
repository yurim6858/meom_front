import { useState, useCallback } from "react";
import useProgressTask from "./useProgressTask";

export function useAIFinder() {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState<{ aiName: string; userName: string }>({ aiName: "", userName: "" });
  const { progress, running, start, complete, stop } = useProgressTask();
  const [controller, setController] = useState<AbortController | null>(null);

  const runWithAIFinder = useCallback(async <T,>({
    task,
    onDone,
    aiName,
    userName,
    minMs = 3200,
    maxMs = 5000,
  }: {
    task: (signal: AbortSignal) => Promise<T>;
    onDone: (data: T) => void;
    aiName: string;
    userName: string;
    minMs?: number;
    maxMs?: number;
  }) => {
    if (running) return;
    setLabel({ aiName, userName });
    setOpen(true);
    start(minMs, maxMs);

    const ac = new AbortController();
    setController(ac);
    try {
      const data = await task(ac.signal);
      complete();
      setTimeout(() => {
        setOpen(false);
        onDone(data);
      }, 220);
    } catch (e: any) {
      stop();
      setOpen(false);
      if (e?.name !== "AbortError") console.error(e);
    } finally {
      setController(null);
    }
  }, [running, start, complete, stop]); 

  const cancel = useCallback(() => {
    controller?.abort();
    stop();
    setOpen(false);
  }, [controller, stop]);
  
  return {
    runWithAIFinder,
    running,
    cancel,
    modalProps: {
      open,
      progress,
      label,
      onCancel: cancel,
    },
  };
  
}