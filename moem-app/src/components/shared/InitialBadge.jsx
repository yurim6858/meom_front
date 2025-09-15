import React from 'react';

const InitialBadge = ({ name, size = "sm", className = "" }) => {
  const initial = name?.[0] ?? "?";
  
  const sizeClasses = {
    sm: "h-7 w-7 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base"
  };
  
  return (
    <div className={`flex items-center justify-center rounded-full bg-zinc-100 font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 ${sizeClasses[size]} ${className}`}>
      {initial}
    </div>
  );
};

export default InitialBadge;
