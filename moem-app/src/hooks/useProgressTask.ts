import { useState, useRef, useCallback, useEffect } from 'react';


const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

export default function useProgressTask() {
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);
  const frameId = useRef<number | null>(null);
  const taskRef = useRef<{ startTime: number; duration: number } | null>(null);

  const start = useCallback((minMs: number, maxMs: number) => {

    if (taskRef.current) return;
    
    setRunning(true);
    setProgress(0);
    const duration = minMs + Math.random() * (maxMs - minMs);
    taskRef.current = { startTime: performance.now(), duration };
  }, []);

  const stop = useCallback(() => {
    setRunning(false);
    setProgress(0);
    if (frameId.current) {
      cancelAnimationFrame(frameId.current);
    }
    taskRef.current = null;
  }, []);

  const complete = useCallback(() => {

    setProgress(100);
    setRunning(false);
    if (frameId.current) {
      cancelAnimationFrame(frameId.current);
    }
    taskRef.current = null;
  }, []);

  useEffect(() => {
    if (!running || !taskRef.current) return;

    const animate = (now: number) => {
      if (!taskRef.current) return; 
      const { startTime, duration } = taskRef.current;
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const easedT = easeOutQuart(t);


      setProgress(Math.round(easedT * 99)); 

      if (t < 1) {
        frameId.current = requestAnimationFrame(animate);
      }
    };

    frameId.current = requestAnimationFrame(animate);


    return () => {
      if (frameId.current) {
        cancelAnimationFrame(frameId.current);
      }
    };
  }, [running]); 

  return { progress, running, start, complete, stop };
}