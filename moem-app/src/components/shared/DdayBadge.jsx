import React from 'react';

export const getDday = (dateStr) => {
  if (!dateStr) return { label: "-", tone: "text-zinc-500 bg-zinc-100 dark:bg-zinc-800" };
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dateStr);
  due.setHours(0, 0, 0, 0);
  const difference = Math.floor((due - today) / (1000 * 60 * 60 * 24));
  
  if (difference < 0) {
    return { 
      label: "마감", 
      tone: "text-red-600 bg-red-50 dark:bg-red-900/20" 
    };
  }
  if (difference === 0) {
    return { 
      label: "D-day", 
      tone: "text-orange-600 bg-orange-50 dark:bg-orange-900/20" 
    };
  }
  return { 
    label: `D-${difference}`, 
    tone: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" 
  };
};

const DdayBadge = ({ dateStr, className = "" }) => {
  const dday = getDday(dateStr);
  
  return (
    <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${dday.tone} ${className}`}>
      {dday.label}
    </span>
  );
};

export default DdayBadge;
